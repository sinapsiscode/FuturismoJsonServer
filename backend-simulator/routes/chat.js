const express = require('express');

module.exports = (router) => {
  const chatRouter = express.Router();

  // Get all conversations for a user
  chatRouter.get('/conversations', (req, res) => {
    try {
      const db = router.db;
      const { user_id } = req.query;

      if (!user_id) {
        return res.status(400).json({
          success: false,
          error: 'user_id es requerido'
        });
      }

      // Get conversations where user is a participant
      const participations = db.get('conversation_participants')
        .filter({ user_id })
        .value() || [];

      const conversationIds = participations.map(p => p.conversation_id);

      let conversations = db.get('conversations')
        .filter(conv => conversationIds.includes(conv.id))
        .value() || [];

      // Add participant details and last message
      const users = db.get('users').value() || [];
      const messages = db.get('messages').value() || [];

      conversations = conversations.map(conversation => {
        // Get all participants
        const conversationParticipants = db.get('conversation_participants')
          .filter({ conversation_id: conversation.id })
          .value() || [];

        const participantDetails = conversationParticipants.map(participant => {
          const user = users.find(u => u.id === participant.user_id);
          return {
            ...participant,
            user: user ? {
              id: user.id,
              name: user.name,
              avatar: user.avatar,
              role: user.role
            } : null
          };
        });

        // Get last message
        const conversationMessages = messages
          .filter(m => m.conversation_id === conversation.id)
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        const lastMessage = conversationMessages[0] || null;

        // Count unread messages for current user
        const readReceipts = db.get('read_receipts').value() || [];
        const userReadReceipts = readReceipts.filter(r => r.user_id === user_id && r.conversation_id === conversation.id);
        const lastReadTime = userReadReceipts.length > 0 ?
          Math.max(...userReadReceipts.map(r => new Date(r.read_at).getTime())) : 0;

        const unreadCount = conversationMessages.filter(m =>
          m.sender_id !== user_id && new Date(m.created_at).getTime() > lastReadTime
        ).length;

        return {
          ...conversation,
          participants: participantDetails,
          last_message: lastMessage,
          unread_count: unreadCount
        };
      });

      // Sort by last message date
      conversations.sort((a, b) => {
        const dateA = a.last_message ? new Date(a.last_message.created_at) : new Date(a.created_at);
        const dateB = b.last_message ? new Date(b.last_message.created_at) : new Date(b.created_at);
        return dateB - dateA;
      });

      res.json({
        success: true,
        data: conversations,
        total: conversations.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener conversaciones'
      });
    }
  });

  // Create new conversation
  chatRouter.post('/conversations', (req, res) => {
    try {
      const db = router.db;
      const { participants, title, type = 'direct' } = req.body;

      if (!participants || participants.length < 2) {
        return res.status(400).json({
          success: false,
          error: 'Se requieren al menos 2 participantes'
        });
      }

      // Check if direct conversation already exists between these users
      if (type === 'direct' && participants.length === 2) {
        const existingParticipations = db.get('conversation_participants').value() || [];
        const existingConversation = db.get('conversations')
          .find(conv => {
            if (conv.type !== 'direct') return false;
            const convParticipants = existingParticipations
              .filter(p => p.conversation_id === conv.id)
              .map(p => p.user_id);
            return convParticipants.length === 2 &&
                   participants.every(p => convParticipants.includes(p));
          })
          .value();

        if (existingConversation) {
          return res.json({
            success: true,
            data: existingConversation,
            message: 'Conversación existente encontrada'
          });
        }
      }

      const newConversation = {
        id: `conv-${Date.now()}`,
        title: title || (type === 'direct' ? null : `Grupo ${Date.now()}`),
        type,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: participants[0]
      };

      db.get('conversations').push(newConversation).write();

      // Add participants
      const participantRecords = participants.map(userId => ({
        id: `part-${Date.now()}-${userId}`,
        conversation_id: newConversation.id,
        user_id: userId,
        joined_at: new Date().toISOString(),
        role: userId === participants[0] ? 'admin' : 'member'
      }));

      db.get('conversation_participants').push(...participantRecords).write();

      res.status(201).json({
        success: true,
        data: {
          ...newConversation,
          participants: participantRecords
        },
        message: 'Conversación creada exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al crear conversación'
      });
    }
  });

  // Get conversation messages
  chatRouter.get('/conversations/:conversationId/messages', (req, res) => {
    try {
      const db = router.db;
      const { page = 1, limit = 50 } = req.query;
      const offset = (page - 1) * limit;

      let messages = db.get('messages')
        .filter({ conversation_id: req.params.conversationId })
        .orderBy('created_at', 'desc')
        .drop(offset)
        .take(parseInt(limit))
        .value() || [];

      // Reverse to get chronological order
      messages = messages.reverse();

      // Add sender details
      const users = db.get('users').value() || [];
      messages = messages.map(message => {
        const sender = users.find(u => u.id === message.sender_id);
        return {
          ...message,
          sender: sender ? {
            id: sender.id,
            name: sender.name,
            avatar: sender.avatar,
            role: sender.role
          } : null
        };
      });

      res.json({
        success: true,
        data: messages,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: db.get('messages').filter({ conversation_id: req.params.conversationId }).size().value()
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener mensajes'
      });
    }
  });

  // Send message
  chatRouter.post('/conversations/:conversationId/messages', (req, res) => {
    try {
      const db = router.db;
      const { sender_id, content, message_type = 'text', metadata } = req.body;

      // Verify conversation exists and user is participant
      const conversation = db.get('conversations').find({ id: req.params.conversationId }).value();
      if (!conversation) {
        return res.status(404).json({
          success: false,
          error: 'Conversación no encontrada'
        });
      }

      const isParticipant = db.get('conversation_participants')
        .find({ conversation_id: req.params.conversationId, user_id: sender_id })
        .value();

      if (!isParticipant) {
        return res.status(403).json({
          success: false,
          error: 'Usuario no es participante de la conversación'
        });
      }

      const newMessage = {
        id: `msg-${Date.now()}`,
        conversation_id: req.params.conversationId,
        sender_id,
        content,
        message_type,
        metadata: metadata || {},
        created_at: new Date().toISOString(),
        edited_at: null,
        is_deleted: false
      };

      db.get('messages').push(newMessage).write();

      // Update conversation last activity
      db.get('conversations')
        .find({ id: req.params.conversationId })
        .assign({ updated_at: new Date().toISOString() })
        .write();

      // Add sender details for response
      const sender = db.get('users').find({ id: sender_id }).value();
      const messageWithSender = {
        ...newMessage,
        sender: sender ? {
          id: sender.id,
          name: sender.name,
          avatar: sender.avatar,
          role: sender.role
        } : null
      };

      res.status(201).json({
        success: true,
        data: messageWithSender,
        message: 'Mensaje enviado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al enviar mensaje'
      });
    }
  });

  // Mark messages as read
  chatRouter.post('/conversations/:conversationId/read', (req, res) => {
    try {
      const db = router.db;
      const { user_id, message_id } = req.body;

      // Verify user is participant
      const isParticipant = db.get('conversation_participants')
        .find({ conversation_id: req.params.conversationId, user_id })
        .value();

      if (!isParticipant) {
        return res.status(403).json({
          success: false,
          error: 'Usuario no es participante de la conversación'
        });
      }

      // Create or update read receipt
      const existingReceipt = db.get('read_receipts')
        .find({
          conversation_id: req.params.conversationId,
          user_id,
          message_id: message_id || undefined
        })
        .value();

      if (existingReceipt) {
        db.get('read_receipts')
          .find({
            conversation_id: req.params.conversationId,
            user_id,
            message_id: message_id || undefined
          })
          .assign({ read_at: new Date().toISOString() })
          .write();
      } else {
        const readReceipt = {
          id: `read-${Date.now()}`,
          conversation_id: req.params.conversationId,
          user_id,
          message_id: message_id || null,
          read_at: new Date().toISOString()
        };

        db.get('read_receipts').push(readReceipt).write();
      }

      res.json({
        success: true,
        message: 'Mensajes marcados como leídos'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al marcar mensajes como leídos'
      });
    }
  });

  // Edit message
  chatRouter.put('/messages/:messageId', (req, res) => {
    try {
      const db = router.db;
      const { content, edited_by } = req.body;

      const message = db.get('messages').find({ id: req.params.messageId });

      if (!message.value()) {
        return res.status(404).json({
          success: false,
          error: 'Mensaje no encontrado'
        });
      }

      // Verify user can edit (sender or admin)
      if (message.value().sender_id !== edited_by) {
        return res.status(403).json({
          success: false,
          error: 'No tienes permisos para editar este mensaje'
        });
      }

      message.assign({
        content,
        edited_at: new Date().toISOString(),
        edited_by
      }).write();

      res.json({
        success: true,
        data: message.value(),
        message: 'Mensaje editado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al editar mensaje'
      });
    }
  });

  // Delete message
  chatRouter.delete('/messages/:messageId', (req, res) => {
    try {
      const db = router.db;
      const { deleted_by } = req.body;

      const message = db.get('messages').find({ id: req.params.messageId });

      if (!message.value()) {
        return res.status(404).json({
          success: false,
          error: 'Mensaje no encontrado'
        });
      }

      // Verify user can delete (sender or admin)
      if (message.value().sender_id !== deleted_by) {
        return res.status(403).json({
          success: false,
          error: 'No tienes permisos para eliminar este mensaje'
        });
      }

      message.assign({
        is_deleted: true,
        deleted_at: new Date().toISOString(),
        deleted_by
      }).write();

      res.json({
        success: true,
        message: 'Mensaje eliminado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al eliminar mensaje'
      });
    }
  });

  // Add participant to conversation
  chatRouter.post('/conversations/:conversationId/participants', (req, res) => {
    try {
      const db = router.db;
      const { user_id, added_by } = req.body;

      // Verify conversation exists
      const conversation = db.get('conversations').find({ id: req.params.conversationId }).value();
      if (!conversation) {
        return res.status(404).json({
          success: false,
          error: 'Conversación no encontrada'
        });
      }

      // Verify user adding has permissions (admin or creator)
      const adderParticipant = db.get('conversation_participants')
        .find({ conversation_id: req.params.conversationId, user_id: added_by })
        .value();

      if (!adderParticipant || (adderParticipant.role !== 'admin' && conversation.created_by !== added_by)) {
        return res.status(403).json({
          success: false,
          error: 'No tienes permisos para agregar participantes'
        });
      }

      // Check if user is already participant
      const existingParticipant = db.get('conversation_participants')
        .find({ conversation_id: req.params.conversationId, user_id })
        .value();

      if (existingParticipant) {
        return res.status(400).json({
          success: false,
          error: 'Usuario ya es participante de la conversación'
        });
      }

      const newParticipant = {
        id: `part-${Date.now()}`,
        conversation_id: req.params.conversationId,
        user_id,
        joined_at: new Date().toISOString(),
        role: 'member'
      };

      db.get('conversation_participants').push(newParticipant).write();

      res.status(201).json({
        success: true,
        data: newParticipant,
        message: 'Participante agregado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al agregar participante'
      });
    }
  });

  // Remove participant from conversation
  chatRouter.delete('/conversations/:conversationId/participants/:userId', (req, res) => {
    try {
      const db = router.db;
      const { removed_by } = req.body;

      // Verify conversation exists
      const conversation = db.get('conversations').find({ id: req.params.conversationId }).value();
      if (!conversation) {
        return res.status(404).json({
          success: false,
          error: 'Conversación no encontrada'
        });
      }

      // Verify user removing has permissions or is removing themselves
      const removerParticipant = db.get('conversation_participants')
        .find({ conversation_id: req.params.conversationId, user_id: removed_by })
        .value();

      const canRemove = removed_by === req.params.userId || // Self removal
                       (removerParticipant && removerParticipant.role === 'admin') || // Admin removal
                       conversation.created_by === removed_by; // Creator removal

      if (!canRemove) {
        return res.status(403).json({
          success: false,
          error: 'No tienes permisos para remover este participante'
        });
      }

      const removed = db.get('conversation_participants')
        .remove({ conversation_id: req.params.conversationId, user_id: req.params.userId })
        .write();

      if (removed.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Participante no encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Participante removido exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al remover participante'
      });
    }
  });

  // Get conversation details
  chatRouter.get('/conversations/:conversationId', (req, res) => {
    try {
      const db = router.db;
      const conversation = db.get('conversations').find({ id: req.params.conversationId }).value();

      if (!conversation) {
        return res.status(404).json({
          success: false,
          error: 'Conversación no encontrada'
        });
      }

      // Get participants with user details
      const participants = db.get('conversation_participants')
        .filter({ conversation_id: req.params.conversationId })
        .value() || [];

      const users = db.get('users').value() || [];
      const participantsWithDetails = participants.map(participant => {
        const user = users.find(u => u.id === participant.user_id);
        return {
          ...participant,
          user: user ? {
            id: user.id,
            name: user.name,
            avatar: user.avatar,
            role: user.role
          } : null
        };
      });

      res.json({
        success: true,
        data: {
          ...conversation,
          participants: participantsWithDetails
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener conversación'
      });
    }
  });

  return chatRouter;
};
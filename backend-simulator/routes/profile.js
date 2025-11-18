const express = require('express');

module.exports = (router) => {
  const profileRouter = express.Router();

  // Get payment methods
  profileRouter.get('/payment-methods', (req, res) => {
    try {
      const db = router.db;
      const paymentMethods = db.get('payment_methods').value() || [];

      res.json({
        success: true,
        data: paymentMethods
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener métodos de pago'
      });
    }
  });

  // Get company data
  profileRouter.get('/company-data', (req, res) => {
    try {
      const db = router.db;
      const companyData = db.get('company_data').value() || {};

      res.json({
        success: true,
        data: companyData
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener datos de empresa'
      });
    }
  });

  // Get contact data
  profileRouter.get('/contact-data', (req, res) => {
    try {
      const db = router.db;
      const contactData = db.get('contact_data').value() || {};

      res.json({
        success: true,
        data: contactData
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener datos de contacto'
      });
    }
  });

  // Get document templates
  profileRouter.get('/document-templates', (req, res) => {
    try {
      const db = router.db;
      const documentTemplates = db.get('document_templates').value() || [];

      res.json({
        success: true,
        data: documentTemplates
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener plantillas de documentos'
      });
    }
  });

  // Get feedback data
  profileRouter.get('/feedback-data', (req, res) => {
    try {
      const db = router.db;
      const feedbackData = db.get('feedback_data').value() || {};

      res.json({
        success: true,
        data: feedbackData
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener datos de feedback'
      });
    }
  });

  // Update payment method
  profileRouter.post('/payment-methods', (req, res) => {
    try {
      const db = router.db;
      const newPaymentMethod = req.body;

      const paymentMethods = db.get('payment_methods').value() || [];
      const updatedMethods = [...paymentMethods, { ...newPaymentMethod, id: Date.now() }];

      db.set('payment_methods', updatedMethods).write();

      res.json({
        success: true,
        data: newPaymentMethod
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al agregar método de pago'
      });
    }
  });

  // Update company data
  profileRouter.put('/company-data', (req, res) => {
    try {
      const db = router.db;
      const updatedFields = req.body;

      console.log('📝 Actualizando company_data con:', updatedFields);

      // Usar assign() para actualizar objetos en lowdb v1
      db.get('company_data')
        .assign(updatedFields)
        .write();

      // Obtener datos actualizados
      const updatedData = db.get('company_data').value();

      console.log('✅ Datos de empresa actualizados en db.json:', updatedData);

      res.json({
        success: true,
        data: updatedData
      });

    } catch (error) {
      console.error('❌ Error al actualizar datos de empresa:', error);
      res.status(500).json({
        success: false,
        error: 'Error al actualizar datos de empresa',
        details: error.message
      });
    }
  });

  // Update contact data
  profileRouter.put('/contact-data', (req, res) => {
    try {
      const db = router.db;
      const updatedFields = req.body;

      console.log('📝 Actualizando contact_data con:', updatedFields);

      // Usar assign() para actualizar objetos en lowdb v1
      db.get('contact_data')
        .assign(updatedFields)
        .write();

      // Obtener datos actualizados
      const updatedData = db.get('contact_data').value();

      console.log('✅ Datos de contacto actualizados en db.json:', updatedData);

      res.json({
        success: true,
        data: updatedData
      });

    } catch (error) {
      console.error('❌ Error al actualizar datos de contacto:', error);
      res.status(500).json({
        success: false,
        error: 'Error al actualizar datos de contacto',
        details: error.message
      });
    }
  });

  return profileRouter;
};
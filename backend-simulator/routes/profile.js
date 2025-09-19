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
      const updatedCompanyData = req.body;

      db.set('company_data', updatedCompanyData).write();

      res.json({
        success: true,
        data: updatedCompanyData
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al actualizar datos de empresa'
      });
    }
  });

  return profileRouter;
};
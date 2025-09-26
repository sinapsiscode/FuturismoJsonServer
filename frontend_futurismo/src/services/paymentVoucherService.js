/**
 * Servicio para generar notas de pago/vouchers en PDF
 */

import { jsPDF } from 'jspdf';

class PaymentVoucherService {
  /**
   * Genera una nota de pago en PDF
   * @param {Object} reservation - Datos de la reserva
   * @param {Object} options - Opciones adicionales
   */
  generatePaymentVoucher(reservation, options = {}) {
    const {
      includeQR = true,
      includeTerms = true,
      format = 'A4'
    } = options;

    // Crear nuevo documento PDF
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: format
    });

    // Configurar fuentes y colores
    const primaryColor = '#2563EB'; // Azul
    const secondaryColor = '#64748B'; // Gris
    const accentColor = '#059669'; // Verde

    let yPos = 20;
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header con logo de la empresa
    this.addHeader(doc, yPos, pageWidth, margin, primaryColor);
    yPos += 40;

    // Título
    doc.setFontSize(18);
    doc.setTextColor(primaryColor);
    doc.text('NOTA DE PAGO', pageWidth / 2, yPos, { align: 'center' });
    yPos += 15;

    // Información de la reserva
    doc.setFontSize(12);
    doc.setTextColor('#000000');
    doc.text(`Reserva: #${reservation.id}`, margin, yPos);
    doc.text(`Fecha de emisión: ${new Date().toLocaleDateString('es-ES')}`, pageWidth - margin, yPos, { align: 'right' });
    yPos += 15;

    // Línea separadora
    doc.setDrawColor(primaryColor);
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 15;

    // Información del cliente
    yPos = this.addClientInfo(doc, reservation, yPos, margin, secondaryColor);
    yPos += 10;

    // Información del servicio
    yPos = this.addServiceInfo(doc, reservation, yPos, margin, secondaryColor);
    yPos += 10;

    // Detalle de precios
    yPos = this.addPriceBreakdown(doc, reservation, yPos, margin, pageWidth, accentColor);
    yPos += 15;

    // Información de pago
    yPos = this.addPaymentInfo(doc, reservation, yPos, margin, secondaryColor);

    // QR Code (si está habilitado)
    if (includeQR) {
      yPos = this.addQRCode(doc, reservation, yPos, margin, pageWidth);
    }

    // Términos y condiciones (si está habilitado)
    if (includeTerms) {
      yPos = this.addTermsAndConditions(doc, yPos, margin, pageWidth, secondaryColor);
    }

    // Footer
    this.addFooter(doc, pageWidth, margin, secondaryColor);

    return doc;
  }

  /**
   * Agrega el header con información de la empresa
   */
  addHeader(doc, yPos, pageWidth, margin, primaryColor) {
    // Logo placeholder
    doc.setFillColor(primaryColor);
    doc.rect(margin, yPos, 15, 15, 'F');
    
    // Información de la empresa
    doc.setFontSize(16);
    doc.setTextColor(primaryColor);
    doc.text('FUTURISMO TOURS', margin + 20, yPos + 8);
    
    doc.setFontSize(9);
    doc.setTextColor('#666666');
    doc.text('Av. Principal 123, Lima - Perú', margin + 20, yPos + 14);
    doc.text('Tel: +51 999 888 777 | Email: info@futurismo.com', margin + 20, yPos + 19);

    // Información de contacto alineada a la derecha
    doc.text('RUC: 20123456789', pageWidth - margin, yPos + 8, { align: 'right' });
    doc.text('www.futurismo.com', pageWidth - margin, yPos + 14, { align: 'right' });
  }

  /**
   * Agrega información del cliente
   */
  addClientInfo(doc, reservation, yPos, margin, secondaryColor) {
    doc.setFontSize(12);
    doc.setTextColor('#000000');
    doc.text('INFORMACIÓN DEL CLIENTE', margin, yPos);
    yPos += 8;

    doc.setFontSize(10);
    doc.setTextColor(secondaryColor);
    doc.text(`Cliente: ${reservation.clientName}`, margin, yPos);
    yPos += 6;
    
    if (reservation.clientPhone) {
      doc.text(`Teléfono: ${reservation.clientPhone}`, margin, yPos);
      yPos += 6;
    }
    
    if (reservation.clientEmail) {
      doc.text(`Email: ${reservation.clientEmail}`, margin, yPos);
      yPos += 6;
    }

    return yPos;
  }

  /**
   * Agrega información del servicio
   */
  addServiceInfo(doc, reservation, yPos, margin, secondaryColor) {
    doc.setFontSize(12);
    doc.setTextColor('#000000');
    doc.text('INFORMACIÓN DEL SERVICIO', margin, yPos);
    yPos += 8;

    doc.setFontSize(10);
    doc.setTextColor(secondaryColor);
    doc.text(`Tour: ${reservation.tourName}`, margin, yPos);
    yPos += 6;
    
    doc.text(`Fecha: ${new Date(reservation.date).toLocaleDateString('es-ES')}`, margin, yPos);
    yPos += 6;
    
    doc.text(`Hora: ${reservation.time}`, margin, yPos);
    yPos += 6;
    
    doc.text(`Punto de recojo: ${reservation.pickupLocation}`, margin, yPos);
    yPos += 6;
    
    doc.text(`Participantes: ${reservation.adults} adultos${reservation.children > 0 ? `, ${reservation.children} niños` : ''}`, margin, yPos);
    yPos += 6;

    if (reservation.specialRequirements) {
      doc.text(`Requerimientos especiales: ${reservation.specialRequirements}`, margin, yPos);
      yPos += 6;
    }

    return yPos;
  }

  /**
   * Agrega el desglose de precios
   */
  addPriceBreakdown(doc, reservation, yPos, margin, pageWidth, accentColor) {
    // Crear tabla de precios
    const tableStartY = yPos;
    const colWidth = (pageWidth - 2 * margin) / 3;

    // Header de tabla
    doc.setFillColor('#F8F9FA');
    doc.rect(margin, yPos, pageWidth - 2 * margin, 8, 'F');
    
    doc.setFontSize(10);
    doc.setTextColor('#000000');
    doc.text('CONCEPTO', margin + 5, yPos + 6);
    doc.text('CANTIDAD', margin + colWidth + 5, yPos + 6);
    doc.text('IMPORTE', margin + 2 * colWidth + 5, yPos + 6);
    yPos += 8;

    // Líneas de la tabla
    const pricePerAdult = reservation.pricePerAdult || (reservation.total / (reservation.adults + (reservation.children * 0.5)));
    const pricePerChild = reservation.pricePerChild || (pricePerAdult * 0.5);

    // Adultos
    doc.setTextColor('#333333');
    doc.text('Adultos', margin + 5, yPos + 6);
    doc.text(reservation.adults.toString(), margin + colWidth + 5, yPos + 6);
    doc.text(`S/. ${(pricePerAdult * reservation.adults).toFixed(2)}`, margin + 2 * colWidth + 5, yPos + 6);
    yPos += 8;

    // Niños (si hay)
    if (reservation.children > 0) {
      doc.text('Niños', margin + 5, yPos + 6);
      doc.text(reservation.children.toString(), margin + colWidth + 5, yPos + 6);
      doc.text(`S/. ${(pricePerChild * reservation.children).toFixed(2)}`, margin + 2 * colWidth + 5, yPos + 6);
      yPos += 8;
    }

    // Línea separadora
    doc.setDrawColor('#E5E7EB');
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 8;

    // Total
    doc.setFontSize(12);
    doc.setTextColor(accentColor);
    doc.setFont(undefined, 'bold');
    doc.text('TOTAL A PAGAR:', margin + colWidth, yPos + 6);
    doc.text(`S/. ${reservation.total.toFixed(2)}`, margin + 2 * colWidth + 5, yPos + 6);
    doc.setFont(undefined, 'normal');

    return yPos + 10;
  }

  /**
   * Agrega información de pago
   */
  addPaymentInfo(doc, reservation, yPos, margin, secondaryColor) {
    doc.setFontSize(12);
    doc.setTextColor('#000000');
    doc.text('INFORMACIÓN DE PAGO', margin, yPos);
    yPos += 8;

    doc.setFontSize(10);
    doc.setTextColor(secondaryColor);
    
    // Estado del pago
    const paymentStatus = reservation.paymentStatus === 'pagado' ? 'PAGADO' : 
                         reservation.paymentStatus === 'pendiente' ? 'PENDIENTE' : 
                         reservation.paymentStatus.toUpperCase();
    
    doc.text(`Estado: ${paymentStatus}`, margin, yPos);
    yPos += 6;

    // Métodos de pago disponibles
    doc.text('Métodos de pago disponibles:', margin, yPos);
    yPos += 6;
    doc.text('• Efectivo', margin + 5, yPos);
    yPos += 5;
    doc.text('• Transferencia bancaria: BCP 123-456-789', margin + 5, yPos);
    yPos += 5;
    doc.text('• Yape/Plin: +51 999 888 777', margin + 5, yPos);
    yPos += 5;
    doc.text('• Tarjeta de crédito/débito', margin + 5, yPos);
    yPos += 8;

    // Plazo de pago
    if (reservation.paymentStatus === 'pendiente') {
      const paymentDue = new Date(reservation.date);
      paymentDue.setDate(paymentDue.getDate() - 1);
      
      doc.setTextColor('#DC2626');
      doc.text(`Fecha límite de pago: ${paymentDue.toLocaleDateString('es-ES')}`, margin, yPos);
      yPos += 8;
    }

    return yPos;
  }

  /**
   * Agrega código QR (placeholder)
   */
  addQRCode(doc, reservation, yPos, margin, pageWidth) {
    const qrSize = 25;
    const qrX = pageWidth - margin - qrSize;

    // QR Code placeholder
    doc.setDrawColor('#666666');
    doc.rect(qrX, yPos, qrSize, qrSize);
    doc.setFontSize(8);
    doc.setTextColor('#666666');
    doc.text('QR CODE', qrX + qrSize/2, yPos + qrSize/2, { align: 'center' });

    doc.setFontSize(10);
    doc.text('Escanea para ver', qrX, yPos + qrSize + 5, { align: 'center' });
    doc.text('estado de reserva', qrX, yPos + qrSize + 10, { align: 'center' });

    return yPos + qrSize + 15;
  }

  /**
   * Agrega términos y condiciones
   */
  addTermsAndConditions(doc, yPos, margin, pageWidth, secondaryColor) {
    if (yPos > 230) { // Nueva página si no hay espacio
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(10);
    doc.setTextColor(secondaryColor);
    doc.text('TÉRMINOS Y CONDICIONES:', margin, yPos);
    yPos += 8;

    const terms = [
      '• El pago debe realizarse antes de la fecha límite indicada.',
      '• Las cancelaciones deben notificarse 24 horas antes del servicio.',
      '• Los reembolsos están sujetos a condiciones específicas.',
      '• El servicio está sujeto a condiciones climáticas favorables.',
      '• La empresa se reserva el derecho de reprogramar por causas de fuerza mayor.',
      '• El cliente debe presentarse 15 minutos antes en el punto de recojo.'
    ];

    doc.setFontSize(8);
    terms.forEach(term => {
      doc.text(term, margin, yPos);
      yPos += 5;
    });

    return yPos + 10;
  }

  /**
   * Agrega footer
   */
  addFooter(doc, pageWidth, margin, secondaryColor) {
    const pageHeight = doc.internal.pageSize.getHeight();
    const footerY = pageHeight - 15;

    doc.setFontSize(8);
    doc.setTextColor(secondaryColor);
    doc.text('FUTURISMO TOURS - Experiencias turísticas únicas en Perú', pageWidth / 2, footerY, { align: 'center' });
    doc.text(`Generado el ${new Date().toLocaleDateString('es-ES')} a las ${new Date().toLocaleTimeString('es-ES')}`, pageWidth / 2, footerY + 5, { align: 'center' });
  }

  /**
   * Descarga el PDF
   */
  downloadVoucher(reservation, filename) {
    const doc = this.generatePaymentVoucher(reservation);
    const fileName = filename || `nota-pago-${reservation.id}.pdf`;
    doc.save(fileName);
  }

  /**
   * Obtiene el PDF como blob para envío por email
   */
  getVoucherBlob(reservation) {
    const doc = this.generatePaymentVoucher(reservation);
    return doc.output('blob');
  }

  /**
   * Previsualiza el PDF en una nueva ventana
   */
  previewVoucher(reservation) {
    const doc = this.generatePaymentVoucher(reservation);
    const pdfBlob = doc.output('blob');
    const url = URL.createObjectURL(pdfBlob);
    window.open(url, '_blank');
  }
}

export const paymentVoucherService = new PaymentVoucherService();
export default paymentVoucherService;
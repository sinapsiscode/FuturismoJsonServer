import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Configuración de colores y estilos
const colors = {
  primary: [59, 130, 246], // blue-500
  secondary: [107, 114, 128], // gray-500
  success: [16, 185, 129], // green-500
  text: [31, 41, 55], // gray-800
  lightGray: [249, 250, 251], // gray-50
  border: [229, 231, 235] // gray-200
};

class PDFService {
  constructor() {
    this.pdf = null;
    this.pageHeight = 297; // A4 height in mm
    this.pageWidth = 210; // A4 width in mm
    this.margin = 20;
    this.currentY = this.margin;
  }

  /**
   * Genera PDF de asignación de proveedores
   */
  generateProviderAssignmentPDF(assignmentData, options = {}) {
    const {
      forAgency = true,
      forGuide = false,
      includeContactDetails = true,
      includeNotes = true
    } = options;

    // Crear nuevo documento PDF
    this.pdf = new jsPDF();
    this.currentY = this.margin;

    // Header del documento
    this._addHeader(assignmentData, forAgency ? 'AGENCIA' : 'GUÍA');

    // Información del tour
    this._addTourInformation(assignmentData);

    // Tabla de proveedores asignados
    this._addProvidersTable(assignmentData.providers, {
      includeContactDetails,
      includeNotes
    });

    // Mapa de ubicaciones (si hay múltiples ubicaciones)
    this._addLocationMap(assignmentData);

    // Footer con información de contacto
    this._addFooter(forAgency);

    // Si es para el guía, agregar página adicional con instrucciones
    if (forGuide) {
      this._addGuideInstructions(assignmentData);
    }

    return this.pdf;
  }

  /**
   * Descargar PDF
   */
  downloadPDF(assignmentData, filename = null) {
    if (!filename) {
      const tourName = assignmentData.tourName.replace(/[^a-zA-Z0-9]/g, '_');
      const date = format(new Date(assignmentData.date), 'yyyy-MM-dd');
      filename = `proveedores_${tourName}_${date}.pdf`;
    }

    const pdf = this.generateProviderAssignmentPDF(assignmentData);
    pdf.save(filename);
  }

  /**
   * Obtener PDF como blob para envío por email
   */
  getPDFBlob(assignmentData, options = {}) {
    const pdf = this.generateProviderAssignmentPDF(assignmentData, options);
    return pdf.output('blob');
  }

  /**
   * Header del documento
   */
  _addHeader(assignmentData, recipient) {
    const pdf = this.pdf;
    
    // Logo/Título de la empresa
    pdf.setFontSize(20);
    pdf.setTextColor(...colors.primary);
    pdf.text('FUTURISMO TOURS', this.margin, this.currentY);
    
    // Línea decorativa
    pdf.setDrawColor(...colors.primary);
    pdf.setLineWidth(0.5);
    pdf.line(this.margin, this.currentY + 5, this.pageWidth - this.margin, this.currentY + 5);
    
    this.currentY += 15;

    // Título del documento
    pdf.setFontSize(16);
    pdf.setTextColor(...colors.text);
    pdf.text(`ITINERARIO DE PROVEEDORES - ${recipient}`, this.margin, this.currentY);
    
    this.currentY += 10;

    // Información básica en dos columnas
    const leftColumn = this.margin;
    const rightColumn = this.pageWidth / 2 + 10;

    pdf.setFontSize(10);
    pdf.setTextColor(...colors.secondary);

    // Columna izquierda
    pdf.text('Tour:', leftColumn, this.currentY);
    pdf.setTextColor(...colors.text);
    pdf.text(assignmentData.tourName, leftColumn + 15, this.currentY);

    // Columna derecha
    pdf.setTextColor(...colors.secondary);
    pdf.text('Fecha:', rightColumn, this.currentY);
    pdf.setTextColor(...colors.text);
    pdf.text(format(new Date(assignmentData.date), 'dd/MM/yyyy', { locale: es }), rightColumn + 15, this.currentY);

    this.currentY += 8;

    // Segunda fila
    pdf.setTextColor(...colors.secondary);
    pdf.text('Generado:', leftColumn, this.currentY);
    pdf.setTextColor(...colors.text);
    pdf.text(format(new Date(), 'dd/MM/yyyy HH:mm', { locale: es }), leftColumn + 20, this.currentY);

    pdf.setTextColor(...colors.secondary);
    pdf.text('Proveedores:', rightColumn, this.currentY);
    pdf.setTextColor(...colors.text);
    pdf.text(`${assignmentData.providers.length} asignados`, rightColumn + 25, this.currentY);

    this.currentY += 15;
  }

  /**
   * Información del tour
   */
  _addTourInformation(assignmentData) {
    const pdf = this.pdf;

    // Título de sección
    pdf.setFontSize(12);
    pdf.setTextColor(...colors.primary);
    pdf.text('INFORMACIÓN DEL TOUR', this.margin, this.currentY);
    
    this.currentY += 8;

    // Cuadro con información
    const boxY = this.currentY;
    const boxHeight = 25;

    pdf.setFillColor(...colors.lightGray);
    pdf.rect(this.margin, boxY, this.pageWidth - (this.margin * 2), boxHeight, 'F');
    
    pdf.setDrawColor(...colors.border);
    pdf.rect(this.margin, boxY, this.pageWidth - (this.margin * 2), boxHeight);

    this.currentY += 8;

    pdf.setFontSize(10);
    pdf.setTextColor(...colors.text);

    // Tour y fecha
    pdf.text(`Tour: ${assignmentData.tourName}`, this.margin + 5, this.currentY);
    this.currentY += 6;
    pdf.text(`Fecha: ${format(new Date(assignmentData.date), 'EEEE, dd \'de\' MMMM \'de\' yyyy', { locale: es })}`, this.margin + 5, this.currentY);
    this.currentY += 6;

    if (assignmentData.notes) {
      pdf.text(`Notas: ${assignmentData.notes}`, this.margin + 5, this.currentY);
    }

    this.currentY = boxY + boxHeight + 10;
  }

  /**
   * Tabla de proveedores
   */
  _addProvidersTable(providers, options = {}) {
    const pdf = this.pdf;
    const { includeContactDetails, includeNotes } = options;

    // Título de sección
    pdf.setFontSize(12);
    pdf.setTextColor(...colors.primary);
    pdf.text('CRONOGRAMA DE PROVEEDORES', this.margin, this.currentY);
    
    this.currentY += 10;

    // Preparar datos para la tabla
    const headers = [
      'Hora',
      'Proveedor',
      'Ubicación',
      'Servicio'
    ];

    if (includeContactDetails) {
      headers.push('Contacto');
    }

    if (includeNotes) {
      headers.push('Notas');
    }

    const rows = providers.map(provider => {
      const row = [
        `${provider.startTime} - ${provider.endTime}`,
        provider.providerInfo?.name || 'N/A',
        provider.locationInfo?.name || 'N/A',
        provider.service || 'N/A'
      ];

      if (includeContactDetails) {
        const contact = provider.providerInfo?.contact;
        row.push(contact ? `${contact.contactPerson}\n${contact.phone}` : 'N/A');
      }

      if (includeNotes) {
        row.push(provider.notes || '-');
      }

      return row;
    });

    // Configurar y dibujar tabla
    pdf.autoTable({
      startY: this.currentY,
      head: [headers],
      body: rows,
      theme: 'grid',
      styles: {
        fontSize: 9,
        cellPadding: 3,
        textColor: colors.text
      },
      headStyles: {
        fillColor: colors.primary,
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: colors.lightGray
      },
      columnStyles: {
        0: { cellWidth: 25 }, // Hora
        1: { cellWidth: 40 }, // Proveedor
        2: { cellWidth: 25 }, // Ubicación
        3: { cellWidth: 35 }, // Servicio
        4: includeContactDetails ? { cellWidth: 35 } : {},
        5: includeNotes ? { cellWidth: 30 } : {}
      },
      margin: { left: this.margin, right: this.margin }
    });

    this.currentY = pdf.lastAutoTable.finalY + 15;
  }

  /**
   * Mapa conceptual de ubicaciones
   */
  _addLocationMap(assignmentData) {
    if (this.currentY > this.pageHeight - 60) {
      this.pdf.addPage();
      this.currentY = this.margin;
    }

    const pdf = this.pdf;

    // Título de sección
    pdf.setFontSize(12);
    pdf.setTextColor(...colors.primary);
    pdf.text('RESUMEN POR UBICACIÓN', this.margin, this.currentY);
    
    this.currentY += 10;

    // Agrupar proveedores por ubicación
    const locationGroups = {};
    assignmentData.providers.forEach(provider => {
      const locationName = provider.locationInfo?.name || 'Sin ubicación';
      if (!locationGroups[locationName]) {
        locationGroups[locationName] = [];
      }
      locationGroups[locationName].push(provider);
    });

    // Dibujar resumen por ubicación
    Object.entries(locationGroups).forEach(([location, providers]) => {
      pdf.setFontSize(10);
      pdf.setTextColor(...colors.text);
      pdf.text(`📍 ${location} (${providers.length} proveedores)`, this.margin + 5, this.currentY);
      
      this.currentY += 6;

      providers.forEach(provider => {
        pdf.setFontSize(9);
        pdf.setTextColor(...colors.secondary);
        pdf.text(
          `  • ${provider.startTime} - ${provider.providerInfo?.name || 'N/A'} (${provider.service})`,
          this.margin + 10,
          this.currentY
        );
        this.currentY += 5;
      });

      this.currentY += 3;
    });
  }

  /**
   * Footer del documento
   */
  _addFooter(forAgency) {
    const pdf = this.pdf;
    const footerY = this.pageHeight - 30;

    // Línea separadora
    pdf.setDrawColor(...colors.border);
    pdf.line(this.margin, footerY, this.pageWidth - this.margin, footerY);

    // Información de contacto
    pdf.setFontSize(9);
    pdf.setTextColor(...colors.secondary);
    
    if (forAgency) {
      pdf.text('Para consultas o cambios, contactar a:', this.margin, footerY + 8);
      pdf.text('Email: coordinacion@futurismo.com | Teléfono: +51 999 888 777', this.margin, footerY + 14);
      pdf.text('WhatsApp: +51 999 888 777 | Web: www.futurismo.com', this.margin, footerY + 20);
    } else {
      pdf.text('Documento generado automáticamente - Sistema Futurismo', this.margin, footerY + 8);
      pdf.text('Para soporte técnico: soporte@futurismo.com', this.margin, footerY + 14);
    }

    // Número de página
    const pageNum = pdf.internal.getCurrentPageInfo().pageNumber;
    const totalPages = pdf.internal.getNumberOfPages();
    pdf.text(`Página ${pageNum} de ${totalPages}`, this.pageWidth - 40, footerY + 14);
  }

  /**
   * Página adicional con instrucciones para guías
   */
  _addGuideInstructions(assignmentData) {
    this.pdf.addPage();
    this.currentY = this.margin;

    const pdf = this.pdf;

    // Título
    pdf.setFontSize(16);
    pdf.setTextColor(...colors.primary);
    pdf.text('INSTRUCCIONES PARA EL GUÍA', this.margin, this.currentY);
    
    this.currentY += 15;

    // Instrucciones generales
    const instructions = [
      '1. Verificar horarios con cada proveedor 24 horas antes del tour',
      '2. Confirmar número de participantes con cada establecimiento',
      '3. Llevar lista de participantes y vouchers correspondientes',
      '4. Reportar cualquier inconveniente inmediatamente al coordinador',
      '5. Tomar fotos del grupo en cada ubicación para reporte post-tour',
      '6. Verificar calidad del servicio y reportar observaciones'
    ];

    pdf.setFontSize(11);
    pdf.setTextColor(...colors.text);

    instructions.forEach(instruction => {
      pdf.text(instruction, this.margin, this.currentY);
      this.currentY += 8;
    });

    this.currentY += 10;

    // Contactos de emergencia
    pdf.setFontSize(12);
    pdf.setTextColor(...colors.primary);
    pdf.text('CONTACTOS DE EMERGENCIA', this.margin, this.currentY);
    
    this.currentY += 10;

    const emergencyContacts = [
      'Coordinador de Tours: +51 999 888 777',
      'Gerencia: +51 999 888 778',
      'Emergencias 24h: +51 999 888 779'
    ];

    pdf.setFontSize(10);
    pdf.setTextColor(...colors.text);

    emergencyContacts.forEach(contact => {
      pdf.text(`• ${contact}`, this.margin, this.currentY);
      this.currentY += 6;
    });

    // Checklist final
    this.currentY += 15;
    pdf.setFontSize(12);
    pdf.setTextColor(...colors.primary);
    pdf.text('CHECKLIST FINAL', this.margin, this.currentY);
    
    this.currentY += 10;

    const checklist = [
      '□ Confirmación de todos los proveedores',
      '□ Lista de participantes actualizada',
      '□ Vouchers y documentos necesarios',
      '□ Kit de emergencia y botiquín',
      '□ Información turística adicional',
      '□ Contactos actualizados en el teléfono'
    ];

    pdf.setFontSize(10);
    checklist.forEach(item => {
      pdf.text(item, this.margin, this.currentY);
      this.currentY += 6;
    });
  }

  /**
   * Generar múltiples PDFs (agencia y guía)
   */
  generateBothPDFs(assignmentData) {
    const agencyPDF = this.generateProviderAssignmentPDF(assignmentData, {
      forAgency: true,
      includeContactDetails: true,
      includeNotes: true
    });

    const guidePDF = this.generateProviderAssignmentPDF(assignmentData, {
      forAgency: false,
      forGuide: true,
      includeContactDetails: true,
      includeNotes: true
    });

    return {
      agencyPDF,
      guidePDF
    };
  }

  /**
   * Enviar PDFs por email (placeholder para integración futura)
   */
  async sendPDFByEmail(assignmentData, recipients) {
    // Este método sería implementado con un servicio de email
    console.log('Enviando PDF por email a:', recipients);
    
    // Generar PDFs
    const { agencyPDF, guidePDF } = this.generateBothPDFs(assignmentData);
    
    // Convertir a blobs
    const agencyBlob = agencyPDF.output('blob');
    const guideBlob = guidePDF.output('blob');
    
    // Retornar datos para el servicio de email
    return {
      agencyPDF: agencyBlob,
      guidePDF: guideBlob,
      filename: `proveedores_${assignmentData.tourName.replace(/[^a-zA-Z0-9]/g, '_')}_${assignmentData.date}`
    };
  }
}

// Instancia singleton
const pdfService = new PDFService();

export default pdfService;
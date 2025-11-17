import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import useEmergencyStore from '../stores/emergencyStore';

// Configuración de colores
const colors = {
  emergency: [220, 38, 38], // red-600
  primary: [59, 130, 246], // blue-500
  success: [16, 185, 129], // green-500
  warning: [245, 158, 11], // amber-500
  text: [31, 41, 55], // gray-800
  secondary: [107, 114, 128], // gray-500
  lightGray: [249, 250, 251], // gray-50
  border: [229, 231, 235] // gray-200
};

class EmergencyPDFService {
  constructor() {
    this.pdf = null;
    this.pageHeight = 297; // A4 height in mm
    this.pageWidth = 210; // A4 width in mm
    this.margin = 20;
    this.currentY = this.margin;
  }

  /**
   * Generar PDF de un protocolo individual
   */
  generateProtocolPDF(protocol) {
    this.pdf = new jsPDF();
    this.currentY = this.margin;

    // Header
    this._addProtocolHeader(protocol);
    
    // Información básica
    this._addProtocolInfo(protocol);
    
    // Pasos del protocolo
    this._addProtocolSteps(protocol);
    
    // Contactos de emergencia
    this._addEmergencyContacts(protocol);
    
    // Materiales necesarios
    this._addRequiredMaterials(protocol);
    
    // Footer
    this._addFooter();

    return this.pdf;
  }

  /**
   * Generar PDF con todos los protocolos
   */
  generateAllProtocolsPDF(protocols) {
    this.pdf = new jsPDF();
    this.currentY = this.margin;

    // Portada
    this._addCoverPage();

    // Índice
    this._addIndexPage(protocols);

    // Protocolos individuales
    if (protocols && protocols.length > 0) {
      protocols.forEach((protocol, index) => {
        if (index > 0) {
          this.pdf.addPage();
          this.currentY = this.margin;
        }

        this._addProtocolHeader(protocol, false);
        this._addProtocolInfo(protocol);
        this._addProtocolSteps(protocol);
        this._addEmergencyContacts(protocol);
        this._addRequiredMaterials(protocol);
      });
    }

    // Página de contactos generales
    this.pdf.addPage();
    this.currentY = this.margin;
    this._addGeneralContactsPage();

    return this.pdf;
  }

  /**
   * Generar kit completo para guías
   */
  generateGuideEmergencyKit() {
    const { protocols, materials } = useEmergencyStore.getState();
    
    this.pdf = new jsPDF();
    this.currentY = this.margin;

    // Portada del kit
    this._addKitCoverPage();
    
    // Resumen ejecutivo
    this.pdf.addPage();
    this.currentY = this.margin;
    this._addExecutiveSummary();
    
    // Lista de verificación pre-tour
    this.pdf.addPage();
    this.currentY = this.margin;
    this._addPreTourChecklist();
    
    // Protocolos resumidos
    this.pdf.addPage();
    this.currentY = this.margin;
    this._addProtocolsSummary(protocols);
    
    // Contactos de emergencia consolidados
    this.pdf.addPage();
    this.currentY = this.margin;
    this._addConsolidatedContacts(protocols);
    
    // Materiales obligatorios
    this.pdf.addPage();
    this.currentY = this.margin;
    this._addMandatoryMaterials(materials);

    return this.pdf;
  }

  /**
   * Descargar PDF de protocolo individual
   */
  async downloadProtocolPDF(protocol) {
    const pdf = this.generateProtocolPDF(protocol);
    const filename = `protocolo_${protocol.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
    pdf.save(filename);
  }

  /**
   * Descargar PDF de todos los protocolos
   */
  async downloadAllProtocolsPDF(protocols) {
    try {
      if (!protocols || protocols.length === 0) {
        throw new Error('No hay protocolos disponibles para generar el PDF');
      }
      const pdf = this.generateAllProtocolsPDF(protocols);
      const filename = `protocolos_emergencia_${format(new Date(), 'yyyy-MM-dd')}.pdf`;
      pdf.save(filename);
    } catch (error) {
      console.error('Error generando PDF de protocolos:', error);
      throw error;
    }
  }

  /**
   * Descargar kit completo para guías
   */
  async downloadGuideEmergencyKit() {
    const pdf = this.generateGuideEmergencyKit();
    const filename = `kit_emergencia_guia_${format(new Date(), 'yyyy-MM-dd')}.pdf`;
    pdf.save(filename);
  }

  // Métodos privados para construcción del PDF

  _addProtocolHeader(protocol, isStandalone = true) {
    const pdf = this.pdf;

    // Logo/Título de emergencia
    pdf.setFillColor(...colors.emergency);
    pdf.rect(this.margin, this.currentY, this.pageWidth - (this.margin * 2), 15, 'F');

    pdf.setFontSize(18);
    pdf.setTextColor(255, 255, 255);
    pdf.text('🚨 PROTOCOLO DE EMERGENCIA', this.margin + 5, this.currentY + 10);

    this.currentY += 20;

    // Título del protocolo
    pdf.setFontSize(16);
    pdf.setTextColor(...colors.text);
    pdf.text(protocol.title || 'Sin título', this.margin, this.currentY);

    this.currentY += 10;

    // Información básica
    pdf.setFontSize(10);
    pdf.setTextColor(...colors.secondary);

    const leftColumn = this.margin;
    const rightColumn = this.pageWidth / 2 + 10;

    pdf.text('Categoría:', leftColumn, this.currentY);
    pdf.setTextColor(...colors.text);
    const categoryText = typeof protocol.category === 'string' ? protocol.category : 'General';
    pdf.text(`${protocol.icon || '📋'} ${categoryText.toUpperCase()}`, leftColumn + 20, this.currentY);
    
    pdf.setTextColor(...colors.secondary);
    pdf.text('Prioridad:', rightColumn, this.currentY);
    pdf.setTextColor(...colors.text);
    pdf.text(protocol.priority?.toUpperCase() || 'MEDIA', rightColumn + 20, this.currentY);
    
    this.currentY += 8;
    
    pdf.setTextColor(...colors.secondary);
    pdf.text('Actualizado:', leftColumn, this.currentY);
    pdf.setTextColor(...colors.text);
    pdf.text(protocol.lastUpdated, leftColumn + 25, this.currentY);
    
    pdf.setTextColor(...colors.secondary);
    pdf.text('Generado:', rightColumn, this.currentY);
    pdf.setTextColor(...colors.text);
    pdf.text(format(new Date(), 'dd/MM/yyyy HH:mm', { locale: es }), rightColumn + 20, this.currentY);
    
    this.currentY += 15;
  }

  _addProtocolInfo(protocol) {
    const pdf = this.pdf;

    // Descripción
    pdf.setFontSize(12);
    pdf.setTextColor(...colors.primary);
    pdf.text('DESCRIPCIÓN', this.margin, this.currentY);

    this.currentY += 8;

    pdf.setFontSize(10);
    pdf.setTextColor(...colors.text);
    const description = protocol.description || 'Sin descripción disponible';
    const descriptionLines = pdf.splitTextToSize(description, this.pageWidth - (this.margin * 2));
    pdf.text(descriptionLines, this.margin, this.currentY);

    this.currentY += (descriptionLines.length * 5) + 10;
  }

  _addProtocolSteps(protocol) {
    const pdf = this.pdf;

    // Título de pasos
    pdf.setFontSize(12);
    pdf.setTextColor(...colors.primary);
    pdf.text('PASOS A SEGUIR', this.margin, this.currentY);

    this.currentY += 10;

    // Cuadro de pasos
    const steps = protocol.content?.steps || protocol.steps || [];
    if (steps.length === 0) {
      pdf.setFontSize(10);
      pdf.setTextColor(...colors.secondary);
      pdf.text('No se especificaron pasos para este protocolo.', this.margin + 5, this.currentY);
      this.currentY += 10;
      return;
    }

    const stepsData = steps.map((step, index) => [
      `${index + 1}`,
      step
    ]);

    autoTable(pdf, {
      startY: this.currentY,
      head: [['#', 'Acción a Realizar']],
      body: stepsData,
      theme: 'grid',
      styles: {
        fontSize: 9,
        cellPadding: 4,
        textColor: colors.text
      },
      headStyles: {
        fillColor: colors.primary,
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { cellWidth: 15, halign: 'center' },
        1: { cellWidth: 'auto' }
      },
      margin: { left: this.margin, right: this.margin }
    });

    this.currentY = pdf.lastAutoTable.finalY + 15;
  }

  _addEmergencyContacts(protocol) {
    if (this.currentY > this.pageHeight - 60) {
      this.pdf.addPage();
      this.currentY = this.margin;
    }

    const pdf = this.pdf;

    // Título de contactos
    pdf.setFontSize(12);
    pdf.setTextColor(...colors.emergency);
    pdf.text('📞 CONTACTOS DE EMERGENCIA', this.margin, this.currentY);

    this.currentY += 10;

    // Tabla de contactos
    const contacts = protocol.content?.contacts || protocol.contacts || [];
    if (contacts.length === 0) {
      pdf.setFontSize(10);
      pdf.setTextColor(...colors.secondary);
      pdf.text('No se especificaron contactos para este protocolo.', this.margin + 5, this.currentY);
      this.currentY += 10;
      return;
    }

    const contactsData = contacts.map(contact => [
      contact.name || 'Sin nombre',
      contact.phone || 'Sin teléfono',
      contact.type ? contact.type.charAt(0).toUpperCase() + contact.type.slice(1) : 'General'
    ]);

    autoTable(pdf, {
      startY: this.currentY,
      head: [['Contacto', 'Teléfono', 'Tipo']],
      body: contactsData,
      theme: 'grid',
      styles: {
        fontSize: 9,
        cellPadding: 3,
        textColor: colors.text
      },
      headStyles: {
        fillColor: colors.emergency,
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 40, fontStyle: 'bold' },
        2: { cellWidth: 30 }
      },
      margin: { left: this.margin, right: this.margin }
    });

    this.currentY = pdf.lastAutoTable.finalY + 15;
  }

  _addRequiredMaterials(protocol) {
    if (this.currentY > this.pageHeight - 40) {
      this.pdf.addPage();
      this.currentY = this.margin;
    }

    const pdf = this.pdf;

    // Título de materiales
    pdf.setFontSize(12);
    pdf.setTextColor(...colors.primary);
    pdf.text('🎒 MATERIALES NECESARIOS', this.margin, this.currentY);

    this.currentY += 8;

    const materials = protocol.content?.materials || protocol.materials || [];
    if (materials.length > 0) {
      pdf.setFontSize(10);
      pdf.setTextColor(...colors.text);

      materials.forEach(material => {
        pdf.text(`• ${material}`, this.margin + 5, this.currentY);
        this.currentY += 5;
      });
    } else {
      pdf.setFontSize(10);
      pdf.setTextColor(...colors.secondary);
      pdf.text('No se especificaron materiales para este protocolo.', this.margin + 5, this.currentY);
    }

    this.currentY += 10;
  }

  _addCoverPage() {
    const pdf = this.pdf;
    
    // Fondo de portada
    pdf.setFillColor(...colors.emergency);
    pdf.rect(0, 0, this.pageWidth, this.pageHeight, 'F');
    
    // Título principal
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.text('PROTOCOLOS DE', this.pageWidth / 2, 80, { align: 'center' });
    pdf.text('EMERGENCIA', this.pageWidth / 2, 100, { align: 'center' });
    
    // Subtítulo
    pdf.setFontSize(16);
    pdf.text('Manual para Guías Turísticos', this.pageWidth / 2, 120, { align: 'center' });
    
    // Logo/Icono grande
    pdf.setFontSize(48);
    pdf.text('🚨', this.pageWidth / 2, 160, { align: 'center' });
    
    // Información de la empresa
    pdf.setFontSize(14);
    pdf.text('FUTURISMO TOURS', this.pageWidth / 2, 200, { align: 'center' });
    
    // Fecha
    pdf.setFontSize(12);
    pdf.text(format(new Date(), 'dd \'de\' MMMM \'de\' yyyy', { locale: es }), this.pageWidth / 2, 220, { align: 'center' });
    
    // Advertencia
    pdf.setFontSize(10);
    pdf.text('DOCUMENTO CONFIDENCIAL - SOLO PARA USO INTERNO', this.pageWidth / 2, 270, { align: 'center' });
  }

  _addIndexPage(protocols) {
    this.pdf.addPage();
    this.currentY = this.margin;

    const pdf = this.pdf;

    // Título del índice
    pdf.setFontSize(18);
    pdf.setTextColor(...colors.text);
    pdf.text('ÍNDICE DE PROTOCOLOS', this.margin, this.currentY);

    this.currentY += 15;

    // Lista de protocolos
    if (!protocols || protocols.length === 0) {
      pdf.setFontSize(10);
      pdf.setTextColor(...colors.secondary);
      pdf.text('No hay protocolos disponibles.', this.margin, this.currentY);
      return;
    }

    protocols.forEach((protocol, index) => {
      pdf.setFontSize(12);
      pdf.setTextColor(...colors.text);

      const pageNum = index + 3; // Ajustar por portada e índice
      pdf.text(`${protocol.icon || '📋'} ${protocol.title || 'Sin título'}`, this.margin, this.currentY);
      pdf.text(`${pageNum}`, this.pageWidth - this.margin - 10, this.currentY, { align: 'right' });

      // Línea punteada
      pdf.setDrawColor(...colors.border);
      const dotsY = this.currentY - 2;
      for (let x = this.margin + 80; x < this.pageWidth - this.margin - 20; x += 3) {
        pdf.circle(x, dotsY, 0.3, 'F');
      }

      this.currentY += 8;
    });
  }

  _addKitCoverPage() {
    const pdf = this.pdf;
    
    // Fondo de portada
    pdf.setFillColor(...colors.primary);
    pdf.rect(0, 0, this.pageWidth, this.pageHeight, 'F');
    
    // Título principal
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(20);
    pdf.text('KIT DE EMERGENCIA', this.pageWidth / 2, 70, { align: 'center' });
    pdf.text('PARA GUÍAS', this.pageWidth / 2, 90, { align: 'center' });
    
    // Subtítulo
    pdf.setFontSize(14);
    pdf.text('Manual de Bolsillo - Versión Compacta', this.pageWidth / 2, 110, { align: 'center' });
    
    // Iconos
    pdf.setFontSize(24);
    pdf.text('🚑 ⛈️ 🚗 🔍 📡', this.pageWidth / 2, 140, { align: 'center' });
    
    // Información
    pdf.setFontSize(12);
    pdf.text('FUTURISMO TOURS', this.pageWidth / 2, 180, { align: 'center' });
    pdf.text(format(new Date(), 'MMMM yyyy', { locale: es }).toUpperCase(), this.pageWidth / 2, 195, { align: 'center' });
    
    // Instrucciones de uso
    pdf.setFontSize(10);
    pdf.text('MANTENER SIEMPRE ACCESIBLE DURANTE TOURS', this.pageWidth / 2, 250, { align: 'center' });
  }

  _addExecutiveSummary() {
    const pdf = this.pdf;
    
    pdf.setFontSize(16);
    pdf.setTextColor(...colors.text);
    pdf.text('RESUMEN EJECUTIVO', this.margin, this.currentY);
    
    this.currentY += 15;
    
    const summaryText = [
      'Este kit contiene los protocolos esenciales de emergencia que todo guía debe conocer.',
      'En caso de emergencia, mantén la calma y sigue los protocolos establecidos.',
      'Contacta inmediatamente al coordinador de tours y a los servicios de emergencia.',
      'La seguridad de los turistas es tu máxima prioridad.',
      'Documenta todos los incidentes para reportes posteriores.'
    ];
    
    pdf.setFontSize(11);
    summaryText.forEach(text => {
      const lines = pdf.splitTextToSize(text, this.pageWidth - (this.margin * 2));
      pdf.text(`• ${lines.join(' ')}`, this.margin, this.currentY);
      this.currentY += 8;
    });
    
    this.currentY += 10;
    
    // Números de emergencia principales
    pdf.setFillColor(...colors.emergency);
    pdf.rect(this.margin, this.currentY, this.pageWidth - (this.margin * 2), 40, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(14);
    pdf.text('NÚMEROS DE EMERGENCIA PRINCIPALES', this.margin + 5, this.currentY + 8);
    
    pdf.setFontSize(12);
    pdf.text('🚑 Emergencias Nacionales: 105', this.margin + 5, this.currentY + 18);
    pdf.text('📞 Coordinador Tours: +51 999 888 777', this.margin + 5, this.currentY + 28);
    pdf.text('🏢 Emergencia 24h: +51 999 888 779', this.margin + 5, this.currentY + 38);
  }

  _addPreTourChecklist() {
    const pdf = this.pdf;
    
    pdf.setFontSize(16);
    pdf.setTextColor(...colors.text);
    pdf.text('LISTA DE VERIFICACIÓN PRE-TOUR', this.margin, this.currentY);
    
    this.currentY += 15;
    
    const checklist = [
      'Revisar botiquín de primeros auxilios',
      'Verificar funcionamiento de radio/comunicación',
      'Confirmar números de emergencia actualizados',
      'Revisar condiciones climáticas',
      'Verificar estado del vehículo',
      'Obtener información médica relevante de turistas',
      'Confirmar puntos de encuentro de emergencia',
      'Verificar carga de dispositivos de comunicación'
    ];
    
    pdf.setFontSize(11);
    checklist.forEach(item => {
      pdf.text(`☐ ${item}`, this.margin, this.currentY);
      this.currentY += 8;
    });
  }

  _addProtocolsSummary(protocols) {
    const pdf = this.pdf;

    pdf.setFontSize(16);
    pdf.setTextColor(...colors.text);
    pdf.text('RESUMEN DE PROTOCOLOS', this.margin, this.currentY);

    this.currentY += 15;

    protocols.forEach(protocol => {
      // Título del protocolo
      pdf.setFontSize(12);
      pdf.setTextColor(...colors.primary);
      pdf.text(`${protocol.icon || '📋'} ${protocol.title || 'Sin título'}`, this.margin, this.currentY);

      this.currentY += 8;

      // Primeros 3 pasos
      const steps = protocol.content?.steps || protocol.steps || [];
      pdf.setFontSize(9);
      pdf.setTextColor(...colors.text);
      steps.slice(0, 3).forEach((step, index) => {
        pdf.text(`${index + 1}. ${step}`, this.margin + 5, this.currentY);
        this.currentY += 5;
      });

      if (steps.length === 0) {
        pdf.setTextColor(...colors.secondary);
        pdf.text('Sin pasos definidos', this.margin + 5, this.currentY);
        this.currentY += 5;
      }

      this.currentY += 5;

      // Verificar espacio en la página
      if (this.currentY > this.pageHeight - 40) {
        pdf.addPage();
        this.currentY = this.margin;
      }
    });
  }

  _addConsolidatedContacts(protocols) {
    const pdf = this.pdf;

    pdf.setFontSize(16);
    pdf.setTextColor(...colors.text);
    pdf.text('CONTACTOS CONSOLIDADOS', this.margin, this.currentY);

    this.currentY += 15;

    // Recopilar todos los contactos únicos
    const allContacts = [];
    protocols.forEach(protocol => {
      const contacts = protocol.content?.contacts || protocol.contacts || [];
      contacts.forEach(contact => {
        if (contact && contact.phone && !allContacts.find(c => c.phone === contact.phone)) {
          allContacts.push(contact);
        }
      });
    });

    if (allContacts.length === 0) {
      pdf.setFontSize(10);
      pdf.setTextColor(...colors.secondary);
      pdf.text('No hay contactos disponibles.', this.margin + 5, this.currentY);
      return;
    }

    // Tabla de contactos
    const contactsData = allContacts.map(contact => [
      contact.name || 'Sin nombre',
      contact.phone || 'Sin teléfono',
      contact.type ? contact.type.charAt(0).toUpperCase() + contact.type.slice(1) : 'General'
    ]);

    autoTable(pdf, {
      startY: this.currentY,
      head: [['Contacto', 'Teléfono', 'Tipo']],
      body: contactsData,
      theme: 'grid',
      styles: {
        fontSize: 9,
        cellPadding: 3,
        textColor: colors.text
      },
      headStyles: {
        fillColor: colors.emergency,
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: 'bold'
      },
      margin: { left: this.margin, right: this.margin }
    });
  }

  _addMandatoryMaterials(materials) {
    const pdf = this.pdf;
    
    pdf.setFontSize(16);
    pdf.setTextColor(...colors.text);
    pdf.text('MATERIALES OBLIGATORIOS', this.margin, this.currentY);
    
    this.currentY += 15;
    
    const mandatoryMaterials = materials.filter(m => m.mandatory);
    
    mandatoryMaterials.forEach(material => {
      // Nombre del material
      pdf.setFontSize(12);
      pdf.setTextColor(...colors.primary);
      pdf.text(`📦 ${material.name}`, this.margin, this.currentY);
      
      this.currentY += 8;
      
      // Items
      pdf.setFontSize(10);
      pdf.setTextColor(...colors.text);
      material.items.forEach(item => {
        pdf.text(`• ${item}`, this.margin + 5, this.currentY);
        this.currentY += 5;
      });
      
      this.currentY += 5;
    });
  }

  _addGeneralContactsPage() {
    const pdf = this.pdf;
    
    pdf.setFontSize(18);
    pdf.setTextColor(...colors.text);
    pdf.text('CONTACTOS GENERALES', this.margin, this.currentY);
    
    this.currentY += 15;
    
    const generalContacts = [
      { category: 'Emergencias Nacionales', contacts: [
        { name: 'Bomberos', phone: '116' },
        { name: 'Policía Nacional', phone: '105' },
        { name: 'SAMU (Emergencias Médicas)', phone: '106' },
        { name: 'Defensa Civil', phone: '115' }
      ]},
      { category: 'Futurismo Tours', contacts: [
        { name: 'Coordinador de Tours', phone: '+51 999 888 777' },
        { name: 'Gerencia', phone: '+51 999 888 778' },
        { name: 'Emergencias 24h', phone: '+51 999 888 779' },
        { name: 'Operaciones', phone: '+51 999 888 781' }
      ]},
      { category: 'Servicios Especializados', contacts: [
        { name: 'SENAMHI (Clima)', phone: '115' },
        { name: 'Seguros Médicos', phone: '+51 999 888 780' },
        { name: 'Servicio de Grúa', phone: '+51 999 888 786' }
      ]}
    ];
    
    generalContacts.forEach(category => {
      pdf.setFontSize(14);
      pdf.setTextColor(...colors.primary);
      pdf.text(category.category, this.margin, this.currentY);
      
      this.currentY += 8;
      
      category.contacts.forEach(contact => {
        pdf.setFontSize(11);
        pdf.setTextColor(...colors.text);
        pdf.text(`• ${contact.name}: ${contact.phone}`, this.margin + 5, this.currentY);
        this.currentY += 6;
      });
      
      this.currentY += 5;
    });
  }

  _addFooter() {
    const pdf = this.pdf;
    const footerY = this.pageHeight - 20;
    
    // Línea separadora
    pdf.setDrawColor(...colors.border);
    pdf.line(this.margin, footerY, this.pageWidth - this.margin, footerY);
    
    // Información del pie
    pdf.setFontSize(8);
    pdf.setTextColor(...colors.secondary);
    pdf.text('FUTURISMO TOURS - Protocolo de Emergencia', this.margin, footerY + 6);
    
    const pageNum = pdf.internal.getCurrentPageInfo().pageNumber;
    pdf.text(`Página ${pageNum}`, this.pageWidth - this.margin - 15, footerY + 6);
    
    pdf.text(`Generado: ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: es })}`, this.margin, footerY + 12);
  }
}

// Instancia singleton
const emergencyPDFService = new EmergencyPDFService();

export default emergencyPDFService;
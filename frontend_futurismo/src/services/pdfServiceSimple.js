import { format } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Servicio PDF simple sin dependencias externas
 * Genera HTML que puede ser convertido a PDF por el navegador
 */
class SimplePDFService {
  
  /**
   * Genera HTML para PDF de asignación de proveedores
   */
  generateProviderAssignmentHTML(assignmentData, options = {}) {
    const {
      forAgency = true,
      forGuide = false,
      includeContactDetails = true,
      includeNotes = true
    } = options;

    const styles = this._getStyles();
    const header = this._generateHeader(assignmentData, forAgency ? 'AGENCIA' : 'GUÍA');
    const tourInfo = this._generateTourInfo(assignmentData);
    const providersTable = this._generateProvidersTable(assignmentData.providers, {
      includeContactDetails,
      includeNotes
    });
    const locationSummary = this._generateLocationSummary(assignmentData);
    const footer = this._generateFooter(forAgency);
    const guideInstructions = forGuide ? this._generateGuideInstructions(assignmentData) : '';

    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Itinerario de Proveedores - ${assignmentData.tourName}</title>
        <style>${styles}</style>
      </head>
      <body>
        <div class="container">
          ${header}
          ${tourInfo}
          ${providersTable}
          ${locationSummary}
          ${footer}
          ${guideInstructions}
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Descarga el PDF usando la funcionalidad nativa del navegador
   */
  downloadPDF(assignmentData, options = {}, filename = null) {
    const html = this.generateProviderAssignmentHTML(assignmentData, options);
    
    if (!filename) {
      const tourName = assignmentData.tourName.replace(/[^a-zA-Z0-9]/g, '_');
      const date = format(new Date(assignmentData.date), 'yyyy-MM-dd');
      const recipient = options.forAgency ? 'agencia' : 'guia';
      filename = `${recipient}_${tourName}_${date}`;
    }

    // Crear ventana nueva para impresión
    const printWindow = window.open('', '_blank');
    printWindow.document.write(html);
    printWindow.document.close();

    // Configurar para PDF
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      // Cerrar la ventana después de un delay
      setTimeout(() => {
        printWindow.close();
      }, 1000);
    };
  }

  /**
   * Genera ambos PDFs
   */
  generateBothPDFs(assignmentData) {
    // PDF para agencia
    this.downloadPDF(assignmentData, {
      forAgency: true,
      includeContactDetails: true,
      includeNotes: true
    });

    // PDF para guía (con delay)
    setTimeout(() => {
      this.downloadPDF(assignmentData, {
        forAgency: false,
        forGuide: true,
        includeContactDetails: true,
        includeNotes: true
      });
    }, 2000);
  }

  /**
   * Estilos CSS para el PDF
   */
  _getStyles() {
    return `
      @media print {
        @page {
          margin: 1cm;
          size: A4;
        }
        
        body {
          font-family: Arial, sans-serif;
          font-size: 12px;
          line-height: 1.4;
          color: #333;
        }
        
        .page-break {
          page-break-before: always;
        }
        
        .no-break {
          page-break-inside: avoid;
        }
      }
      
      body {
        font-family: Arial, sans-serif;
        font-size: 12px;
        line-height: 1.4;
        color: #333;
        margin: 0;
        padding: 20px;
      }
      
      .container {
        max-width: 800px;
        margin: 0 auto;
      }
      
      .header {
        border-bottom: 2px solid #3B82F6;
        padding-bottom: 15px;
        margin-bottom: 20px;
      }
      
      .header h1 {
        color: #3B82F6;
        font-size: 24px;
        margin: 0 0 5px 0;
      }
      
      .header h2 {
        color: #333;
        font-size: 18px;
        margin: 0 0 10px 0;
      }
      
      .info-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        margin-bottom: 20px;
      }
      
      .info-item {
        margin-bottom: 5px;
      }
      
      .info-label {
        font-weight: bold;
        color: #666;
        display: inline-block;
        width: 80px;
      }
      
      .tour-info {
        background: #F8FAFC;
        border: 1px solid #E2E8F0;
        border-radius: 8px;
        padding: 15px;
        margin-bottom: 20px;
      }
      
      .section-title {
        color: #3B82F6;
        font-size: 16px;
        font-weight: bold;
        margin: 20px 0 10px 0;
        border-bottom: 1px solid #E2E8F0;
        padding-bottom: 5px;
      }
      
      .providers-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
      }
      
      .providers-table th,
      .providers-table td {
        border: 1px solid #D1D5DB;
        padding: 8px;
        text-align: left;
        vertical-align: top;
      }
      
      .providers-table th {
        background: #3B82F6;
        color: white;
        font-weight: bold;
      }
      
      .providers-table tr:nth-child(even) {
        background: #F8FAFC;
      }
      
      .location-summary {
        background: #F0F9FF;
        border: 1px solid #BAE6FD;
        border-radius: 8px;
        padding: 15px;
        margin-bottom: 20px;
      }
      
      .location-item {
        margin-bottom: 10px;
      }
      
      .location-name {
        font-weight: bold;
        color: #0369A1;
        margin-bottom: 5px;
      }
      
      .provider-item {
        margin-left: 15px;
        font-size: 11px;
        color: #666;
      }
      
      .footer {
        border-top: 1px solid #D1D5DB;
        padding-top: 15px;
        margin-top: 30px;
        font-size: 10px;
        color: #666;
      }
      
      .guide-instructions {
        page-break-before: always;
        margin-top: 30px;
      }
      
      .instructions-list {
        margin: 10px 0;
        padding-left: 20px;
      }
      
      .checklist {
        margin: 10px 0;
      }
      
      .checklist-item {
        margin: 5px 0;
        font-family: monospace;
      }
      
      .emergency-contacts {
        background: #FEF2F2;
        border: 1px solid #FECACA;
        border-radius: 8px;
        padding: 15px;
        margin: 15px 0;
      }
      
      .contact-item {
        margin: 5px 0;
        font-weight: bold;
      }
    `;
  }

  /**
   * Genera el header del documento
   */
  _generateHeader(assignmentData, recipient) {
    return `
      <div class="header">
        <h1>🌎 FUTURISMO TOURS</h1>
        <h2>ITINERARIO DE PROVEEDORES - ${recipient}</h2>
        
        <div class="info-grid">
          <div>
            <div class="info-item">
              <span class="info-label">Tour:</span> ${assignmentData.tourName}
            </div>
            <div class="info-item">
              <span class="info-label">Generado:</span> ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: es })}
            </div>
          </div>
          <div>
            <div class="info-item">
              <span class="info-label">Fecha:</span> ${format(new Date(assignmentData.date), 'dd/MM/yyyy', { locale: es })}
            </div>
            <div class="info-item">
              <span class="info-label">Proveedores:</span> ${assignmentData.providers.length} asignados
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Genera información del tour
   */
  _generateTourInfo(assignmentData) {
    return `
      <div class="tour-info no-break">
        <h3 class="section-title">📅 INFORMACIÓN DEL TOUR</h3>
        <div>
          <strong>Tour:</strong> ${assignmentData.tourName}<br>
          <strong>Fecha:</strong> ${format(new Date(assignmentData.date), 'EEEE, dd \'de\' MMMM \'de\' yyyy', { locale: es })}<br>
          ${assignmentData.notes ? `<strong>Notas:</strong> ${assignmentData.notes}<br>` : ''}
        </div>
      </div>
    `;
  }

  /**
   * Genera tabla de proveedores
   */
  _generateProvidersTable(providers, options = {}) {
    const { includeContactDetails, includeNotes } = options;

    let headers = '<tr><th>Hora</th><th>Proveedor</th><th>Ubicación</th><th>Servicio</th>';
    if (includeContactDetails) headers += '<th>Contacto</th>';
    if (includeNotes) headers += '<th>Notas</th>';
    headers += '</tr>';

    const rows = providers.map(provider => {
      let row = `
        <tr>
          <td><strong>${provider.startTime} - ${provider.endTime}</strong></td>
          <td>${provider.providerInfo?.name || 'N/A'}</td>
          <td>${provider.locationInfo?.name || 'N/A'}</td>
          <td>${provider.service || 'N/A'}</td>
      `;

      if (includeContactDetails) {
        const contact = provider.providerInfo?.contact;
        row += `<td>${contact ? `${contact.contactPerson}<br>${contact.phone}` : 'N/A'}</td>`;
      }

      if (includeNotes) {
        row += `<td>${provider.notes || '-'}</td>`;
      }

      row += '</tr>';
      return row;
    }).join('');

    return `
      <div class="no-break">
        <h3 class="section-title">⏰ CRONOGRAMA DE PROVEEDORES</h3>
        <table class="providers-table">
          ${headers}
          ${rows}
        </table>
      </div>
    `;
  }

  /**
   * Genera resumen por ubicación
   */
  _generateLocationSummary(assignmentData) {
    // Agrupar proveedores por ubicación
    const locationGroups = {};
    assignmentData.providers.forEach(provider => {
      const locationName = provider.locationInfo?.name || 'Sin ubicación';
      if (!locationGroups[locationName]) {
        locationGroups[locationName] = [];
      }
      locationGroups[locationName].push(provider);
    });

    const locationItems = Object.entries(locationGroups).map(([location, providers]) => `
      <div class="location-item">
        <div class="location-name">📍 ${location} (${providers.length} proveedores)</div>
        ${providers.map(provider => `
          <div class="provider-item">
            • ${provider.startTime} - ${provider.providerInfo?.name || 'N/A'} (${provider.service})
          </div>
        `).join('')}
      </div>
    `).join('');

    return `
      <div class="location-summary no-break">
        <h3 class="section-title">🗺️ RESUMEN POR UBICACIÓN</h3>
        ${locationItems}
      </div>
    `;
  }

  /**
   * Genera footer del documento
   */
  _generateFooter(forAgency) {
    return `
      <div class="footer">
        ${forAgency ? `
          <p><strong>Para consultas o cambios, contactar a:</strong></p>
          <p>📧 Email: coordinacion@futurismo.com | 📞 Teléfono: +51 999 888 777</p>
          <p>💬 WhatsApp: +51 999 888 777 | 🌐 Web: www.futurismo.com</p>
        ` : `
          <p>Documento generado automáticamente - Sistema Futurismo</p>
          <p>Para soporte técnico: soporte@futurismo.com</p>
        `}
      </div>
    `;
  }

  /**
   * Genera instrucciones para guías
   */
  _generateGuideInstructions(assignmentData) {
    return `
      <div class="guide-instructions">
        <h2 class="section-title">📋 INSTRUCCIONES PARA EL GUÍA</h2>
        
        <h3>Instrucciones Generales:</h3>
        <ol class="instructions-list">
          <li>Verificar horarios con cada proveedor 24 horas antes del tour</li>
          <li>Confirmar número de participantes con cada establecimiento</li>
          <li>Llevar lista de participantes y vouchers correspondientes</li>
          <li>Reportar cualquier inconveniente inmediatamente al coordinador</li>
          <li>Tomar fotos del grupo en cada ubicación para reporte post-tour</li>
          <li>Verificar calidad del servicio y reportar observaciones</li>
        </ol>

        <div class="emergency-contacts">
          <h3>🚨 CONTACTOS DE EMERGENCIA</h3>
          <div class="contact-item">📞 Coordinador de Tours: +51 999 888 777</div>
          <div class="contact-item">👔 Gerencia: +51 999 888 778</div>
          <div class="contact-item">🆘 Emergencias 24h: +51 999 888 779</div>
        </div>

        <h3>✅ CHECKLIST FINAL</h3>
        <div class="checklist">
          <div class="checklist-item">☐ Confirmación de todos los proveedores</div>
          <div class="checklist-item">☐ Lista de participantes actualizada</div>
          <div class="checklist-item">☐ Vouchers y documentos necesarios</div>
          <div class="checklist-item">☐ Kit de emergencia y botiquín</div>
          <div class="checklist-item">☐ Información turística adicional</div>
          <div class="checklist-item">☐ Contactos actualizados en el teléfono</div>
        </div>
      </div>
    `;
  }
}

// Instancia singleton
const simplePDFService = new SimplePDFService();

export default simplePDFService;
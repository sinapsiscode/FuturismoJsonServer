import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { reservationsService } from './reservationsService';

class ExportService {
  // Obtener datos de reservas desde la API
  async getReservationsData() {
    try {
      const result = await reservationsService.getReservations();

      if (!result.success) {
        console.error('Error al obtener reservas:', result.error);
        return [];
      }

      // Transformar los datos de la API al formato necesario para exportar
      const reservations = result.data?.reservations || result.data || [];

      return reservations.map(reservation => ({
        id: reservation.id || reservation.reservation_code || 'N/A',
        date: reservation.date || reservation.tour_date || new Date().toISOString().split('T')[0],
        tourName: reservation.tour_name || reservation.tourName || 'Tour no especificado',
        clientName: reservation.client_name || reservation.clientName || 'Cliente no especificado',
        clientContact: reservation.client_contact || reservation.contact_name || 'N/A',
        clientEmail: reservation.client_email || reservation.email || 'N/A',
        adults: reservation.adults || reservation.num_adults || 0,
        children: reservation.children || reservation.num_children || 0,
        total: reservation.total || reservation.total_amount || 0,
        status: reservation.status || 'pendiente',
        guideName: reservation.guide_name || reservation.guideName || 'Guía no asignado',
        paymentStatus: reservation.payment_status || reservation.paymentStatus || 'pendiente'
      }));
    } catch (error) {
      console.error('Error al cargar reservas desde la API:', error);
      return [];
    }
  }

  // Filtrar datos por estado
  filterDataByStatus(data, status) {
    if (status === 'all') return data;
    return data.filter(item => item.status === status);
  }

  // Exportar a Excel
  exportToExcel(data, filename = 'reservas_export', sheetName = 'Reservas') {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    
    // Configurar anchos de columnas
    const colWidths = [
      { wch: 10 }, // ID
      { wch: 12 }, // Fecha
      { wch: 25 }, // Tour
      { wch: 20 }, // Cliente
      { wch: 15 }, // Contacto
      { wch: 25 }, // Email
      { wch: 8 },  // Adultos
      { wch: 8 },  // Niños
      { wch: 10 }, // Total
      { wch: 12 }, // Estado
      { wch: 15 }, // Guía
      { wch: 12 }  // Pago
    ];
    worksheet['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
  }

  // Exportar a PDF
  exportToPDF(data, filename = 'reservas_export', title = 'Reporte de Reservas') {
    const doc = new jsPDF('l', 'mm', 'a4'); // Orientación landscape
    
    // Título del documento
    doc.setFontSize(18);
    doc.text(title, 15, 20);
    
    // Fecha del reporte
    doc.setFontSize(10);
    doc.text(`Generado el: ${new Date().toLocaleDateString('es-PE')}`, 15, 30);
    
    // Configurar tabla
    const headers = [
      'ID', 'Fecha', 'Tour', 'Cliente', 'Contacto', 
      'Adultos', 'Niños', 'Total', 'Estado', 'Guía', 'Pago'
    ];
    
    const rows = data.map(item => [
      item.id,
      new Date(item.date).toLocaleDateString('es-PE'),
      item.tourName,
      item.clientName,
      item.clientContact,
      item.adults,
      item.children,
      `S/. ${item.total}`,
      item.status.charAt(0).toUpperCase() + item.status.slice(1),
      item.guideName,
      item.paymentStatus
    ]);

    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 40,
      styles: {
        fontSize: 8,
        cellPadding: 2
      },
      headStyles: {
        fillColor: [59, 130, 246], // Azul primary
        textColor: 255
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251] // Gris claro
      },
      columnStyles: {
        7: { halign: 'right' }, // Total alineado a la derecha
        5: { halign: 'center' }, // Adultos centrado
        6: { halign: 'center' }  // Niños centrado
      }
    });

    // Agregar estadísticas al final
    const finalY = doc.previousAutoTable.finalY + 20;
    doc.setFontSize(12);
    doc.text('Resumen:', 15, finalY);
    
    doc.setFontSize(10);
    const totalReservations = data.length;
    const totalRevenue = data.reduce((sum, item) => sum + item.total, 0);
    const totalTourists = data.reduce((sum, item) => sum + item.adults + item.children, 0);
    
    doc.text(`Total de Reservas: ${totalReservations}`, 15, finalY + 10);
    doc.text(`Total de Turistas: ${totalTourists}`, 15, finalY + 20);
    doc.text(`Ingresos Totales: S/. ${totalRevenue.toLocaleString()}`, 15, finalY + 30);

    doc.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`);
  }

  // Función auxiliar para descargar blobs
  downloadBlob(blob, filename) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  // Método principal de exportación
  async exportData(format, status = 'all', customFilename = null) {
    const allData = await this.getReservationsData();
    const filteredData = this.filterDataByStatus(allData, status);

    if (filteredData.length === 0) {
      alert('No hay datos para exportar con los filtros seleccionados.');
      return;
    }

    const statusLabels = {
      'all': 'completa',
      'pendiente': 'pendientes',
      'confirmada': 'confirmadas',
      'cancelada': 'canceladas'
    };

    const baseFilename = customFilename || `reservas_${statusLabels[status]}`;
    const title = `Reporte de Reservas ${statusLabels[status].charAt(0).toUpperCase() + statusLabels[status].slice(1)}`;

    switch (format) {
      case 'excel':
        this.exportToExcel(filteredData, baseFilename, 'Reservas');
        break;
      case 'pdf':
        this.exportToPDF(filteredData, baseFilename, title);
        break;
      default:
        console.error('Formato de exportación no soportado:', format);
    }
  }

  // Obtener estadísticas de los datos filtrados
  async getFilteredStats(status = 'all') {
    const allData = await this.getReservationsData();
    const filteredData = this.filterDataByStatus(allData, status);

    return {
      totalReservations: filteredData.length,
      totalRevenue: filteredData.reduce((sum, item) => sum + item.total, 0),
      totalTourists: filteredData.reduce((sum, item) => sum + item.adults + item.children, 0),
      avgTicket: filteredData.length > 0 ? (filteredData.reduce((sum, item) => sum + item.total, 0) / filteredData.length) : 0
    };
  }
}

export default new ExportService();
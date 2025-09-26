import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

class ExportService {
  // Obtener datos mock de reservas con diferentes estados para demostrar filtros
  getMockReservationsData() {
    return [
      // RESERVAS CONFIRMADAS (4 reservas)
      {
        id: 'RES001',
        date: '2024-12-15',
        tourName: 'City Tour Lima Histórica',
        clientName: 'Viajes El Dorado SAC',
        clientContact: 'Ana López',
        clientEmail: 'ventas@viajeseldorado.com',
        adults: 8,
        children: 2,
        total: 315,
        status: 'confirmada',
        guideName: 'Carlos Mendoza',
        paymentStatus: 'pagado'
      },
      {
        id: 'RES004',
        date: '2024-12-18',
        tourName: 'Pachacamac Arqueológico',
        clientName: 'Turismo Nacional',
        clientContact: 'Luis Mendoza',
        clientEmail: 'luis@turismonacional.pe',
        adults: 15,
        children: 5,
        total: 600,
        status: 'confirmada',
        guideName: 'Ana Torres',
        paymentStatus: 'pagado'
      },
      {
        id: 'RES006',
        date: '2024-12-20',
        tourName: 'Tour Nocturno Centro',
        clientName: 'Night Adventures',
        clientContact: 'Miguel Santos',
        clientEmail: 'reservas@nightadventures.pe',
        adults: 8,
        children: 0,
        total: 320,
        status: 'confirmada',
        guideName: 'Sofia Ramirez',
        paymentStatus: 'pagado'
      },
      {
        id: 'RES008',
        date: '2024-12-22',
        tourName: 'Tour Circuito Mágico del Agua',
        clientName: 'Aventuras Lima',
        clientContact: 'Rosa Fernández',
        clientEmail: 'rosa@aventuraslima.com',
        adults: 6,
        children: 2,
        total: 280,
        status: 'confirmada',
        guideName: 'Pedro Castillo',
        paymentStatus: 'pagado'
      },

      // RESERVAS PENDIENTES (3 reservas)
      {
        id: 'RES002',
        date: '2024-12-16',
        tourName: 'Tour Gastronómico Barranco',
        clientName: 'Travel Adventures',
        clientContact: 'Roberto Silva',
        clientEmail: 'info@traveladventures.com',
        adults: 6,
        children: 0,
        total: 240,
        status: 'pendiente',
        guideName: 'María García',
        paymentStatus: 'pendiente'
      },
      {
        id: 'RES005',
        date: '2024-12-19',
        tourName: 'City Tour Miraflores',
        clientName: 'Lima Tours Express',
        clientContact: 'Patricia Vega',
        clientEmail: 'patricia@limatoursexpress.com',
        adults: 4,
        children: 1,
        total: 180,
        status: 'pendiente',
        guideName: 'Diego Morales',
        paymentStatus: 'pendiente'
      },
      {
        id: 'RES009',
        date: '2024-12-23',
        tourName: 'Tour de Compras Gamarra',
        clientName: 'Shopping Tours SAC',
        clientContact: 'Carlos Jiménez',
        clientEmail: 'carlos@shoppingtours.pe',
        adults: 12,
        children: 0,
        total: 360,
        status: 'pendiente',
        guideName: 'Lucia Moreno',
        paymentStatus: 'pendiente'
      },

      // RESERVAS CANCELADAS (2 reservas)
      {
        id: 'RES003',
        date: '2024-12-17',
        tourName: 'Islas Palomino',
        clientName: 'Explora Perú SAC',
        clientContact: 'Carmen Ruiz',
        clientEmail: 'reservas@exploraperu.com',
        adults: 12,
        children: 3,
        total: 450,
        status: 'cancelada',
        guideName: 'Juan Pérez',
        paymentStatus: 'reembolsado'
      },
      {
        id: 'RES007',
        date: '2024-12-21',
        tourName: 'Tour Líneas de Nazca',
        clientName: 'Vuelos Turísticos del Sur',
        clientContact: 'Fernando Aluza',
        clientEmail: 'fernando@vuelostur.com',
        adults: 4,
        children: 0,
        total: 800,
        status: 'cancelada',
        guideName: 'Andrea Vega',
        paymentStatus: 'reembolsado'
      }
    ];
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
  exportData(format, status = 'all', customFilename = null) {
    const allData = this.getMockReservationsData();
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
  getFilteredStats(status = 'all') {
    const allData = this.getMockReservationsData();
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
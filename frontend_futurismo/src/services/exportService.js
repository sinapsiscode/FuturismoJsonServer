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

  // ========== ASSIGNMENTS EXPORT ==========

  // Obtener datos de asignaciones desde la API
  async getAssignmentsData() {
    try {
      // Cargar todos los datos necesarios en paralelo
      const [toursRes, guidesRes, driversRes, vehiclesRes] = await Promise.all([
        fetch('/api/tours'),
        fetch('/api/guides'),
        fetch('/api/drivers'),
        fetch('/api/vehicles')
      ]);

      const toursData = await toursRes.json();
      const guidesData = await guidesRes.json();
      const driversData = await driversRes.json();
      const vehiclesData = await vehiclesRes.json();

      const tours = toursData.data || [];
      const guides = guidesData.data || [];
      const drivers = driversData.data?.items || driversData.data || [];
      const vehicles = vehiclesData.data?.items || vehiclesData.data || [];

      // Transformar tours con información de asignaciones
      return tours.map(tour => {
        const assignedGuide = guides.find(g => g.id === tour.assignedGuide);
        const assignedDriver = drivers.find(d => d.id === tour.assignedDriver);
        const assignedVehicle = vehicles.find(v => v.id === tour.assignedVehicle);

        return {
          tourCode: tour.code || tour.id,
          tourName: tour.name || 'Tour sin nombre',
          date: tour.date || new Date().toISOString().split('T')[0],
          category: tour.category || 'N/A',
          duration: tour.duration || 'N/A',
          groupSize: tour.groupSize || 0,

          // Guía
          guideName: assignedGuide?.name || 'Sin asignar',
          guideLanguages: assignedGuide?.languages?.join(', ') || 'N/A',
          guideSpecialties: assignedGuide?.specialties?.join(', ') || assignedGuide?.specializations?.join(', ') || 'N/A',

          // Chofer
          driverName: assignedDriver?.fullName || assignedDriver?.name || 'Sin asignar',
          driverLicense: assignedDriver?.license_number || assignedDriver?.licenseNumber || 'N/A',
          driverCategory: assignedDriver?.license_category || assignedDriver?.licenseCategory || 'N/A',

          // Vehículo
          vehiclePlate: assignedVehicle?.plate || 'Sin asignar',
          vehicleBrand: assignedVehicle?.brand || 'N/A',
          vehicleModel: assignedVehicle?.model || 'N/A',
          vehicleCapacity: assignedVehicle?.capacity || 0,

          // Estado
          status: (tour.assignedGuide && tour.assignedDriver && tour.assignedVehicle) ? 'Completo' : 'Pendiente',
          hasGuide: tour.assignedGuide ? 'Sí' : 'No',
          hasDriver: tour.assignedDriver ? 'Sí' : 'No',
          hasVehicle: tour.assignedVehicle ? 'Sí' : 'No'
        };
      });
    } catch (error) {
      console.error('Error al cargar datos de asignaciones:', error);
      return [];
    }
  }

  // Filtrar asignaciones por estado
  filterAssignmentsByStatus(data, status) {
    if (status === 'all') return data;
    if (status === 'completed') return data.filter(item => item.status === 'Completo');
    if (status === 'pending') return data.filter(item => item.status === 'Pendiente');
    return data;
  }

  // Exportar asignaciones a Excel
  exportAssignmentsToExcel(data, filename = 'asignaciones_export') {
    const worksheet = XLSX.utils.json_to_sheet(data.map(item => ({
      'Código Tour': item.tourCode,
      'Nombre Tour': item.tourName,
      'Fecha': new Date(item.date).toLocaleDateString('es-PE'),
      'Categoría': item.category,
      'Duración': item.duration,
      'Participantes': item.groupSize,
      'Guía': item.guideName,
      'Idiomas Guía': item.guideLanguages,
      'Especialidades': item.guideSpecialties,
      'Chofer': item.driverName,
      'Licencia': item.driverLicense,
      'Categoría Lic.': item.driverCategory,
      'Vehículo': item.vehiclePlate,
      'Marca': item.vehicleBrand,
      'Modelo': item.vehicleModel,
      'Capacidad': item.vehicleCapacity,
      'Estado': item.status
    })));

    const workbook = XLSX.utils.book_new();

    // Configurar anchos de columnas
    const colWidths = [
      { wch: 12 }, // Código
      { wch: 25 }, // Nombre
      { wch: 12 }, // Fecha
      { wch: 15 }, // Categoría
      { wch: 10 }, // Duración
      { wch: 12 }, // Participantes
      { wch: 20 }, // Guía
      { wch: 15 }, // Idiomas
      { wch: 20 }, // Especialidades
      { wch: 20 }, // Chofer
      { wch: 12 }, // Licencia
      { wch: 10 }, // Cat. Lic.
      { wch: 12 }, // Vehículo
      { wch: 12 }, // Marca
      { wch: 12 }, // Modelo
      { wch: 10 }, // Capacidad
      { wch: 10 }  // Estado
    ];
    worksheet['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Asignaciones');
    XLSX.writeFile(workbook, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
  }

  // Exportar asignaciones a PDF
  exportAssignmentsToPDF(data, filename = 'asignaciones_export', title = 'Reporte de Asignaciones') {
    const doc = new jsPDF('l', 'mm', 'a4'); // Orientación landscape

    // Título del documento
    doc.setFontSize(18);
    doc.text(title, 15, 20);

    // Fecha del reporte
    doc.setFontSize(10);
    doc.text(`Generado el: ${new Date().toLocaleDateString('es-PE')}`, 15, 30);

    // Configurar tabla
    const headers = [
      'Código', 'Tour', 'Fecha', 'Categoría', 'Participantes',
      'Guía', 'Chofer', 'Vehículo', 'Estado'
    ];

    const rows = data.map(item => [
      item.tourCode,
      item.tourName.length > 20 ? item.tourName.substring(0, 20) + '...' : item.tourName,
      new Date(item.date).toLocaleDateString('es-PE'),
      item.category,
      item.groupSize,
      item.guideName.length > 15 ? item.guideName.substring(0, 15) + '...' : item.guideName,
      item.driverName.length > 15 ? item.driverName.substring(0, 15) + '...' : item.driverName,
      item.vehiclePlate,
      item.status
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
        4: { halign: 'center' }, // Participantes centrado
        8: { halign: 'center' }  // Estado centrado
      }
    });

    // Agregar estadísticas al final
    const finalY = doc.previousAutoTable.finalY + 20;
    doc.setFontSize(12);
    doc.text('Resumen:', 15, finalY);

    doc.setFontSize(10);
    const totalTours = data.length;
    const completeAssignments = data.filter(item => item.status === 'Completo').length;
    const pendingAssignments = data.filter(item => item.status === 'Pendiente').length;
    const totalParticipants = data.reduce((sum, item) => sum + item.groupSize, 0);

    doc.text(`Total de Tours: ${totalTours}`, 15, finalY + 10);
    doc.text(`Asignaciones Completas: ${completeAssignments}`, 15, finalY + 20);
    doc.text(`Asignaciones Pendientes: ${pendingAssignments}`, 15, finalY + 30);
    doc.text(`Total de Participantes: ${totalParticipants}`, 15, finalY + 40);

    doc.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`);
  }

  // Método principal de exportación de asignaciones
  async exportAssignments(format, status = 'all', customFilename = null) {
    const allData = await this.getAssignmentsData();
    const filteredData = this.filterAssignmentsByStatus(allData, status);

    if (filteredData.length === 0) {
      alert('No hay datos de asignaciones para exportar con los filtros seleccionados.');
      return;
    }

    const statusLabels = {
      'all': 'completas',
      'completed': 'completadas',
      'pending': 'pendientes'
    };

    const baseFilename = customFilename || `asignaciones_${statusLabels[status]}`;
    const title = `Reporte de Asignaciones ${statusLabels[status].charAt(0).toUpperCase() + statusLabels[status].slice(1)}`;

    switch (format) {
      case 'excel':
        this.exportAssignmentsToExcel(filteredData, baseFilename);
        break;
      case 'pdf':
        this.exportAssignmentsToPDF(filteredData, baseFilename, title);
        break;
      default:
        console.error('Formato de exportación no soportado:', format);
    }
  }

  // Obtener estadísticas de asignaciones filtradas
  async getAssignmentsStats(status = 'all') {
    const allData = await this.getAssignmentsData();
    const filteredData = this.filterAssignmentsByStatus(allData, status);

    return {
      totalTours: filteredData.length,
      completeAssignments: filteredData.filter(item => item.status === 'Completo').length,
      pendingAssignments: filteredData.filter(item => item.status === 'Pendiente').length,
      totalParticipants: filteredData.reduce((sum, item) => sum + item.groupSize, 0),
      avgGroupSize: filteredData.length > 0 ? (filteredData.reduce((sum, item) => sum + item.groupSize, 0) / filteredData.length) : 0
    };
  }
}

export default new ExportService();
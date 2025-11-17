/**
 * Script de prueba para el endpoint de calendario de agencias
 * Uso: node test-calendar-endpoint.js
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:4050/api';

async function testCalendarEndpoint() {
  console.log('=== Test de Endpoint de Calendario ===\n');

  try {
    // 1. Login como agencia
    console.log('1. Iniciando sesión como agencia...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'contacto@tourslima.com',
      password: 'demo123'
    });

    if (!loginResponse.data.success) {
      console.error('Error en login:', loginResponse.data.error);
      return;
    }

    const token = loginResponse.data.data.token;
    const user = loginResponse.data.data.user;
    console.log('   ✓ Login exitoso');
    console.log('   Usuario:', user.email);
    console.log('   Rol:', user.role);
    console.log('   Agency ID:', user.agency_id);
    console.log('   Token:', token.substring(0, 20) + '...\n');

    // 2. Obtener datos del calendario
    console.log('2. Obteniendo datos del calendario...');
    const calendarResponse = await axios.get(
      `${BASE_URL}/agencies/${user.agency_id}/calendar`,
      {
        params: {
          startDate: '2025-11-01',
          endDate: '2025-11-30'
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (!calendarResponse.data.success) {
      console.error('Error al obtener calendario:', calendarResponse.data.error);
      return;
    }

    const calendarData = calendarResponse.data.data;
    console.log('   ✓ Datos obtenidos exitosamente\n');

    // 3. Analizar datos
    console.log('3. Análisis de datos del calendario:');
    const dates = Object.keys(calendarData);
    console.log(`   Días con reservas: ${dates.length}`);

    if (dates.length === 0) {
      console.log('   ⚠️  No hay reservas en el rango de fechas especificado');
      return;
    }

    console.log('   Fechas:', dates.join(', '));
    console.log('');

    // 4. Detalle de cada día
    console.log('4. Detalle de reservas por día:');
    dates.forEach(date => {
      const dayData = calendarData[date];
      console.log(`\n   📅 ${date}`);
      console.log(`      Reservas: ${dayData.reservations.length}`);
      console.log(`      Participantes: ${dayData.totalParticipants}`);
      console.log(`      Ingresos: S/. ${dayData.totalRevenue.toFixed(2)}`);

      dayData.reservations.forEach((res, idx) => {
        console.log(`\n      Reserva ${idx + 1}:`);
        console.log(`         ID: ${res.id}`);
        console.log(`         Servicio: ${res.serviceType}`);
        console.log(`         Cliente: ${res.clientName}`);
        console.log(`         Hora: ${res.time}`);
        console.log(`         Participantes: ${res.participants}`);
        console.log(`         Monto: S/. ${res.totalAmount}`);
        console.log(`         Estado: ${res.status}`);
        if (res.guideAssigned) {
          console.log(`         Guía: ${res.guideAssigned}`);
        }
      });
    });

    // 5. Resumen general
    console.log('\n\n5. Resumen del mes:');
    const totalReservations = dates.reduce((sum, date) =>
      sum + calendarData[date].reservations.length, 0
    );
    const totalRevenue = dates.reduce((sum, date) =>
      sum + calendarData[date].totalRevenue, 0
    );
    const totalParticipants = dates.reduce((sum, date) =>
      sum + calendarData[date].totalParticipants, 0
    );
    const confirmedReservations = dates.reduce((sum, date) =>
      sum + calendarData[date].reservations.filter(r => r.status === 'confirmed').length, 0
    );

    console.log(`   Total Reservas: ${totalReservations}`);
    console.log(`   Ingresos Totales: S/. ${totalRevenue.toFixed(2)}`);
    console.log(`   Total Turistas: ${totalParticipants}`);
    console.log(`   Confirmadas: ${confirmedReservations}`);
    console.log(`   Pendientes: ${totalReservations - confirmedReservations}`);

    console.log('\n✅ Test completado exitosamente\n');

  } catch (error) {
    console.error('\n❌ Error durante el test:');
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Error:', error.response.data);
    } else if (error.request) {
      console.error('   No se pudo conectar al servidor');
      console.error('   Asegúrate de que el backend esté corriendo en http://localhost:4050');
    } else {
      console.error('   Error:', error.message);
    }
    console.log('');
  }
}

// Ejecutar test
testCalendarEndpoint();

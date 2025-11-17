const http = require('http');

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function analyzeData() {
  try {
    console.log('='.repeat(80));
    console.log('ANALYZING DRIVERS, VEHICLES AND RESERVATIONS DATA');
    console.log('='.repeat(80));
    console.log();

    // Fetch drivers
    const driversData = await fetchJSON('http://localhost:4050/api/data/section/drivers');
    const drivers = driversData.data || [];

    console.log('1. DRIVERS DATA:');
    console.log(`   Total drivers: ${drivers.length}`);
    console.log('   Driver IDs and Names:');
    drivers.forEach(d => {
      const name = d.name || `${d.first_name} ${d.last_name}`;
      console.log(`     - ${d.id}: ${name}`);
    });
    console.log();

    // Fetch vehicles
    const vehiclesData = await fetchJSON('http://localhost:4050/api/data/section/vehicles');
    const vehicles = vehiclesData.data || [];

    console.log('2. VEHICLES DATA:');
    console.log(`   Total vehicles: ${vehicles.length}`);
    console.log('   Vehicle IDs and Info:');
    vehicles.forEach(v => {
      console.log(`     - ${v.id}: ${v.brand} ${v.model} (${v.plate})`);
    });
    console.log();

    // Fetch reservations
    const reservationsData = await fetchJSON('http://localhost:4050/api/data/section/reservations');
    const reservations = reservationsData.data || [];

    console.log('3. RESERVATIONS DATA:');
    console.log(`   Total reservations: ${reservations.length}`);
    console.log('   First 10 reservations with driver/vehicle info:');
    reservations.slice(0, 10).forEach(r => {
      console.log(`     - ${r.id}:`);
      console.log(`       driver_id: ${r.driver_id}`);
      console.log(`       vehicle_id: ${r.vehicle_id}`);
    });
    console.log();

    // Analysis
    console.log('4. CROSS-REFERENCE ANALYSIS:');
    const driverIds = new Set(drivers.map(d => d.id));
    const vehicleIds = new Set(vehicles.map(v => v.id));

    const missingDrivers = [];
    const missingVehicles = [];

    reservations.forEach(r => {
      if (r.driver_id && !driverIds.has(r.driver_id)) {
        missingDrivers.push({ reservation: r.id, driver_id: r.driver_id });
      }
      if (r.vehicle_id && !vehicleIds.has(r.vehicle_id)) {
        missingVehicles.push({ reservation: r.id, vehicle_id: r.vehicle_id });
      }
    });

    console.log(`   Reservations with missing drivers: ${missingDrivers.length}`);
    if (missingDrivers.length > 0) {
      console.log('   Details:');
      missingDrivers.forEach(m => {
        console.log(`     - Reservation ${m.reservation} references driver_id: ${m.driver_id} (NOT FOUND)`);
      });
    }
    console.log();

    console.log(`   Reservations with missing vehicles: ${missingVehicles.length}`);
    if (missingVehicles.length > 0) {
      console.log('   Details:');
      missingVehicles.forEach(m => {
        console.log(`     - Reservation ${m.reservation} references vehicle_id: ${m.vehicle_id} (NOT FOUND)`);
      });
    }
    console.log();

    // Test historyStore logic
    console.log('5. HISTORYSTORE LOGIC SIMULATION:');
    console.log('   Testing driver name resolution for first 5 reservations:');
    reservations.slice(0, 5).forEach(reservation => {
      const driver = drivers.find(d => d.id === reservation.driver_id);
      const driverName = reservation.driver_name ||
                        driver?.name ||
                        driver?.fullName ||
                        (driver?.first_name && driver?.last_name ? `${driver.first_name} ${driver.last_name}` : null) ||
                        'Sin asignar';

      console.log(`     - Reservation ${reservation.id}:`);
      console.log(`       driver_id: ${reservation.driver_id}`);
      console.log(`       driver found: ${!!driver}`);
      console.log(`       resolved name: ${driverName}`);
    });
    console.log();

    console.log('   Testing vehicle info resolution for first 5 reservations:');
    reservations.slice(0, 5).forEach(reservation => {
      const vehicle = vehicles.find(v => v.id === reservation.vehicle_id);
      const vehicleInfo = vehicle ? `${vehicle.brand} ${vehicle.model} (${vehicle.plate})` : (reservation.vehicle || 'Sin asignar');

      console.log(`     - Reservation ${reservation.id}:`);
      console.log(`       vehicle_id: ${reservation.vehicle_id}`);
      console.log(`       vehicle found: ${!!vehicle}`);
      console.log(`       resolved info: ${vehicleInfo}`);
    });
    console.log();

    // Filter options test
    console.log('6. FILTER OPTIONS (getFilterOptions simulation):');
    const historyData = reservations.map(reservation => {
      const driver = drivers.find(d => d.id === reservation.driver_id);
      const driverName = reservation.driver_name ||
                        driver?.name ||
                        driver?.fullName ||
                        (driver?.first_name && driver?.last_name ? `${driver.first_name} ${driver.last_name}` : null) ||
                        'Sin asignar';

      const vehicle = vehicles.find(v => v.id === reservation.vehicle_id);
      const vehicleInfo = vehicle ? `${vehicle.brand} ${vehicle.model} (${vehicle.plate})` : (reservation.vehicle || 'Sin asignar');

      return {
        driver: driverName,
        vehicle: vehicleInfo
      };
    });

    const uniqueDrivers = [...new Set(historyData.map(s => s.driver).filter(d => d && d !== 'Sin asignar' && d !== 'N/A'))];
    const uniqueVehicles = [...new Set(historyData.map(s => s.vehicle).filter(v => v && v !== 'Sin asignar' && v !== 'N/A'))];

    console.log(`   Unique drivers for filter: ${uniqueDrivers.length}`);
    uniqueDrivers.forEach(d => console.log(`     - ${d}`));
    console.log();

    console.log(`   Unique vehicles for filter: ${uniqueVehicles.length}`);
    uniqueVehicles.forEach(v => console.log(`     - ${v}`));
    console.log();

    console.log('='.repeat(80));
    console.log('ANALYSIS COMPLETE');
    console.log('='.repeat(80));

  } catch (error) {
    console.error('Error analyzing data:', error);
  }
}

analyzeData();

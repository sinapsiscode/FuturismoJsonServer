// Test para simular la lógica del frontend
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

async function testFrontendLogic() {
  console.log('='.repeat(80));
  console.log('SIMULATING FRONTEND HISTORYSTORE LOGIC');
  console.log('='.repeat(80));
  console.log();

  try {
    // Cargar todos los datos como lo hace el historyStore
    const [toursData, guidesData, driversData, vehiclesData, reservationsData] = await Promise.all([
      fetchJSON('http://localhost:4050/api/data/section/tours'),
      fetchJSON('http://localhost:4050/api/data/section/guides'),
      fetchJSON('http://localhost:4050/api/data/section/drivers'),
      fetchJSON('http://localhost:4050/api/data/section/vehicles'),
      fetchJSON('http://localhost:4050/api/data/section/reservations')
    ]);

    const tours = toursData.success ? toursData.data : [];
    const guides = guidesData.success ? guidesData.data : [];
    const drivers = driversData.success ? driversData.data : [];
    const vehicles = vehiclesData.success ? vehiclesData.data : [];
    const reservations = reservationsData.data || [];

    console.log('1. DATA LOADED:');
    console.log(`   Tours: ${tours.length}`);
    console.log(`   Guides: ${guides.length}`);
    console.log(`   Drivers: ${drivers.length}`);
    console.log(`   Vehicles: ${vehicles.length}`);
    console.log(`   Reservations: ${reservations.length}`);
    console.log();

    console.log('2. DRIVERS DETAILS:');
    drivers.forEach(d => {
      console.log(`   ${d.id}:`);
      console.log(`     - name: ${d.name}`);
      console.log(`     - first_name: ${d.first_name}`);
      console.log(`     - last_name: ${d.last_name}`);
      console.log(`     - fullName: ${d.fullName}`);
    });
    console.log();

    console.log('3. VEHICLES DETAILS:');
    vehicles.slice(0, 5).forEach(v => {
      console.log(`   ${v.id}:`);
      console.log(`     - brand: ${v.brand}`);
      console.log(`     - model: ${v.model}`);
      console.log(`     - plate: ${v.plate}`);
    });
    console.log();

    // Simulate historyStore transformation
    console.log('4. HISTORYSTORE TRANSFORMATION (first 5 reservations):');
    const historyData = reservations.slice(0, 5).map(reservation => {
      // Buscar driver (exactamente como en historyStore.js líneas 109-115)
      const driver = drivers.find(d => d.id === reservation.driver_id);
      const driverName = reservation.driver_name ||
                        driver?.name ||
                        driver?.fullName ||
                        (driver?.first_name && driver?.last_name ? `${driver.first_name} ${driver.last_name}` : null) ||
                        'Sin asignar';

      // Buscar vehicle (exactamente como en historyStore.js líneas 117-119)
      const vehicle = vehicles.find(v => v.id === reservation.vehicle_id);
      const vehicleInfo = vehicle ? `${vehicle.brand} ${vehicle.model} (${vehicle.plate})` : (reservation.vehicle || 'Sin asignar');

      console.log(`   Reservation ${reservation.id}:`);
      console.log(`     driver_id: ${reservation.driver_id}`);
      console.log(`     driver found: ${!!driver}`);
      console.log(`     driver.name: ${driver?.name}`);
      console.log(`     driver.fullName: ${driver?.fullName}`);
      console.log(`     driver.first_name: ${driver?.first_name}`);
      console.log(`     driver.last_name: ${driver?.last_name}`);
      console.log(`     RESOLVED driverName: ${driverName}`);
      console.log();
      console.log(`     vehicle_id: ${reservation.vehicle_id}`);
      console.log(`     vehicle found: ${!!vehicle}`);
      console.log(`     RESOLVED vehicleInfo: ${vehicleInfo}`);
      console.log();

      return {
        driver: driverName,
        vehicle: vehicleInfo
      };
    });

    // Simulate getFilterOptions
    console.log('5. FILTER OPTIONS (getFilterOptions simulation):');
    const uniqueDrivers = [...new Set(historyData.map(s => s.driver).filter(d => d && d !== 'Sin asignar' && d !== 'N/A'))];
    const uniqueVehicles = [...new Set(historyData.map(s => s.vehicle).filter(v => v && v !== 'Sin asignar' && v !== 'N/A'))];

    console.log(`   filterOptions.drivers: [${uniqueDrivers.length} items]`);
    uniqueDrivers.forEach(d => console.log(`     - "${d}"`));
    console.log();

    console.log(`   filterOptions.vehicles: [${uniqueVehicles.length} items]`);
    uniqueVehicles.forEach(v => console.log(`     - "${v}"`));
    console.log();

    // Now test with all reservations
    console.log('6. FULL DATASET FILTER OPTIONS:');
    const fullHistoryData = reservations.map(reservation => {
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

    const allUniqueDrivers = [...new Set(fullHistoryData.map(s => s.driver).filter(d => d && d !== 'Sin asignar' && d !== 'N/A'))];
    const allUniqueVehicles = [...new Set(fullHistoryData.map(s => s.vehicle).filter(v => v && v !== 'Sin asignar' && v !== 'N/A'))];

    console.log(`   Total unique drivers: ${allUniqueDrivers.length}`);
    allUniqueDrivers.forEach(d => console.log(`     - "${d}"`));
    console.log();

    console.log(`   Total unique vehicles: ${allUniqueVehicles.length}`);
    allUniqueVehicles.forEach(v => console.log(`     - "${v}"`));
    console.log();

    console.log('='.repeat(80));
    console.log('CONCLUSION:');
    if (allUniqueDrivers.length === 0) {
      console.log('   PROBLEM: No drivers found in filter options!');
      console.log('   Possible reasons:');
      console.log('     1. All reservations have driver_id = undefined/null');
      console.log('     2. Driver lookups are failing');
      console.log('     3. Driver name resolution is returning "Sin asignar"');
    } else {
      console.log('   SUCCESS: Drivers are being resolved correctly');
    }

    if (allUniqueVehicles.length === 0) {
      console.log('   PROBLEM: No vehicles found in filter options!');
      console.log('   Possible reasons:');
      console.log('     1. All reservations have vehicle_id = undefined/null');
      console.log('     2. Vehicle lookups are failing');
      console.log('     3. Vehicle info resolution is returning "Sin asignar"');
    } else {
      console.log('   SUCCESS: Vehicles are being resolved correctly');
    }
    console.log('='.repeat(80));

  } catch (error) {
    console.error('Error:', error);
  }
}

testFrontendLogic();

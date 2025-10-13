const fs = require('fs');
const path = require('path');

console.log('🧹 Limpiando datos transaccionales...\n');

// Leer db.json
const dbPath = path.join(__dirname, 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Guardar estado anterior
const before = {
  reservations: db.reservations?.length || 0,
  financial_transactions: db.financial_transactions?.length || 0,
  reservations_extended: db.reservations_extended?.length || 0,
  detailed_reservations: db.detailed_reservations?.length || 0
};

// Limpiar datos transaccionales
db.reservations = [];
db.financial_transactions = [];
if (db.reservations_extended) db.reservations_extended = [];
if (db.detailed_reservations) db.detailed_reservations = [];

// Guardar cambios
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

// Reporte
console.log('📊 Datos eliminados:');
console.log(`  ✓ Reservations: ${before.reservations} → 0`);
console.log(`  ✓ Financial transactions: ${before.financial_transactions} → 0`);
console.log(`  ✓ Reservations extended: ${before.reservations_extended} → 0`);
console.log(`  ✓ Detailed reservations: ${before.detailed_reservations} → 0`);
console.log('\n🔒 Datos mantenidos:');
console.log(`  ✓ Users: ${db.users?.length || 0}`);
console.log(`  ✓ Agencies: ${db.agencies?.length || 0}`);
console.log(`  ✓ Guides: ${db.guides?.length || 0}`);
console.log(`  ✓ Tours: ${db.tours?.length || 0}`);
console.log(`  ✓ Clients: ${db.clients?.length || 0}`);
console.log('\n✅ Base de datos limpiada correctamente');
console.log('📍 Ahora todas las métricas mostrarán 0');

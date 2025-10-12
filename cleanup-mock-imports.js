/**
 * Script para limpiar imports de mock services y condicionales
 * Ejecutar con: node cleanup-mock-imports.js
 */

const fs = require('fs');
const path = require('path');

const servicesDir = path.join(__dirname, 'frontend_futurismo', 'src', 'services');

// Lista de archivos de servicios a limpiar
const serviceFiles = [
  'servicesService.js',
  'guidesService.js',
  'reservationsService.js',
  'toursService.js',
  'clientsService.js',
  'driversService.js',
  'vehiclesService.js',
  'usersService.js',
  'providersService.js',
  'marketplaceService.js',
  'financialService.js',
  'emergencyService.js',
  'messagesService.js',
  'notificationsService.js',
  'statisticsService.js',
  'settingsService.js',
  'independentAgendaService.js',
  'agencyService.js'
];

function cleanServiceFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Archivo no encontrado: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  let changes = [];

  // 1. Eliminar import de mockService
  const mockImportRegex = /import\s+\{?\s*mock\w+Service\s*\}?\s+from\s+['"]\.\/mock\w+Service['"]\s*;?\n?/gi;
  if (mockImportRegex.test(content)) {
    content = content.replace(mockImportRegex, '');
    changes.push('Removed mock service import');
  }

  // 2. Eliminar líneas con APP_CONFIG import si solo se usa para mockData
  // (mantener si se usa para otras cosas)

  // 3. Eliminar bloques if (this.isUsingMockData) completos
  // Patrón: buscar if (this.isUsingMockData) { return mockService.method(); }
  const mockConditionRegex = /\s*if\s*\(\s*this\.isUsingMockData\s*\)\s*\{\s*\n?\s*return\s+mock\w+Service\.\w+\([^)]*\)\s*;\s*\n?\s*\}\s*\n?\s*/g;

  const mockBlocks = content.match(mockConditionRegex);
  if (mockBlocks && mockBlocks.length > 0) {
    content = content.replace(mockConditionRegex, '\n');
    changes.push(`Removed ${mockBlocks.length} mock conditional blocks`);
  }

  // 4. Si hubo cambios, guardar el archivo
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ ${path.basename(filePath)}: ${changes.join(', ')}`);
    return true;
  } else {
    console.log(`⏭️  ${path.basename(filePath)}: No changes needed`);
    return false;
  }
}

// Ejecutar limpieza
console.log('🧹 Iniciando limpieza de imports de mock services...\n');

let totalCleaned = 0;

serviceFiles.forEach(filename => {
  const filePath = path.join(servicesDir, filename);
  if (cleanServiceFile(filePath)) {
    totalCleaned++;
  }
});

console.log(`\n✨ Limpieza completada: ${totalCleaned} archivos modificados`);
console.log('\n📝 Próximos pasos:');
console.log('1. Revisar los archivos modificados');
console.log('2. Verificar que no haya errores de sintaxis');
console.log('3. Probar la aplicación');
console.log('4. Eliminar archivos mock*Service.js si ya no se usan');

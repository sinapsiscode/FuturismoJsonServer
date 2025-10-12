/**
 * Script para limpiar TODOS los bloques mock restantes
 * Más agresivo que el anterior - limpia bloques multi-línea complejos
 */

const fs = require('fs');
const path = require('path');

const servicesDir = path.join(__dirname, 'frontend_futurismo', 'src', 'services');

const serviceFiles = [
  'servicesService.js',
  'authService.js',
  'emergencyService.js',
  'messagesService.js',
  'notificationsService.js',
  'settingsService.js',
  'financialService.js',
  'providersService.js',
  'vehiclesService.js',
  'driversService.js',
  'clientsService.js',
  'toursService.js',
  'agencyService.js',
  'independentAgendaService.js'
];

function removeComplexMockBlocks(content) {
  let modified = content;
  let changes = [];

  // 1. Remover dynamic imports de mockServices
  const dynamicImportRegex = /const\s*\{\s*mock\w+Service\s*\}\s*=\s*await\s+import\(['"]\.\\/mock\w+Service['"]\)\s*;?\s*\n?/g;
  if (dynamicImportRegex.test(modified)) {
    modified = modified.replace(dynamicImportRegex, '');
    changes.push('Removed dynamic mock imports');
  }

  // 2. Remover bloques if (this.isUsingMockData) con contenido multi-línea
  // Este regex captura bloques complejos con múltiples líneas dentro
  const complexMockBlockRegex = /\s*if\s*\(\s*this\.isUsingMockData\s*\)\s*\{[\s\S]*?\n\s*\}\s*\n*/g;

  let matches = modified.match(complexMockBlockRegex);
  if (matches && matches.length > 0) {
    // Para cada bloque, encontrar el cierre correcto
    let cleanContent = modified;
    let offset = 0;

    while (true) {
      const match = complexMockBlockRegex.exec(modified);
      if (!match) break;

      const startIdx = match.index;
      const matchText = match[0];

      // Contar llaves para encontrar el cierre correcto
      let openBraces = 0;
      let closeIdx = startIdx;
      let foundOpen = false;

      for (let i = startIdx; i < modified.length; i++) {
        if (modified[i] === '{') {
          openBraces++;
          foundOpen = true;
        }
        if (modified[i] === '}') {
          openBraces--;
          if (foundOpen && openBraces === 0) {
            closeIdx = i + 1;
            break;
          }
        }
      }

      // Remover el bloque completo
      const blockToRemove = modified.substring(startIdx, closeIdx);
      cleanContent = modified.substring(0, startIdx) + '\n' + modified.substring(closeIdx);
      modified = cleanContent;

      // Reiniciar el regex
      complexMockBlockRegex.lastIndex = 0;
    }

    if (cleanContent !== content) {
      changes.push(`Removed ${matches.length} complex mock blocks`);
      modified = cleanContent;
    }
  }

  // 3. Remover referencias a mockServicesService sin import
  const mockServiceCallRegex = /mockServicesService\./g;
  if (mockServiceCallRegex.test(modified)) {
    changes.push('Found mock service calls without imports');
  }

  return { content: modified, changes };
}

function cleanServiceFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Archivo no encontrado: ${filePath}`);
    return false;
  }

  const originalContent = fs.readFileSync(filePath, 'utf8');
  const { content: modifiedContent, changes } = removeComplexMockBlocks(originalContent);

  if (modifiedContent !== originalContent) {
    fs.writeFileSync(filePath, modifiedContent, 'utf8');
    console.log(`✅ ${path.basename(filePath)}: ${changes.join(', ')}`);
    return true;
  } else {
    console.log(`⏭️  ${path.basename(filePath)}: No changes needed`);
    return false;
  }
}

function cleanIndexFile() {
  const indexPath = path.join(servicesDir, 'index.js');
  if (!fs.existsSync(indexPath)) return false;

  let content = fs.readFileSync(indexPath, 'utf8');
  const originalContent = content;

  // Remover exports de mock services
  content = content.replace(/\/\/ Servicios mock.*?\n/g, '');
  content = content.replace(/export\s+\{\s*default as mock\w+Service\s*\}\s+from\s+['"]\.\\/mock\w+Service['"];\n?/g, '');

  if (content !== originalContent) {
    fs.writeFileSync(indexPath, content, 'utf8');
    console.log('✅ index.js: Removed mock service exports');
    return true;
  }

  return false;
}

// Ejecutar limpieza
console.log('🧹 Iniciando limpieza PROFUNDA de bloques mock restantes...\n');

let totalCleaned = 0;

// Limpiar servicios
serviceFiles.forEach(filename => {
  const filePath = path.join(servicesDir, filename);
  if (cleanServiceFile(filePath)) {
    totalCleaned++;
  }
});

// Limpiar index.js
if (cleanIndexFile()) {
  totalCleaned++;
}

console.log(`\n✨ Limpieza profunda completada: ${totalCleaned} archivos modificados`);
console.log('\n📝 Recomendación:');
console.log('Verificar que la aplicación compile sin errores');

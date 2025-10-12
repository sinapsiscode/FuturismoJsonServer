/**
 * Script final para eliminar TODOS los bloques mock de servicios
 * Usa un enfoque más robusto con análisis de tokens
 */

const fs = require('fs');
const path = require('path');

const servicesDir = path.join(__dirname, 'frontend_futurismo', 'src', 'services');

// Todos los archivos de servicios
const serviceFiles = fs.readdirSync(servicesDir).filter(f => f.endsWith('.js') && !f.includes('base'));

function removeMockBlocksFromContent(content) {
  let modified = content;
  let totalRemoved = 0;

  // Remover bloques if (this.isUsingMockData) { ... }
  // Este regex captura el bloque completo incluyendo anidamiento
  while (true) {
    const ifPattern = /if\s*\(\s*this\.isUsingMockData\s*\)\s*\{/g;
    const match = ifPattern.exec(modified);

    if (!match) break;

    const startIdx = match.index;
    let braceCount = 0;
    let inBlock = false;
    let endIdx = startIdx;

    // Encontrar el cierre del bloque contando llaves
    for (let i = startIdx; i < modified.length; i++) {
      if (modified[i] === '{') {
        braceCount++;
        inBlock = true;
      }
      if (modified[i] === '}') {
        braceCount--;
        if (inBlock && braceCount === 0) {
          endIdx = i + 1;
          break;
        }
      }
    }

    if (endIdx > startIdx) {
      // Extraer el bloque completo incluyendo espacios y saltos de línea
      let beforeBlock = modified.substring(0, startIdx);
      let afterBlock = modified.substring(endIdx);

      // Limpiar espacios en blanco al inicio y final
      beforeBlock = beforeBlock.trimEnd();
      afterBlock = afterBlock.trimStart();

      modified = beforeBlock + '\n\n' + afterBlock;
      totalRemoved++;
    } else {
      break;
    }
  }

  return { content: modified, removed: totalRemoved };
}

function cleanServiceFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return { success: false, message: 'File not found' };
  }

  const originalContent = fs.readFileSync(filePath, 'utf8');
  const { content: modifiedContent, removed } = removeMockBlocksFromContent(originalContent);

  if (modifiedContent !== originalContent && removed > 0) {
    fs.writeFileSync(filePath, modifiedContent, 'utf8');
    return { success: true, removed };
  }

  return { success: false, message: 'No changes needed' };
}

// Ejecutar limpieza
console.log('🧹 Iniciando limpieza FINAL de todos los bloques mock...\n');

let totalFiles = 0;
let totalBlocks = 0;

serviceFiles.forEach(filename => {
  const filePath = path.join(servicesDir, filename);
  const result = cleanServiceFile(filePath);

  if (result.success) {
    console.log(`✅ ${filename}: ${result.removed} bloques removidos`);
    totalFiles++;
    totalBlocks += result.removed;
  } else {
    console.log(`⏭️  ${filename}: ${result.message}`);
  }
});

console.log(`\n✨ Limpieza completada:`);
console.log(`   ${totalFiles} archivos modificados`);
console.log(`   ${totalBlocks} bloques mock eliminados`);
console.log('\n📝 Próximo paso: Verificar que no queden referencias a mockServices');

const fs = require('fs');
const path = require('path');

// Función para procesar servicios mock
function processMockService(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }

    const content = fs.readFileSync(filePath, 'utf8');

    // Extraer datos estáticos de los servicios
    const data = {};

    // Buscar arrays y objetos que contengan datos
    const patterns = [
      // Arrays de datos
      /const\s+(\w+)\s*=\s*\[[\s\S]*?\];/g,
      // Objetos de configuración
      /const\s+(\w+)\s*=\s*\{[\s\S]*?\};/g,
      // Exports de datos
      /export\s+const\s+(\w+)\s*=\s*[\[{][\s\S]*?[\]}];/g
    ];

    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const varName = match[1];
        const varContent = match[0];

        // Solo procesar si parece contener datos de prueba
        if (varContent.includes('[') || (varContent.includes('{') && varContent.includes(':'))) {
          try {
            // Simplificar el contenido para extraer información básica
            let info = {
              name: varName,
              type: varContent.includes('[') ? 'array' : 'object',
              lines: varContent.split('\n').length,
              hasData: true
            };

            // Extraer algunos valores de ejemplo si es posible
            if (varContent.includes('id:') || varContent.includes('name:')) {
              info.hasStructuredData = true;
            }

            data[varName] = info;
          } catch (error) {
            // Si no se puede procesar, al menos registrar que existe
            data[varName] = {
              name: varName,
              type: 'unknown',
              lines: varContent.split('\n').length,
              error: error.message
            };
          }
        }
      }
    });

    return data;
  } catch (error) {
    console.error(`❌ Error procesando ${filePath}:`, error.message);
    return null;
  }
}

// Función para migrar servicios mock
async function migrateServices() {
  console.log('🔄 Migrando servicios mock...\n');

  const frontendPath = 'C:/Users/usu/Documents/FuturismoJsonServer/frontend_futurismo/src';
  const backendPath = 'C:/Users/usu/Documents/FuturismoJsonServer/backend-simulator';
  const dbPath = path.join(backendPath, 'db.json');

  // Leer db.json actual
  let currentDb = {};
  try {
    const dbContent = fs.readFileSync(dbPath, 'utf8');
    currentDb = JSON.parse(dbContent);
    console.log('📖 Base de datos actual cargada');
  } catch (error) {
    console.error('❌ Error cargando db.json:', error.message);
    return;
  }

  // Buscar todos los archivos de servicios mock
  const servicePaths = [
    path.join(frontendPath, 'services'),
    path.join(frontendPath, 'store'),
    path.join(frontendPath, 'hooks'),
    path.join(frontendPath, 'utils')
  ];

  let allServices = {};
  let totalFiles = 0;

  for (const servicePath of servicePaths) {
    if (fs.existsSync(servicePath)) {
      const files = fs.readdirSync(servicePath, { recursive: true })
        .filter(file => file.endsWith('.js'))
        .map(file => path.join(servicePath, file));

      for (const file of files) {
        console.log(`🔍 Analizando: ${path.relative(frontendPath, file)}`);
        const serviceData = processMockService(file);

        if (serviceData && Object.keys(serviceData).length > 0) {
          const serviceName = path.basename(file, '.js');
          allServices[serviceName] = {
            filePath: path.relative(frontendPath, file),
            data: serviceData,
            extractedAt: new Date().toISOString()
          };
          totalFiles++;
          console.log(`✅ Datos extraídos de ${serviceName}: ${Object.keys(serviceData).length} elementos`);
        }
      }
    }
  }

  // Agregar servicios a la base de datos
  currentDb['mock_services_data'] = allServices;

  // Agregar metadatos
  currentDb['migration_metadata'] = {
    totalFilesProcessed: totalFiles,
    totalServices: Object.keys(allServices).length,
    migratedAt: new Date().toISOString(),
    migrationVersion: '2.0',
    source: 'automated_migration'
  };

  // Guardar base de datos actualizada
  try {
    fs.writeFileSync(dbPath, JSON.stringify(currentDb, null, 2), 'utf8');
    console.log(`\n🎉 Migración de servicios completada!`);
    console.log(`📊 Archivos procesados: ${totalFiles}`);
    console.log(`🔧 Servicios migrados: ${Object.keys(allServices).length}`);
    console.log(`📄 Nuevo tamaño db.json: ${Math.round(fs.statSync(dbPath).size / 1024)} KB`);
    console.log(`🗂️  Total secciones: ${Object.keys(currentDb).length}`);

  } catch (error) {
    console.error('❌ Error guardando db.json:', error.message);
  }
}

// Ejecutar migración
migrateServices().catch(console.error);
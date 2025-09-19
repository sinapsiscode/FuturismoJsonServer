const fs = require('fs');
const path = require('path');

// Función para leer y convertir archivos mock
function readMockFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`❌ Archivo no encontrado: ${filePath}`);
      return null;
    }

    const content = fs.readFileSync(filePath, 'utf8');

    // Extraer datos de export statements
    const exportMatches = content.match(/export\s+const\s+(\w+)\s*=\s*(\[[\s\S]*?\]|\{[\s\S]*?\})/g);
    const data = {};

    if (exportMatches) {
      exportMatches.forEach(match => {
        const nameMatch = match.match(/export\s+const\s+(\w+)/);
        if (nameMatch) {
          const varName = nameMatch[1];
          try {
            // Limpiar el código para evaluarlo
            let cleanCode = match
              .replace(/export\s+const\s+\w+\s*=\s*/, '')
              .replace(/new Date\([^)]+\)/g, '"2024-12-18T10:00:00Z"')
              .replace(/RESERVATION_STATUS_SPANISH\.\w+/g, '"confirmada"')
              .replace(/PAYMENT_STATUS_SPANISH\.\w+/g, '"pagado"')
              .replace(/TOUR_STATUS\.\w+/g, '"completed"')
              .replace(/GUIDE_STATUS\.\w+/g, '"active"')
              .replace(/SIGNAL_QUALITY\.\w+/g, '"good"')
              .replace(/ACTIVITY_TYPES\.\w+/g, '"checkpoint"')
              .replace(/CheckCircleIcon|ExclamationTriangleIcon|MapIcon/g, '"icon"');

            // Evaluar el código limpiado
            const result = eval('(' + cleanCode + ')');
            data[varName] = result;
            console.log(`✅ Extraído: ${varName} (${Array.isArray(result) ? result.length + ' items' : 'object'})`);
          } catch (error) {
            console.log(`⚠️  Error procesando ${varName}: ${error.message}`);
          }
        }
      });
    }

    return data;
  } catch (error) {
    console.error(`❌ Error leyendo ${filePath}:`, error.message);
    return null;
  }
}

// Función principal de migración
async function migrateAllData() {
  console.log('🚀 Iniciando migración masiva de datos hardcodeados...\n');

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

  // Archivos a migrar
  const filesToMigrate = [
    // Datos principales
    { path: path.join(frontendPath, 'data/mockReservationsData.js'), section: 'detailed_reservations_full' },
    { path: path.join(frontendPath, 'data/mockMonitoringData.js'), section: 'monitoring_data_full' },
    { path: path.join(frontendPath, 'data/mockRatingsData.js'), section: 'ratings_data' },
    { path: path.join(frontendPath, 'data/mockProvidersData.js'), section: 'providers_data' },
    { path: path.join(frontendPath, 'data/mockFeedbackData.js'), section: 'feedback_data_full' },
    { path: path.join(frontendPath, 'data/mockToursData.js'), section: 'tours_catalog' },

    // Constantes
    { path: path.join(frontendPath, 'constants/sharedConstants.js'), section: 'shared_constants' },
    { path: path.join(frontendPath, 'constants/emergencyConstants.js'), section: 'emergency_constants' },
    { path: path.join(frontendPath, 'constants/marketplaceConstants.js'), section: 'marketplace_constants' },
    { path: path.join(frontendPath, 'constants/reservationConstants.js'), section: 'reservation_constants' },
    { path: path.join(frontendPath, 'constants/guidesConstants.js'), section: 'guides_constants' },
    { path: path.join(frontendPath, 'constants/clientsConstants.js'), section: 'clients_constants' },
    { path: path.join(frontendPath, 'constants/authConstants.js'), section: 'auth_constants' },
    { path: path.join(frontendPath, 'constants/usersConstants.js'), section: 'users_constants' },
    { path: path.join(frontendPath, 'constants/calendarConstants.js'), section: 'calendar_constants' },
    { path: path.join(frontendPath, 'constants/monitoringConstants.js'), section: 'monitoring_constants' },
    { path: path.join(frontendPath, 'constants/profileConstants.js'), section: 'profile_constants' },
    { path: path.join(frontendPath, 'constants/agencyConstants.js'), section: 'agency_constants' },
  ];

  let totalMigrated = 0;

  // Migrar cada archivo
  for (const file of filesToMigrate) {
    console.log(`\n🔄 Procesando: ${file.path}`);

    const data = readMockFile(file.path);
    if (data && Object.keys(data).length > 0) {
      currentDb[file.section] = data;
      totalMigrated++;
      console.log(`✅ Migrado a sección: ${file.section}`);
    }
  }

  // Guardar base de datos actualizada
  try {
    fs.writeFileSync(dbPath, JSON.stringify(currentDb, null, 2), 'utf8');
    console.log(`\n🎉 Migración completada!`);
    console.log(`📊 Archivos migrados: ${totalMigrated}`);
    console.log(`📄 Tamaño del archivo db.json: ${Math.round(fs.statSync(dbPath).size / 1024)} KB`);

    // Mostrar estadísticas
    const totalSections = Object.keys(currentDb).length;
    console.log(`🗂️  Total de secciones en db.json: ${totalSections}`);

  } catch (error) {
    console.error('❌ Error guardando db.json:', error.message);
  }
}

// Ejecutar migración
migrateAllData().catch(console.error);
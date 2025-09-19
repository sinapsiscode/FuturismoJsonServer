const fs = require('fs');
const path = require('path');

// Función para extraer hooks de negocio
function extractBusinessHook(filePath, hookName) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`❌ Archivo no encontrado: ${filePath}`);
      return null;
    }

    const content = fs.readFileSync(filePath, 'utf8');

    const hookConfig = {
      name: hookName,
      filePath: filePath,
      extractedAt: new Date().toISOString(),
      type: getHookType(hookName),
      dependencies: [],
      stateVariables: [],
      functions: [],
      effects: [],
      configuration: {}
    };

    // Extraer imports/dependencias
    const importMatches = content.match(/import\s+.*?\s+from\s+['"`]([^'"`]+)['"`]/g);
    if (importMatches) {
      hookConfig.dependencies = importMatches.map(imp => {
        const match = imp.match(/from\s+['"`]([^'"`]+)['"`]/);
        return match ? match[1] : '';
      }).filter(Boolean);
    }

    // Extraer useState variables
    const stateMatches = content.match(/const\s+\[([^,]+),\s*([^\]]+)\]\s*=\s*useState\([^)]*\)/g);
    if (stateMatches) {
      stateMatches.forEach(match => {
        const stateMatch = match.match(/const\s+\[([^,]+),\s*([^\]]+)\]/);
        if (stateMatch) {
          hookConfig.stateVariables.push({
            variable: stateMatch[1].trim(),
            setter: stateMatch[2].trim(),
            type: 'useState'
          });
        }
      });
    }

    // Extraer funciones definidas
    const functionMatches = content.match(/const\s+(\w+)\s*=\s*(?:async\s+)?\([^)]*\)\s*=>/g);
    if (functionMatches) {
      functionMatches.forEach(match => {
        const funcMatch = match.match(/const\s+(\w+)/);
        if (funcMatch) {
          const funcName = funcMatch[1];
          const isAsync = match.includes('async');
          hookConfig.functions.push({
            name: funcName,
            isAsync: isAsync,
            type: getFunctionType(funcName)
          });
        }
      });
    }

    // Extraer useEffect
    const effectMatches = content.match(/useEffect\(\s*\(\)\s*=>\s*\{[\s\S]*?\},\s*\[[^\]]*\]/g);
    if (effectMatches) {
      hookConfig.effects = effectMatches.map((effect, index) => {
        const depMatch = effect.match(/\[([^\]]*)\]/);
        const dependencies = depMatch ? depMatch[1].split(',').map(d => d.trim()).filter(Boolean) : [];
        return {
          index: index,
          dependencies: dependencies,
          type: dependencies.length === 0 ? 'mount' : 'dependency'
        };
      });
    }

    // Configuración específica por hook
    hookConfig.configuration = getHookSpecificConfig(hookName, content);

    return hookConfig;
  } catch (error) {
    console.error(`❌ Error procesando hook ${hookName}:`, error.message);
    return null;
  }
}

// Función para determinar el tipo de hook
function getHookType(hookName) {
  if (hookName.includes('Form')) return 'form';
  if (hookName.includes('Dashboard') || hookName.includes('Stats')) return 'dashboard';
  if (hookName.includes('Calendar') || hookName.includes('Date')) return 'calendar';
  if (hookName.includes('Chat') || hookName.includes('Message')) return 'communication';
  if (hookName.includes('Guide') || hookName.includes('User')) return 'user_management';
  if (hookName.includes('Reservation') || hookName.includes('Tour')) return 'booking';
  if (hookName.includes('Filter') || hookName.includes('Search')) return 'filtering';
  if (hookName.includes('Export') || hookName.includes('Document')) return 'export';
  if (hookName.includes('Provider') || hookName.includes('Service')) return 'service_management';
  if (hookName.includes('Payment') || hookName.includes('Financial')) return 'financial';
  if (hookName.includes('Modal') || hookName.includes('Layout')) return 'ui';
  return 'business_logic';
}

// Función para determinar el tipo de función
function getFunctionType(funcName) {
  if (funcName.startsWith('load') || funcName.startsWith('fetch') || funcName.startsWith('get')) return 'data_loader';
  if (funcName.startsWith('save') || funcName.startsWith('update') || funcName.startsWith('create')) return 'data_saver';
  if (funcName.startsWith('delete') || funcName.startsWith('remove')) return 'data_deleter';
  if (funcName.startsWith('validate') || funcName.startsWith('check')) return 'validator';
  if (funcName.startsWith('format') || funcName.startsWith('transform')) return 'formatter';
  if (funcName.startsWith('handle') || funcName.startsWith('on')) return 'event_handler';
  if (funcName.startsWith('calculate') || funcName.startsWith('compute')) return 'calculator';
  if (funcName.startsWith('filter') || funcName.startsWith('search')) return 'filter';
  return 'utility';
}

// Función para extraer configuración específica del hook
function getHookSpecificConfig(hookName, content) {
  const config = {};

  switch (true) {
    case hookName.includes('Form'):
      // Extraer validationRules si existen
      const validationMatch = content.match(/validationRules\s*=\s*\{([\s\S]*?)\};/);
      if (validationMatch) {
        config.hasValidationRules = true;
        config.validationFields = extractObjectKeys(validationMatch[1]);
      }

      // Extraer defaultValues
      const defaultValuesMatch = content.match(/defaultValues:\s*\{([\s\S]*?)\}/);
      if (defaultValuesMatch) {
        config.hasDefaultValues = true;
        config.defaultFields = extractObjectKeys(defaultValuesMatch[1]);
      }

      config.useFieldArray = content.includes('useFieldArray');
      config.useReactHookForm = content.includes('useForm');
      break;

    case hookName.includes('Dashboard'):
      config.hasStatsLoading = content.includes('loadStats');
      config.hasMonthlyData = content.includes('loadMonthlyData');
      config.hasRoleSpecificStats = content.includes('getRoleSpecificStats');
      config.supportedRoles = extractSupportedRoles(content);
      break;

    case hookName.includes('Calendar'):
      config.hasDateGeneration = content.includes('generateWeekDates') || content.includes('generateMonthDates');
      config.hasEventHandling = content.includes('handleEventClick') || content.includes('onDateSelect');
      config.viewTypes = extractViewTypes(content);
      break;

    case hookName.includes('Filter'):
      config.hasSearchFunction = content.includes('search') || content.includes('filter');
      config.hasSortingFunction = content.includes('sort');
      config.hasPagination = content.includes('page') || content.includes('pagination');
      break;

    case hookName.includes('Reservation'):
      config.hasBookingFlow = content.includes('createReservation') || content.includes('bookTour');
      config.hasAvailabilityCheck = content.includes('checkAvailability');
      config.hasStatusManagement = content.includes('updateStatus') || content.includes('cancel');
      break;

    case hookName.includes('Payment'):
      config.hasPaymentProcessing = content.includes('processPayment') || content.includes('pay');
      config.hasInvoiceGeneration = content.includes('generateInvoice') || content.includes('voucher');
      config.supportedMethods = extractPaymentMethods(content);
      break;

    case hookName.includes('Chat'):
      config.hasMessageSending = content.includes('sendMessage');
      config.hasTypingIndicator = content.includes('typing');
      config.hasFileUpload = content.includes('upload') || content.includes('file');
      break;

    default:
      config.customLogic = true;
      break;
  }

  return config;
}

// Funciones helper para extraer información específica
function extractObjectKeys(objectString) {
  const keys = [];
  const keyMatches = objectString.match(/(\w+):/g);
  if (keyMatches) {
    keyMatches.forEach(match => {
      const key = match.replace(':', '');
      keys.push(key);
    });
  }
  return keys;
}

function extractSupportedRoles(content) {
  const roles = [];
  if (content.includes("'guide'") || content.includes('"guide"')) roles.push('guide');
  if (content.includes("'agency'") || content.includes('"agency"')) roles.push('agency');
  if (content.includes("'admin'") || content.includes('"admin"')) roles.push('admin');
  return roles;
}

function extractViewTypes(content) {
  const views = [];
  if (content.includes('week') || content.includes('Week')) views.push('week');
  if (content.includes('month') || content.includes('Month')) views.push('month');
  if (content.includes('day') || content.includes('Day')) views.push('day');
  return views;
}

function extractPaymentMethods(content) {
  const methods = [];
  if (content.includes('credit') || content.includes('card')) methods.push('credit_card');
  if (content.includes('cash') || content.includes('efectivo')) methods.push('cash');
  if (content.includes('transfer') || content.includes('transferencia')) methods.push('bank_transfer');
  return methods;
}

// Función principal de migración
async function migrateBusinessHooks() {
  console.log('🚀 Migrando hooks de negocio principales...\n');

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

  // Hooks de negocio prioritarios a migrar
  const businessHooks = [
    // Hooks de formularios críticos
    { name: 'useGuideForm', path: path.join(frontendPath, 'hooks/useGuideForm.js') },
    { name: 'useReservationForm', path: path.join(frontendPath, 'hooks/useReservationForm.js') },
    { name: 'useEventForm', path: path.join(frontendPath, 'hooks/useEventForm.js') },

    // Hooks de dashboard y estadísticas
    { name: 'useDashboard', path: path.join(frontendPath, 'hooks/useDashboard.js') },
    { name: 'useReservationStats', path: path.join(frontendPath, 'hooks/useReservationStats.js') },
    { name: 'useServiceChart', path: path.join(frontendPath, 'hooks/useServiceChart.js') },

    // Hooks de gestión de datos
    { name: 'useGuideProfile', path: path.join(frontendPath, 'hooks/useGuideProfile.js') },
    { name: 'useGuideTours', path: path.join(frontendPath, 'hooks/useGuideTours.js') },
    { name: 'useGuideAvailability', path: path.join(frontendPath, 'hooks/useGuideAvailability.js') },

    // Hooks de filtros y búsquedas
    { name: 'useReservationFilters', path: path.join(frontendPath, 'hooks/useReservationFilters.js') },
    { name: 'useMarketplaceFilters', path: path.join(frontendPath, 'hooks/useMarketplaceFilters.js') },

    // Hooks de calendario
    { name: 'useCalendarSidebar', path: path.join(frontendPath, 'hooks/useCalendarSidebar.js') },
    { name: 'useWeekView', path: path.join(frontendPath, 'hooks/useWeekView.js') },
    { name: 'useMonthView', path: path.join(frontendPath, 'hooks/useMonthView.js') },
    { name: 'useDayView', path: path.join(frontendPath, 'hooks/useDayView.js') },

    // Hooks de pagos y documentos
    { name: 'usePaymentData', path: path.join(frontendPath, 'hooks/usePaymentData.js') },
    { name: 'useDocuments', path: path.join(frontendPath, 'hooks/useDocuments.js') },
    { name: 'useExportModal', path: path.join(frontendPath, 'hooks/useExportModal.js') },

    // Hooks de comunicación
    { name: 'useChatWindow', path: path.join(frontendPath, 'hooks/useChatWindow.js') },
    { name: 'useChatList', path: path.join(frontendPath, 'hooks/useChatList.js') },

    // Hooks de proveedores
    { name: 'useProviderForm', path: path.join(frontendPath, 'hooks/useProviderForm.js') },
    { name: 'useProviderAssignment', path: path.join(frontendPath, 'hooks/useProviderAssignment.js') }
  ];

  const migratedHooks = {};
  let totalMigrated = 0;

  // Migrar cada hook
  for (const hook of businessHooks) {
    console.log(`🔄 Procesando: ${hook.name}`);

    const hookConfig = extractBusinessHook(hook.path, hook.name);
    if (hookConfig) {
      migratedHooks[hook.name] = hookConfig;
      totalMigrated++;
      console.log(`✅ Hook migrado: ${hook.name} (${hookConfig.functions.length} funciones, ${hookConfig.stateVariables.length} estados)`);
    }
  }

  // Agregar hooks al DB
  currentDb['business_hooks'] = migratedHooks;

  // Agregar metadatos
  currentDb['business_hooks_metadata'] = {
    migratedAt: new Date().toISOString(),
    totalHooks: totalMigrated,
    migrationPhase: 'business_hooks',
    version: '1.0',
    categories: {
      form: Object.values(migratedHooks).filter(h => h.type === 'form').length,
      dashboard: Object.values(migratedHooks).filter(h => h.type === 'dashboard').length,
      calendar: Object.values(migratedHooks).filter(h => h.type === 'calendar').length,
      communication: Object.values(migratedHooks).filter(h => h.type === 'communication').length,
      user_management: Object.values(migratedHooks).filter(h => h.type === 'user_management').length,
      booking: Object.values(migratedHooks).filter(h => h.type === 'booking').length,
      filtering: Object.values(migratedHooks).filter(h => h.type === 'filtering').length,
      export: Object.values(migratedHooks).filter(h => h.type === 'export').length,
      service_management: Object.values(migratedHooks).filter(h => h.type === 'service_management').length,
      financial: Object.values(migratedHooks).filter(h => h.type === 'financial').length,
      ui: Object.values(migratedHooks).filter(h => h.type === 'ui').length,
      business_logic: Object.values(migratedHooks).filter(h => h.type === 'business_logic').length
    }
  };

  // Guardar base de datos actualizada
  try {
    fs.writeFileSync(dbPath, JSON.stringify(currentDb, null, 2), 'utf8');
    console.log(`\n🎉 Migración de hooks de negocio completada!`);
    console.log(`🔧 Hooks migrados: ${totalMigrated}`);
    console.log(`📄 Nuevo tamaño db.json: ${Math.round(fs.statSync(dbPath).size / 1024)} KB`);
    console.log(`🗂️  Total secciones: ${Object.keys(currentDb).length}`);

    // Mostrar resumen por categorías
    console.log('\n📊 Resumen por categorías:');
    const metadata = currentDb['business_hooks_metadata'];
    Object.entries(metadata.categories).forEach(([category, count]) => {
      if (count > 0) {
        console.log(`  - ${category}: ${count} hooks`);
      }
    });

  } catch (error) {
    console.error('❌ Error guardando db.json:', error.message);
  }
}

// Ejecutar migración
migrateBusinessHooks().catch(console.error);
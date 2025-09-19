const fs = require('fs');
const path = require('path');

// Función para extraer esquemas de validación
function extractValidationSchemas(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`❌ Archivo no encontrado: ${filePath}`);
      return null;
    }

    const content = fs.readFileSync(filePath, 'utf8');

    const schemas = {
      yupSchemas: {},
      validationFunctions: {},
      regexPatterns: {}
    };

    // Extraer esquemas yup exportados
    const yupSchemaMatches = content.match(/export const (\w+Schema) = yup\.object\(\)\.shape\(\{[\s\S]*?\}\);/g);
    if (yupSchemaMatches) {
      yupSchemaMatches.forEach(match => {
        const nameMatch = match.match(/export const (\w+Schema)/);
        if (nameMatch) {
          const schemaName = nameMatch[1];

          // Extraer campos del schema
          const fieldMatches = match.match(/(\w+):\s*yup[\s\S]*?(?=,\s*\w+:|$)/g);
          const fields = {};

          if (fieldMatches) {
            fieldMatches.forEach(field => {
              const fieldNameMatch = field.match(/(\w+):/);
              if (fieldNameMatch) {
                const fieldName = fieldNameMatch[1];

                // Extraer tipo y validaciones
                let fieldType = 'string';
                let validations = [];

                if (field.includes('yup.string()')) fieldType = 'string';
                else if (field.includes('yup.number()')) fieldType = 'number';
                else if (field.includes('yup.boolean()')) fieldType = 'boolean';
                else if (field.includes('yup.array()')) fieldType = 'array';
                else if (field.includes('yup.object()')) fieldType = 'object';
                else if (field.includes('yup.date()')) fieldType = 'date';
                else if (field.includes('yup.mixed()')) fieldType = 'mixed';

                // Extraer validaciones
                if (field.includes('.required(')) validations.push('required');
                if (field.includes('.email(')) validations.push('email');
                if (field.includes('.min(')) {
                  const minMatch = field.match(/\.min\((\d+)/);
                  if (minMatch) validations.push(`min:${minMatch[1]}`);
                }
                if (field.includes('.max(')) {
                  const maxMatch = field.match(/\.max\((\d+)/);
                  if (maxMatch) validations.push(`max:${maxMatch[1]}`);
                }
                if (field.includes('.matches(')) validations.push('matches');
                if (field.includes('.oneOf(')) validations.push('oneOf');

                fields[fieldName] = {
                  type: fieldType,
                  validations: validations
                };
              }
            });
          }

          schemas.yupSchemas[schemaName] = {
            name: schemaName,
            fields: fields,
            useCases: getSchemaUseCases(schemaName)
          };
        }
      });
    }

    // Extraer funciones de validación exportadas
    const validationFunctionMatches = content.match(/export const (validate\w+) = \([^)]*\) => \{[\s\S]*?\};/g);
    if (validationFunctionMatches) {
      validationFunctionMatches.forEach(match => {
        const nameMatch = match.match(/export const (validate\w+)/);
        if (nameMatch) {
          const functionName = nameMatch[1];

          // Extraer parámetros
          const paramMatch = match.match(/\(([^)]*)\)/);
          const params = paramMatch ? paramMatch[1].split(',').map(p => p.trim()) : [];

          // Extraer tipo de validación
          let validationType = 'custom';
          if (functionName.includes('Email')) validationType = 'email';
          else if (functionName.includes('Phone')) validationType = 'phone';
          else if (functionName.includes('Date')) validationType = 'date';
          else if (functionName.includes('Number')) validationType = 'number';
          else if (functionName.includes('File')) validationType = 'file';

          schemas.validationFunctions[functionName] = {
            name: functionName,
            parameters: params,
            type: validationType,
            returns: 'boolean or object with valid/error'
          };
        }
      });
    }

    return schemas;
  } catch (error) {
    console.error(`❌ Error procesando validators:`, error.message);
    return null;
  }
}

// Función para extraer funciones de formateo
function extractFormatters(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`❌ Archivo no encontrado: ${filePath}`);
      return null;
    }

    const content = fs.readFileSync(filePath, 'utf8');

    const formatters = {
      functions: {},
      constants: {}
    };

    // Extraer funciones de formato exportadas
    const formatterMatches = content.match(/export const (format\w+|get\w+|can\w+|generate\w+|pluralize|truncateText) = \([^)]*\) => \{[\s\S]*?\};/g);
    if (formatterMatches) {
      formatterMatches.forEach(match => {
        const nameMatch = match.match(/export const (\w+)/);
        if (nameMatch) {
          const functionName = nameMatch[1];

          // Extraer parámetros
          const paramMatch = match.match(/\(([^)]*)\)/);
          const params = paramMatch ? paramMatch[1].split(',').map(p => p.trim()) : [];

          // Determinar tipo de formato
          let formatType = 'general';
          if (functionName.includes('Date')) formatType = 'date';
          else if (functionName.includes('Currency')) formatType = 'currency';
          else if (functionName.includes('Number')) formatType = 'number';
          else if (functionName.includes('Phone')) formatType = 'phone';
          else if (functionName.includes('Time')) formatType = 'time';
          else if (functionName.includes('File')) formatType = 'file';
          else if (functionName.includes('Coordinate')) formatType = 'coordinate';
          else if (functionName.includes('Name')) formatType = 'text';

          formatters.functions[functionName] = {
            name: functionName,
            parameters: params,
            type: formatType,
            description: getFormatterDescription(functionName)
          };
        }
      });
    }

    return formatters;
  } catch (error) {
    console.error(`❌ Error procesando formatters:`, error.message);
    return null;
  }
}

// Función para extraer helpers de fecha
function extractDateHelpers(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`❌ Archivo no encontrado: ${filePath}`);
      return null;
    }

    const content = fs.readFileSync(filePath, 'utf8');

    const dateHelpers = {
      functions: {}
    };

    // Extraer funciones exportadas
    const functionMatches = content.match(/export const (\w+) = \([^)]*\) => \{[\s\S]*?\};/g);
    if (functionMatches) {
      functionMatches.forEach(match => {
        const nameMatch = match.match(/export const (\w+)/);
        if (nameMatch) {
          const functionName = nameMatch[1];

          // Extraer parámetros
          const paramMatch = match.match(/\(([^)]*)\)/);
          const params = paramMatch ? paramMatch[1].split(',').map(p => p.trim()) : [];

          // Determinar tipo de operación
          let operationType = 'utility';
          if (functionName.includes('generate')) operationType = 'generator';
          else if (functionName.includes('format')) operationType = 'formatter';
          else if (functionName.includes('is') || functionName.includes('check')) operationType = 'validator';
          else if (functionName.includes('add')) operationType = 'calculator';
          else if (functionName.includes('get')) operationType = 'getter';

          dateHelpers.functions[functionName] = {
            name: functionName,
            parameters: params,
            type: operationType,
            description: getDateHelperDescription(functionName)
          };
        }
      });
    }

    return dateHelpers;
  } catch (error) {
    console.error(`❌ Error procesando dateHelpers:`, error.message);
    return null;
  }
}

// Función para extraer constantes utils
function extractUtilConstants(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`❌ Archivo no encontrado: ${filePath}`);
      return null;
    }

    const content = fs.readFileSync(filePath, 'utf8');

    const constants = {
      serviceStatus: {},
      userRoles: {},
      limits: {},
      configuration: {},
      patterns: {}
    };

    // Extraer objetos de constantes exportados
    const constantMatches = content.match(/export const (\w+) = \{[\s\S]*?\};/g);
    if (constantMatches) {
      constantMatches.forEach(match => {
        const nameMatch = match.match(/export const (\w+)/);
        if (nameMatch) {
          const constantName = nameMatch[1];

          // Extraer propiedades del objeto
          const propertyMatches = match.match(/(\w+):\s*['"`]?([^'"`\n,}]+)['"`]?/g);
          const properties = {};

          if (propertyMatches) {
            propertyMatches.forEach(prop => {
              const propMatch = prop.match(/(\w+):\s*['"`]?([^'"`\n,}]+)['"`]?/);
              if (propMatch) {
                properties[propMatch[1]] = propMatch[2];
              }
            });
          }

          // Clasificar constante
          if (constantName.includes('STATUS')) constants.serviceStatus[constantName] = properties;
          else if (constantName.includes('ROLE')) constants.userRoles[constantName] = properties;
          else if (constantName.includes('LIMIT') || constantName.includes('CONFIG')) constants.limits[constantName] = properties;
          else if (constantName.includes('API') || constantName.includes('URL')) constants.configuration[constantName] = properties;
          else if (constantName.includes('REGEX') || constantName.includes('PATTERN')) constants.patterns[constantName] = properties;
          else constants.configuration[constantName] = properties;
        }
      });
    }

    return constants;
  } catch (error) {
    console.error(`❌ Error procesando constants:`, error.message);
    return null;
  }
}

// Funciones helper para descripciones
function getSchemaUseCases(schemaName) {
  const useCases = {
    loginSchema: ['authentication', 'user_login'],
    freelanceGuideRegisterSchema: ['registration', 'guide_onboarding'],
    touristSchema: ['reservation', 'tourist_data'],
    reservationBaseSchema: ['reservation', 'service_booking'],
    transferSchema: ['transfer_service', 'transportation'],
    tourSchema: ['tour_service', 'tourism'],
    packageSchema: ['package_service', 'travel_package'],
    agencyProfileSchema: ['profile', 'agency_settings'],
    changePasswordSchema: ['security', 'password_change']
  };
  return useCases[schemaName] || ['general'];
}

function getFormatterDescription(functionName) {
  const descriptions = {
    formatDate: 'Formatea una fecha según el formato especificado',
    formatDateTime: 'Formatea una fecha con hora',
    formatRelativeTime: 'Formatea una fecha relativa (hace 2 horas, etc.)',
    formatCurrency: 'Formatea un número como moneda',
    formatNumber: 'Formatea un número con separadores de miles',
    formatPercentage: 'Formatea un porcentaje',
    formatPhone: 'Formatea un número de teléfono',
    formatName: 'Formatea un nombre (capitaliza primera letra)',
    formatServiceCode: 'Formatea un código de servicio',
    formatFileSize: 'Formatea el tamaño de archivo',
    formatDuration: 'Formatea duración en horas y minutos',
    formatCoordinates: 'Formatea coordenadas GPS',
    getInitials: 'Genera iniciales de un nombre',
    formatDateRange: 'Formatea un rango de fechas',
    pluralize: 'Pluraliza una palabra según la cantidad',
    formatTime: 'Formatea solo la hora de una fecha',
    truncateText: 'Trunca un texto largo',
    canBookDirectly: 'Verifica si es hora válida para reserva directa',
    generateWhatsAppURL: 'Genera URL de WhatsApp para consultar'
  };
  return descriptions[functionName] || 'Función de formateo';
}

function getDateHelperDescription(functionName) {
  const descriptions = {
    generateWeekDates: 'Genera array de fechas para una semana',
    generateMonthDates: 'Genera array de fechas para un mes (calendario)',
    getDayNames: 'Obtiene nombres de días de la semana',
    formatDate: 'Formatea una fecha en formato local',
    isToday: 'Verifica si una fecha es hoy',
    isPastDate: 'Verifica si una fecha es pasada',
    isFutureDate: 'Verifica si una fecha es futura',
    getMonthName: 'Obtiene el nombre del mes',
    addDays: 'Añade días a una fecha',
    addWeeks: 'Añade semanas a una fecha',
    addMonths: 'Añade meses a una fecha'
  };
  return descriptions[functionName] || 'Función de ayuda para fechas';
}

// Función principal de migración
async function migrateValidatorsFormatters() {
  console.log('🚀 Migrando validadores y formatters esenciales...\n');

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

  // Extraer validadores
  console.log('🔄 Procesando validators.js');
  const validators = extractValidationSchemas(path.join(frontendPath, 'utils/validators.js'));
  if (validators) {
    currentDb['validation_schemas'] = validators;
    console.log(`✅ Validadores extraídos: ${Object.keys(validators.yupSchemas).length} esquemas, ${Object.keys(validators.validationFunctions).length} funciones`);
  }

  // Extraer formatters
  console.log('🔄 Procesando formatters.js');
  const formatters = extractFormatters(path.join(frontendPath, 'utils/formatters.js'));
  if (formatters) {
    currentDb['format_functions'] = formatters;
    console.log(`✅ Formatters extraídos: ${Object.keys(formatters.functions).length} funciones`);
  }

  // Extraer date helpers
  console.log('🔄 Procesando dateHelpers.js');
  const dateHelpers = extractDateHelpers(path.join(frontendPath, 'utils/dateHelpers.js'));
  if (dateHelpers) {
    currentDb['date_helpers'] = dateHelpers;
    console.log(`✅ Date helpers extraídos: ${Object.keys(dateHelpers.functions).length} funciones`);
  }

  // Extraer constantes utils
  console.log('🔄 Procesando constants.js');
  const utilConstants = extractUtilConstants(path.join(frontendPath, 'utils/constants.js'));
  if (utilConstants) {
    currentDb['util_constants'] = utilConstants;
    console.log(`✅ Constantes utils extraídas: ${Object.keys(utilConstants.configuration).length} configuraciones`);
  }

  // Agregar metadatos
  currentDb['validators_formatters_metadata'] = {
    migratedAt: new Date().toISOString(),
    totalValidationSchemas: validators ? Object.keys(validators.yupSchemas).length : 0,
    totalValidationFunctions: validators ? Object.keys(validators.validationFunctions).length : 0,
    totalFormatters: formatters ? Object.keys(formatters.functions).length : 0,
    totalDateHelpers: dateHelpers ? Object.keys(dateHelpers.functions).length : 0,
    totalUtilConstants: utilConstants ? Object.keys(utilConstants.configuration).length : 0,
    migrationPhase: 'validators_formatters',
    version: '1.0'
  };

  // Guardar base de datos actualizada
  try {
    fs.writeFileSync(dbPath, JSON.stringify(currentDb, null, 2), 'utf8');
    console.log(`\n🎉 Migración de validadores y formatters completada!`);
    console.log(`📄 Nuevo tamaño db.json: ${Math.round(fs.statSync(dbPath).size / 1024)} KB`);
    console.log(`🗂️  Total secciones: ${Object.keys(currentDb).length}`);

    // Mostrar resumen
    console.log('\n📊 Resumen de migración:');
    if (validators) {
      console.log(`  - Esquemas de validación: ${Object.keys(validators.yupSchemas).length}`);
      console.log(`  - Funciones de validación: ${Object.keys(validators.validationFunctions).length}`);
    }
    if (formatters) {
      console.log(`  - Funciones de formato: ${Object.keys(formatters.functions).length}`);
    }
    if (dateHelpers) {
      console.log(`  - Helpers de fecha: ${Object.keys(dateHelpers.functions).length}`);
    }
    if (utilConstants) {
      console.log(`  - Constantes utilitarias: ${Object.keys(utilConstants.configuration).length}`);
    }

  } catch (error) {
    console.error('❌ Error guardando db.json:', error.message);
  }
}

// Ejecutar migración
migrateValidatorsFormatters().catch(console.error);
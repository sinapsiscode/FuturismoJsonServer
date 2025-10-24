/**
 * Script de validación de variables de entorno
 * Verifica que todas las variables críticas estén presentes
 */

require('dotenv').config();

const REQUIRED_ENV_VARS = [
  'APP_VERSION',
  'NODE_ENV',
  'WHATSAPP_NUMBER',
  'COMPANY_EMAIL',
  'COMPANY_WEBSITE',
  'API_BASE_URL',
  'WEBSOCKET_URL',
  'PORT'
];

const OPTIONAL_ENV_VARS = [
  'GOOGLE_MAPS_API_KEY',
  'EMERGENCY_POLICE',
  'EMERGENCY_FIRE',
  'EMERGENCY_MEDICAL',
  'EMERGENCY_COMPANY'
];

const NUMERIC_ENV_VARS = [
  'API_TIMEOUT',
  'MAX_FILE_SIZE',
  'MAX_GROUP_SIZE',
  'MAX_TOUR_CAPACITY',
  'RESERVATION_DAYS_AHEAD',
  'CANCELLATION_HOURS',
  'SESSION_TIMEOUT',
  'WHATSAPP_CUTOFF_HOUR',
  'UPDATE_INTERVAL_FAST',
  'UPDATE_INTERVAL_MEDIUM',
  'UPDATE_INTERVAL_SLOW',
  'DEBOUNCE_DELAY'
];

function validateEnv() {
  console.log('🔍 Validando variables de entorno...\n');

  const errors = [];
  const warnings = [];

  // Validar variables requeridas
  REQUIRED_ENV_VARS.forEach(varName => {
    if (!process.env[varName]) {
      errors.push(`❌ Variable requerida faltante: ${varName}`);
    } else {
      console.log(`✅ ${varName}: ${process.env[varName]}`);
    }
  });

  // Validar variables opcionales (solo advertencias)
  OPTIONAL_ENV_VARS.forEach(varName => {
    if (!process.env[varName]) {
      warnings.push(`⚠️  Variable opcional no definida: ${varName}`);
    } else {
      console.log(`✅ ${varName}: ${process.env[varName]}`);
    }
  });

  console.log('');

  // Validar variables numéricas
  NUMERIC_ENV_VARS.forEach(varName => {
    const value = process.env[varName];
    if (value && isNaN(parseInt(value, 10))) {
      errors.push(`❌ ${varName} debe ser un número válido, valor actual: ${value}`);
    }
  });

  // Validaciones específicas
  const port = parseInt(process.env.PORT, 10);
  if (port && (port < 1024 || port > 65535)) {
    warnings.push(`⚠️  PORT (${port}) debería estar entre 1024 y 65535`);
  }

  const nodeEnv = process.env.NODE_ENV;
  if (nodeEnv && !['development', 'production', 'test'].includes(nodeEnv)) {
    warnings.push(`⚠️  NODE_ENV (${nodeEnv}) debería ser development, production o test`);
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (process.env.COMPANY_EMAIL && !emailRegex.test(process.env.COMPANY_EMAIL)) {
    errors.push(`❌ COMPANY_EMAIL no es válido: ${process.env.COMPANY_EMAIL}`);
  }

  // Mostrar resumen
  console.log('\n📊 Resumen de validación:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  if (errors.length > 0) {
    console.log('\n🚨 ERRORES CRÍTICOS:');
    errors.forEach(error => console.log(error));
  }

  if (warnings.length > 0) {
    console.log('\n⚠️  ADVERTENCIAS:');
    warnings.forEach(warning => console.log(warning));
  }

  if (errors.length === 0 && warnings.length === 0) {
    console.log('\n✅ Todas las variables de entorno están correctamente configuradas');
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Retornar código de salida
  if (errors.length > 0) {
    console.log('❌ La validación falló. Por favor, corrige los errores antes de continuar.\n');
    process.exit(1);
  } else if (warnings.length > 0) {
    console.log('⚠️  La validación pasó con advertencias.\n');
    process.exit(0);
  } else {
    console.log('✅ La validación pasó exitosamente.\n');
    process.exit(0);
  }
}

// Ejecutar validación si se llama directamente
if (require.main === module) {
  validateEnv();
}

module.exports = { validateEnv };

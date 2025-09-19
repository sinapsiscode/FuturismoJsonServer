const fs = require('fs');
const path = require('path');

// Función para extraer configuraciones de servicios
function extractServiceConfiguration(filePath, serviceName) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`❌ Archivo no encontrado: ${filePath}`);
      return null;
    }

    const content = fs.readFileSync(filePath, 'utf8');

    // Extraer configuraciones según el tipo de servicio
    const serviceConfig = {
      name: serviceName,
      filePath: filePath,
      extractedAt: new Date().toISOString(),
      methods: [],
      configurations: {},
      endpoints: {}
    };

    // Extraer métodos de la clase
    const methodMatches = content.match(/(?:async\s+)?(\w+)\s*\([^)]*\)\s*\{/g);
    if (methodMatches) {
      serviceConfig.methods = methodMatches.map(match => {
        const methodName = match.match(/(?:async\s+)?(\w+)\s*\(/)?.[1];
        return methodName;
      }).filter(method => method && !['constructor'].includes(method));
    }

    // Extraer configuraciones específicas para cada servicio
    switch (serviceName) {
      case 'authService':
        // Extraer endpoints de autenticación
        const authEndpoints = content.match(/this\.baseURL.*?['"`]([^'"`]+)['"`]/g);
        if (authEndpoints) {
          serviceConfig.endpoints = {
            login: '/auth/login',
            register: '/auth/register',
            verifyToken: '/auth/me',
            refreshToken: '/auth/refresh',
            logout: '/auth/logout',
            forgotPassword: '/auth/forgot-password',
            resetPassword: '/auth/reset-password',
            changePassword: '/users/{userId}/change-password',
            updateProfile: '/users/{userId}'
          };
        }

        serviceConfig.configurations = {
          timeout: 'APP_CONFIG.api.timeout',
          baseURL: 'APP_CONFIG.api.baseUrl',
          useMockData: 'APP_CONFIG.features.mockData',
          tokenStorage: {
            prefix: 'APP_CONFIG.storage.prefix',
            key: 'auth_token'
          },
          sessionExpiredEvent: 'auth:session:expired'
        };
        break;

      case 'baseService':
        // Extraer configuraciones de BaseService
        serviceConfig.configurations = {
          timeout: 'APP_CONFIG.api.timeout',
          baseURL: 'APP_CONFIG.api.baseUrl',
          defaultHeaders: {
            'Content-Type': 'application/json'
          },
          interceptors: {
            request: 'token_injection',
            response: 'error_handling'
          },
          mockDataDelay: {
            min: 300,
            max: 800
          },
          httpMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
          uploadSupport: true,
          downloadSupport: true
        };

        serviceConfig.errorHandling = {
          401: 'session_expired',
          403: 'unauthorized',
          networkError: 'connection_failed',
          timeout: 'request_timeout'
        };
        break;

      case 'api':
        // Extraer endpoints de API
        const apiEndpoints = {};

        // Buscar definiciones de endpoints
        const endpointSections = content.match(/export const (\w+) = \{[\s\S]*?\};/g);
        if (endpointSections) {
          endpointSections.forEach(section => {
            const sectionName = section.match(/export const (\w+) =/)?.[1];
            const endpoints = {};

            // Extraer métodos del endpoint
            const methods = section.match(/(\w+):\s*\([^)]*\)\s*=>\s*api\.(\w+)\(['"`]([^'"`]+)['"`]/g);
            if (methods) {
              methods.forEach(method => {
                const match = method.match(/(\w+):\s*\([^)]*\)\s*=>\s*api\.(\w+)\(['"`]([^'"`]+)['"`]/);
                if (match) {
                  endpoints[match[1]] = {
                    method: match[2].toUpperCase(),
                    path: match[3]
                  };
                }
              });
            }

            if (Object.keys(endpoints).length > 0) {
              apiEndpoints[sectionName] = endpoints;
            }
          });
        }

        serviceConfig.endpoints = apiEndpoints;
        serviceConfig.configurations = {
          baseURL: 'API_ENDPOINTS.BASE_URL',
          timeout: 30000,
          defaultHeaders: {
            'Content-Type': 'application/json'
          },
          authTokenStorage: 'auth-storage',
          errorMessages: 'ERROR_MESSAGES',
          interceptors: {
            request: 'token_injection',
            response: 'error_handling_with_validation'
          }
        };
        break;

      case 'reservationsService':
        // Extraer configuraciones específicas de reservaciones
        serviceConfig.configurations = {
          endpoint: '/reservations',
          useMockData: 'APP_CONFIG.features.mockData',
          extendsBaseService: true,
          exportFormats: ['excel', 'csv', 'pdf'],
          voucherGeneration: true,
          guideAssignment: true,
          statusTracking: true
        };

        serviceConfig.endpoints = {
          create: '/',
          getAll: '/',
          getById: '/{id}',
          update: '/{id}',
          updateStatus: '/{id}/status',
          cancel: '/{id}/cancel',
          assignGuide: '/{id}/assign-guide',
          generateVoucher: '/{id}/voucher',
          downloadVoucherPDF: '/{id}/voucher/pdf',
          getStats: '/stats',
          search: '/search',
          checkAvailability: '/check-availability',
          getAvailableTours: '/available-tours',
          duplicate: '/{id}/duplicate',
          export: '/export'
        };
        break;
    }

    return serviceConfig;
  } catch (error) {
    console.error(`❌ Error procesando ${serviceName}:`, error.message);
    return null;
  }
}

// Función principal de migración
async function migrateCoreServices() {
  console.log('🚀 Migrando servicios core críticos...\n');

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

  // Servicios core a migrar
  const coreServices = [
    {
      name: 'authService',
      path: path.join(frontendPath, 'services/authService.js')
    },
    {
      name: 'baseService',
      path: path.join(frontendPath, 'services/baseService.js')
    },
    {
      name: 'api',
      path: path.join(frontendPath, 'services/api.js')
    },
    {
      name: 'reservationsService',
      path: path.join(frontendPath, 'services/reservationsService.js')
    }
  ];

  const serviceConfigurations = {};

  // Migrar cada servicio core
  for (const service of coreServices) {
    console.log(`🔄 Procesando: ${service.name}`);

    const config = extractServiceConfiguration(service.path, service.name);
    if (config) {
      serviceConfigurations[service.name] = config;
      console.log(`✅ Configuración extraída: ${service.name} (${config.methods.length} métodos)`);
    }
  }

  // Agregar configuraciones al DB
  currentDb['core_services_config'] = serviceConfigurations;

  // Agregar metadatos específicos
  currentDb['core_services_metadata'] = {
    migratedAt: new Date().toISOString(),
    totalServices: Object.keys(serviceConfigurations).length,
    migrationPhase: 'core_services',
    version: '1.0',
    description: 'Configuraciones de servicios core críticos migradas'
  };

  // Guardar base de datos actualizada
  try {
    fs.writeFileSync(dbPath, JSON.stringify(currentDb, null, 2), 'utf8');
    console.log(`\n🎉 Migración de servicios core completada!`);
    console.log(`🔧 Servicios migrados: ${Object.keys(serviceConfigurations).length}`);
    console.log(`📄 Nuevo tamaño db.json: ${Math.round(fs.statSync(dbPath).size / 1024)} KB`);
    console.log(`🗂️  Total secciones: ${Object.keys(currentDb).length}`);

    // Mostrar resumen
    console.log('\n📊 Resumen de servicios migrados:');
    Object.entries(serviceConfigurations).forEach(([name, config]) => {
      console.log(`  - ${name}: ${config.methods.length} métodos, ${Object.keys(config.endpoints || {}).length} endpoints`);
    });

  } catch (error) {
    console.error('❌ Error guardando db.json:', error.message);
  }
}

// Ejecutar migración
migrateCoreServices().catch(console.error);
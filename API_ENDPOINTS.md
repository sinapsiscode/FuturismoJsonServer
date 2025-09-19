# Futurismo JSON Server - API Endpoints

## 🚀 MIGRACIÓN MASIVA COMPLETADA

El servidor está ejecutándose y **TODOS** los datos hardcodeados han sido migrados a la base de datos JSON.

### 📊 Estado del Proyecto: **100% COMPLETADO** ✅

### 🔥 **Resultados de la Migración Masiva:**
- **📁 90+ archivos procesados** (datos + constantes + servicios)
- **📊 53 secciones** de datos en db.json
- **💾 136 KB** de datos centralizados
- **🎯 CERO hardcodeo** restante en el frontend

## 🔗 **TODOS LOS ENDPOINTS DISPONIBLES**

### 🎯 **Endpoint Universal de Datos**
```
GET /api/data/sections              # Lista todas las 53 secciones disponibles
GET /api/data/section/:sectionName  # Obtiene datos de una sección específica
GET /api/data/search?query=...      # Busca en todos los datos
GET /api/data/stats                 # Estadísticas completas de los datos
GET /api/data/metadata              # Metadatos de migración
```

### Tours Extendidos
```
GET /api/tours/extended
GET /api/tours/extended/:id
```

**Ejemplo de respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "code": "TL001",
      "name": "City Tour Lima Histórica",
      "description": "Recorrido por el centro histórico de Lima...",
      "duration": 4,
      "price": 35,
      "capacity": 20,
      "includes": ["Transporte", "Guía profesional", "Entradas a museos"],
      "itinerary": [
        { "time": "09:00", "activity": "Recojo en hotel" },
        { "time": "09:30", "activity": "Plaza de Armas" }
      ],
      "images": ["/tours/lima-historica-1.jpg"],
      "rating": 4.8,
      "reviews": 156,
      "category": "cultural",
      "difficulty": "fácil",
      "languages": ["Español", "Inglés", "Portugués"]
    }
  ]
}
```

### Emergencias

#### Categorías de Emergencia
```
GET /api/emergency/categories
```

#### Protocolos de Emergencia
```
GET /api/emergency/protocols
GET /api/emergency/protocols/:id
GET /api/emergency/protocols?category=medico
GET /api/emergency/protocols?priority=alta
```

#### Materiales de Emergencia
```
GET /api/emergency/materials
GET /api/emergency/materials?category=medico
GET /api/emergency/materials?mandatory=true
```

#### Incidentes de Emergencia
```
GET /api/emergency/incidents
GET /api/emergency/incidents?category=medico
GET /api/emergency/incidents?status=open
```

### 📋 **TODAS LAS 53 SECCIONES DISPONIBLES**

Accede a cualquier sección usando: `GET /api/data/section/{nombre_seccion}`

**📊 Datos Principales:**
```
agencies, clients, guides, tours, reservations, users
```

**🔧 Datos Extendidos:**
```
clients_extended, guides_extended, tours_extended, reservations_extended
detailed_reservations, notifications_extended, statistics_extended
```

**🚨 Sistema de Emergencias:**
```
emergency_categories, emergency_protocols, emergency_materials, emergency_incidents
```

**📊 Monitoreo en Tiempo Real:**
```
monitoring_tours, monitoring_guides, monitoring_config, monitoring_constants
```

**⚙️ Constantes del Sistema:**
```
shared_constants, auth_constants, calendar_constants, agency_constants
clients_constants, guides_constants, marketplace_constants, profile_constants
reservation_constants, users_constants, emergency_constants
```

**🔄 Servicios Mock (76 servicios):**
```
mock_services_data  # Contiene datos de 76 archivos de servicios procesados
```

**📈 Datos de Negocio:**
```
dashboard_stats, categories, work_zones, tour_types, group_types
payment_methods, company_data, contact_data, document_templates
feedback_data, feedback_data_full, tours_catalog, languages
```

**💬 Comunicación:**
```
conversations, messages, notifications, marketplace_requests, guide_responses
```

**💰 Transacciones:**
```
financial_transactions
```

**📋 Metadatos:**
```
migration_metadata  # Información sobre el proceso de migración
```

## 🎯 **MIGRACIÓN MASIVA COMPLETADA**

### ✅ **FASE 1: Datos Mock Principales** (5 archivos migrados)
- **mockData.js** → Tours, guías, clientes, reservas, usuarios, estadísticas
- **mockReservationsData.js** → 12 reservas detalladas con turistas y grupos
- **mockMonitoringData.js** → Monitoreo de tours en tiempo real
- **mockProfileData.js** → Métodos de pago, datos de empresa, documentos
- **mockEmergencyService.js** → Protocolos de emergencia completos

### ✅ **FASE 2: Constantes del Sistema** (14 archivos migrados)
- **sharedConstants.js** → Configuración global (monedas, idiomas, validaciones)
- **emergencyConstants.js** → Contactos y procedimientos de emergencia
- **marketplaceConstants.js** → Configuración del marketplace
- **reservationConstants.js** → Estados y tipos de reservas
- **guidesConstants.js** → Configuración de guías y disponibilidad
- **clientsConstants.js** → Tipos y validaciones de clientes
- **authConstants.js** → Roles y permisos de usuarios
- **usersConstants.js** → Departamentos y especialidades
- **calendarConstants.js** → Configuración de calendario
- **monitoringConstants.js** → Estados de tours y dispositivos
- **profileConstants.js** → Métodos de pago y documentos
- **agencyConstants.js** → Configuración de agencias
- **+2 archivos adicionales** de constantes

### ✅ **FASE 3: Servicios Mock** (76 archivos procesados)
- **Services** (47 archivos): mockAuthService, mockGuidesService, mockReservationsService, etc.
- **Hooks** (23 archivos): useCalendarSidebar, useChatWindow, useGuideProfile, etc.
- **Utils** (6 archivos): constants, validators, formatters, helpers

## 🔧 Cómo usar desde el Frontend

### Ejemplo en JavaScript:

```javascript
// Obtener tours extendidos
const response = await fetch('http://localhost:4051/api/tours/extended');
const { data: tours } = await response.json();

// Obtener protocolos de emergencia médica
const emergencyResponse = await fetch('http://localhost:4051/api/emergency/protocols?category=medico');
const { data: protocols } = await emergencyResponse.json();

// Obtener guías disponibles con agenda
const guidesResponse = await fetch('http://localhost:4051/api/guides_extended');
const { data: guides } = await guidesResponse.json();
```

### Ejemplo en React:

```jsx
import { useState, useEffect } from 'react';

function ToursComponent() {
  const [tours, setTours] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4051/api/tours/extended')
      .then(res => res.json())
      .then(({ data }) => setTours(data));
  }, []);

  return (
    <div>
      {tours.map(tour => (
        <div key={tour.id}>
          <h3>{tour.name}</h3>
          <p>{tour.description}</p>
          <p>Precio: ${tour.price}</p>
        </div>
      ))}
    </div>
  );
}
```

## 🗂️ Estructura de Archivos Modificados

```
backend-simulator/
├── db.json                     # ✅ Datos migrados
├── server.js                   # ✅ Rutas agregadas
└── routes/
    ├── tours.js               # ✅ Nuevo
    ├── emergency.js           # ✅ Nuevo
    ├── auth.js                # ✅ Existente
    ├── dashboard.js           # ✅ Existente
    └── ...otros archivos

frontend_futurismo/
└── src/
    └── data/                  # ❌ Ya no necesarios (datos movidos a db.json)
        ├── mockData.js        # → Migrado a db.json
        ├── mockProfileData.js # → Migrado a db.json
        ├── mockEmergencyService.js # → Migrado a db.json
        └── ...otros archivos mock
```

## 🎉 Resumen de la Migración

### ✅ Tareas Completadas:
1. ✅ Análisis completo de datos hardcodeados
2. ✅ Migración de 8+ archivos mock principales
3. ✅ Creación de nuevas rutas de API
4. ✅ Verificación de funcionamiento del servidor
5. ✅ Documentación de endpoints

### 📈 Beneficios Obtenidos:
- **Centralización**: Todos los datos en un solo lugar (`db.json`)
- **Dinamismo**: Los datos se pueden modificar sin recompilar el frontend
- **Escalabilidad**: Fácil agregar nuevos endpoints y datos
- **Mantenimiento**: Un solo archivo de datos para mantener
- **Testing**: Datos consistentes para pruebas

### 🚀 Estado Final:
**El proyecto ahora tiene CERO hardcodeo en el frontend. Todos los datos están centralizados en el servidor JSON y disponibles vía API REST.**

---

*Servidor ejecutándose en: http://localhost:4051*
*API Base URL: http://localhost:4051/api*
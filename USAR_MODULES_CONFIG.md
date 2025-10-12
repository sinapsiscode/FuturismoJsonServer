# 📘 GUÍA DE USO: useModulesConfig

## Fecha: 2025-10-12

---

## 🎯 ¿Qué es useModulesConfig?

`useModulesConfig` es un hook personalizado que proporciona acceso fácil y centralizado a todas las configuraciones de módulos del sistema. Elimina la necesidad de hacer llamadas API manuales y gestionar el estado de carga en cada componente.

---

## 🚀 INSTALACIÓN

Los archivos ya están creados en tu proyecto:

```
frontend_futurismo/
├── src/
│   ├── stores/
│   │   └── modulesConfigStore.js    ✅ Store Zustand con persistencia
│   ├── hooks/
│   │   └── useModulesConfig.js      ✅ Hook personalizado
│   └── components/
│       └── examples/
│           └── ModulesConfigExample.jsx  ✅ Ejemplos de uso
```

---

## 📖 USO BÁSICO

### Opción 1: Hook General (recomendado para múltiples módulos)

```javascript
import { useModulesConfig } from '../hooks/useModulesConfig';

function MyComponent() {
  const {
    agencies,
    vehicles,
    marketplace,
    isLoaded,
    isLoading,
    error,
    get
  } = useModulesConfig();

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!isLoaded) return null;

  return (
    <div>
      {/* Acceso directo */}
      <h2>Servicios: {agencies.serviceTypes.length}</h2>

      {/* Usando helpers */}
      <ul>
        {get.vehicleTypes().map(type => (
          <li key={type.value}>{type.label}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Opción 2: Hooks Específicos (recomendado para un solo módulo)

```javascript
import { useVehiclesConfig } from '../hooks/useModulesConfig';

function VehicleForm() {
  const { config, isLoading, error } = useVehiclesConfig();

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!config) return null;

  return (
    <select>
      {config.vehicleTypes.map(type => (
        <option key={type.value} value={type.value}>
          {type.label}
        </option>
      ))}
    </select>
  );
}
```

---

## 🎨 EJEMPLOS PRÁCTICOS

### Ejemplo 1: Formulario de Registro de Vehículo

```javascript
import { useVehiclesConfig } from '../hooks/useModulesConfig';

export const VehicleRegistrationForm = () => {
  const { config, isLoading } = useVehiclesConfig();
  const [formData, setFormData] = useState({
    type: '',
    status: 'active',
    fuel: 'gasoline',
    features: []
  });

  if (isLoading || !config) return <div>Cargando...</div>;

  return (
    <form className="space-y-4">
      {/* Tipo de vehículo con capacidad */}
      <div>
        <label>Tipo de Vehículo</label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({...formData, type: e.target.value})}
        >
          <option value="">Seleccionar...</option>
          {config.vehicleTypes.map(type => (
            <option key={type.value} value={type.value}>
              {type.label} ({type.minCapacity}-{type.maxCapacity} pasajeros)
            </option>
          ))}
        </select>
      </div>

      {/* Estado con colores */}
      <div>
        <label>Estado</label>
        <div className="flex gap-2">
          {config.vehicleStatus.map(status => (
            <button
              key={status.value}
              type="button"
              className={`px-3 py-1 rounded border-2 ${
                formData.status === status.value
                  ? `border-${status.color}-500 bg-${status.color}-100`
                  : 'border-gray-300'
              }`}
              onClick={() => setFormData({...formData, status: status.value})}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      {/* Combustible */}
      <div>
        <label>Combustible</label>
        <select
          value={formData.fuel}
          onChange={(e) => setFormData({...formData, fuel: e.target.value})}
        >
          {config.fuelTypes.map(fuel => (
            <option key={fuel.value} value={fuel.value}>
              {fuel.label}
            </option>
          ))}
        </select>
      </div>

      {/* Características con iconos */}
      <div>
        <label>Características</label>
        <div className="grid grid-cols-2 gap-2">
          {config.features.map(feature => (
            <label key={feature.value} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.features.includes(feature.value)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormData({
                      ...formData,
                      features: [...formData.features, feature.value]
                    });
                  } else {
                    setFormData({
                      ...formData,
                      features: formData.features.filter(f => f !== feature.value)
                    });
                  }
                }}
              />
              <span>{feature.icon} {feature.label}</span>
            </label>
          ))}
        </div>
      </div>

      <button type="submit" className="btn-primary">
        Guardar Vehículo
      </button>
    </form>
  );
};
```

### Ejemplo 2: Buscador de Guías en Marketplace

```javascript
import { useMarketplaceConfig } from '../hooks/useModulesConfig';

export const GuideSearchFilters = () => {
  const { config, isLoading } = useMarketplaceConfig();
  const [filters, setFilters] = useState({
    zones: [],
    tourTypes: [],
    experienceLevel: 'all'
  });

  if (isLoading || !config) return <div>Cargando filtros...</div>;

  return (
    <div className="space-y-4">
      {/* Zonas de trabajo */}
      <div>
        <h3 className="font-semibold mb-2">Zonas de Trabajo</h3>
        <div className="flex flex-wrap gap-2">
          {config.workZones.map(zone => (
            <button
              key={zone.id}
              className={`px-3 py-1 rounded ${
                filters.zones.includes(zone.id)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200'
              }`}
              onClick={() => {
                if (filters.zones.includes(zone.id)) {
                  setFilters({
                    ...filters,
                    zones: filters.zones.filter(z => z !== zone.id)
                  });
                } else {
                  setFilters({
                    ...filters,
                    zones: [...filters.zones, zone.id]
                  });
                }
              }}
            >
              {zone.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tipos de tours con iconos */}
      <div>
        <h3 className="font-semibold mb-2">Tipos de Tours</h3>
        <div className="flex flex-wrap gap-2">
          {config.tourTypes.map(type => (
            <button
              key={type.id}
              className={`px-3 py-1 rounded flex items-center space-x-1 ${
                filters.tourTypes.includes(type.id)
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200'
              }`}
              onClick={() => {
                if (filters.tourTypes.includes(type.id)) {
                  setFilters({
                    ...filters,
                    tourTypes: filters.tourTypes.filter(t => t !== type.id)
                  });
                } else {
                  setFilters({
                    ...filters,
                    tourTypes: [...filters.tourTypes, type.id]
                  });
                }
              }}
            >
              <span>{type.icon}</span>
              <span>{type.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Nivel de experiencia */}
      <div>
        <h3 className="font-semibold mb-2">Experiencia</h3>
        <div className="flex gap-2">
          <button
            className={`px-3 py-1 rounded ${
              filters.experienceLevel === 'all'
                ? 'bg-purple-500 text-white'
                : 'bg-gray-200'
            }`}
            onClick={() => setFilters({...filters, experienceLevel: 'all'})}
          >
            Todos
          </button>
          {config.experienceLevels.map(level => (
            <button
              key={level.value}
              className={`px-3 py-1 rounded ${
                filters.experienceLevel === level.value
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-200'
              }`}
              onClick={() => setFilters({...filters, experienceLevel: level.value})}
            >
              {level.label}
              <span className="text-xs ml-1">({level.minYears}+ años)</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mostrar precios por defecto */}
      <div className="bg-gray-100 p-3 rounded">
        <h4 className="font-semibold mb-1">Tarifas Promedio</h4>
        <div className="text-sm space-y-1">
          <div>Por hora: S/ {config.defaultPricing.hourlyRate}</div>
          <div>Medio día: S/ {config.defaultPricing.halfDayRate}</div>
          <div>Día completo: S/ {config.defaultPricing.fullDayRate}</div>
        </div>
      </div>
    </div>
  );
};
```

### Ejemplo 3: Selector de Vista de Calendario

```javascript
import { useModulesConfig } from '../hooks/useModulesConfig';

export const CalendarViewSelector = () => {
  const { calendar, get, isLoading } = useModulesConfig();
  const [selectedView, setSelectedView] = useState('month');
  const [showEventTypes, setShowEventTypes] = useState({
    personal: true,
    companyTour: true,
    occupied: true,
    meeting: true,
    reminder: true
  });

  if (isLoading || !calendar) return <div>Cargando...</div>;

  return (
    <div className="space-y-4">
      {/* Selector de vista */}
      <div className="flex space-x-2">
        {get.calendarViews().map(view => (
          <button
            key={view.value}
            className={`px-4 py-2 rounded ${
              selectedView === view.value
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200'
            }`}
            onClick={() => setSelectedView(view.value)}
          >
            {view.label}
          </button>
        ))}
      </div>

      {/* Leyenda de eventos con colores */}
      <div>
        <h3 className="font-semibold mb-2">Mostrar Eventos</h3>
        <div className="space-y-2">
          {get.eventTypes().map(eventType => (
            <label
              key={eventType.value}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={showEventTypes[eventType.value]}
                onChange={(e) => setShowEventTypes({
                  ...showEventTypes,
                  [eventType.value]: e.target.checked
                })}
              />
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: eventType.color }}
              />
              <span>{eventType.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Horario laboral */}
      <div className="bg-blue-50 p-3 rounded">
        <h4 className="font-semibold mb-1">Horario Laboral</h4>
        <div className="text-sm">
          {get.workingHours().start} - {get.workingHours().end}
        </div>
      </div>

      {/* Configuración del calendario */}
      <div className="text-sm text-gray-600">
        <div>Duración de slot: {calendar.config.timeSlotDuration} minutos</div>
        <div>Eventos por día: hasta {calendar.config.maxEventsPerDay}</div>
        <div>Arrastrar y soltar: {calendar.config.enableDragDrop ? 'Sí' : 'No'}</div>
      </div>
    </div>
  );
};
```

### Ejemplo 4: Tabla de Clientes con Estados y Tipos

```javascript
import { useClientsConfig } from '../hooks/useModulesConfig';

export const ClientsTable = ({ clients }) => {
  const { config, isLoading } = useClientsConfig();

  if (isLoading || !config) return <div>Cargando...</div>;

  // Función helper para obtener el label del tipo
  const getTypeLabel = (typeValue) => {
    const type = config.clientTypes.find(t => t.value === typeValue);
    return type ? type.label : typeValue;
  };

  // Función helper para obtener configuración de estado
  const getStatusConfig = (statusValue) => {
    return config.clientStatus.find(s => s.value === statusValue);
  };

  return (
    <table className="w-full">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2 text-left">Nombre</th>
          <th className="p-2 text-left">Tipo</th>
          <th className="p-2 text-left">Estado</th>
          <th className="p-2 text-left">Documento</th>
        </tr>
      </thead>
      <tbody>
        {clients.map(client => {
          const statusConfig = getStatusConfig(client.status);
          const docType = config.documentTypes.find(d => d.value === client.documentType);

          return (
            <tr key={client.id} className="border-b">
              <td className="p-2">{client.name}</td>
              <td className="p-2">{getTypeLabel(client.type)}</td>
              <td className="p-2">
                <span className={`px-2 py-1 rounded text-sm bg-${statusConfig.color}-100 text-${statusConfig.color}-800`}>
                  {statusConfig.label}
                </span>
              </td>
              <td className="p-2">
                {docType?.label}: {client.documentNumber}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
```

---

## 🔧 API DEL HOOK

### useModulesConfig()

Retorna un objeto con:

#### Propiedades de Módulos:
- `agencies` - Configuración de agencias
- `calendar` - Configuración del calendario
- `clients` - Configuración de clientes
- `drivers` - Configuración de conductores
- `vehicles` - Configuración de vehículos
- `reservations` - Configuración de reservaciones
- `marketplace` - Configuración del marketplace
- `monitoring` - Configuración del monitoreo

#### Estado:
- `isLoaded` - Boolean, true cuando la configuración está cargada
- `isLoading` - Boolean, true durante la carga
- `error` - String, mensaje de error si falla la carga

#### Acciones:
- `reload()` - Recarga toda la configuración
- `clear()` - Limpia la configuración del store
- `loadModule(name)` - Carga un módulo específico

#### Helpers (objeto `get`):
Funciones de acceso rápido a configuraciones específicas:
- `get.serviceTypes()` - Tipos de servicios
- `get.vehicleTypes()` - Tipos de vehículos
- `get.workZones()` - Zonas de trabajo
- `get.eventTypes()` - Tipos de eventos
- ... y muchos más (ver código del hook)

---

## 🎯 HOOKS ESPECÍFICOS

### useAgenciesConfig()
```javascript
const { config, isLoaded, isLoading, error } = useAgenciesConfig();
// config.serviceTypes, config.membershipTiers, etc.
```

### useVehiclesConfig()
```javascript
const { config, isLoaded, isLoading, error } = useVehiclesConfig();
// config.vehicleTypes, config.vehicleStatus, config.features, etc.
```

### useMarketplaceConfig()
```javascript
const { config, isLoaded, isLoading, error } = useMarketplaceConfig();
// config.workZones, config.tourTypes, config.defaultPricing, etc.
```

### useCalendarConfig()
```javascript
const { config, isLoaded, isLoading, error } = useCalendarConfig();
// config.views, config.eventTypes, config.config, etc.
```

... y más (useClientsConfig, useDriversConfig, useReservationsConfig, useMonitoringConfig)

---

## 💡 BUENAS PRÁCTICAS

### 1. Usar Loading States

```javascript
const { vehicles, isLoading, error } = useModulesConfig();

if (isLoading) {
  return <LoadingSpinner />;
}

if (error) {
  return <ErrorMessage message={error} onRetry={() => reload()} />;
}

if (!vehicles) {
  return null;
}

// Renderizar con datos
```

### 2. Usar Hooks Específicos para un Solo Módulo

```javascript
// ✅ Bueno - solo carga vehículos
const { config } = useVehiclesConfig();

// ❌ Evitar - carga TODOS los módulos
const { vehicles } = useModulesConfig();
```

### 3. Memoizar Transformaciones

```javascript
const { config } = useVehiclesConfig();

const activeVehicles = useMemo(
  () => config?.vehicleTypes.filter(v => v.active),
  [config]
);
```

### 4. Usar Helpers para Acceso Común

```javascript
// ✅ Más limpio
const { get } = useModulesConfig();
const types = get.vehicleTypes();

// ❌ Más verboso
const { vehicles } = useModulesConfig();
const types = vehicles?.vehicleTypes || [];
```

---

## 🔄 RECARGAR CONFIGURACIÓN

Si necesitas recargar la configuración (por ejemplo, después de que el admin la actualice):

```javascript
const { reload, isLoading } = useModulesConfig();

return (
  <button onClick={reload} disabled={isLoading}>
    {isLoading ? 'Recargando...' : 'Actualizar Configuración'}
  </button>
);
```

---

## 🚨 TROUBLESHOOTING

### La configuración no se carga

1. Verifica que el backend esté corriendo: `http://localhost:4050`
2. Verifica que el endpoint funcione: `curl http://localhost:4050/api/config/modules`
3. Revisa la consola del navegador por errores

### Los cambios en db.json no se reflejan

1. Reinicia el servidor backend
2. Limpia el localStorage del navegador (el store usa persistencia)
3. Usa el botón de reload en tu componente

### Error "Cannot read property 'vehicleTypes' of null"

Asegúrate de verificar que la configuración esté cargada:

```javascript
// ❌ Error
const types = config.vehicleTypes;

// ✅ Correcto
const types = config?.vehicleTypes || [];
```

---

## 📚 RECURSOS ADICIONALES

- **Ejemplos completos**: `frontend_futurismo/src/components/examples/ModulesConfigExample.jsx`
- **Documentación del store**: `frontend_futurismo/src/stores/modulesConfigStore.js`
- **Documentación del hook**: `frontend_futurismo/src/hooks/useModulesConfig.js`
- **Endpoints disponibles**: Ver `MIGRATION_PHASE_3_COMPLETE.md`

---

**Última actualización**: 2025-10-12

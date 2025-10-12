/**
 * Componente de ejemplo que demuestra el uso de useModulesConfig
 * Este archivo sirve como guía de implementación
 */

import React from 'react';
import {
  useModulesConfig,
  useVehiclesConfig,
  useMarketplaceConfig
} from '../../hooks/useModulesConfig';

/**
 * Ejemplo 1: Usar el hook general para acceder a todos los módulos
 */
export const GeneralModulesExample = () => {
  const {
    agencies,
    vehicles,
    marketplace,
    isLoaded,
    isLoading,
    error,
    get
  } = useModulesConfig();

  if (isLoading) {
    return <div className="p-4">Cargando configuraciones...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">Error: {error}</div>;
  }

  if (!isLoaded) {
    return <div className="p-4">Inicializando...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Ejemplo de useModulesConfig</h2>

      {/* Usando acceso directo */}
      <div className="border p-4 rounded">
        <h3 className="font-semibold mb-2">Tipos de Servicios (acceso directo)</h3>
        <ul className="list-disc list-inside">
          {agencies?.serviceTypes.map((service, index) => (
            <li key={index}>{service}</li>
          ))}
        </ul>
      </div>

      {/* Usando helpers */}
      <div className="border p-4 rounded">
        <h3 className="font-semibold mb-2">Tipos de Vehículos (usando helpers)</h3>
        <ul className="space-y-2">
          {get.vehicleTypes().map((type) => (
            <li key={type.value} className="flex justify-between">
              <span>{type.label}</span>
              <span className="text-sm text-gray-600">
                Capacidad: {type.minCapacity}-{type.maxCapacity}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Zonas de trabajo del marketplace */}
      <div className="border p-4 rounded">
        <h3 className="font-semibold mb-2">Zonas de Trabajo</h3>
        <div className="grid grid-cols-2 gap-2">
          {get.workZones().map((zone) => (
            <div key={zone.id} className="bg-gray-100 p-2 rounded">
              <div className="font-medium">{zone.name}</div>
              <div className="text-sm text-gray-600">{zone.description}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Ejemplo 2: Usar hooks específicos de módulos
 */
export const VehicleFormExample = () => {
  const { config, isLoading, error } = useVehiclesConfig();

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!config) return null;

  return (
    <div className="p-6 max-w-md">
      <h2 className="text-xl font-bold mb-4">Registro de Vehículo</h2>

      <form className="space-y-4">
        {/* Tipo de vehículo */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Tipo de Vehículo
          </label>
          <select className="w-full border rounded px-3 py-2">
            <option value="">Seleccionar...</option>
            {config.vehicleTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label} ({type.minCapacity}-{type.maxCapacity} pasajeros)
              </option>
            ))}
          </select>
        </div>

        {/* Estado */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Estado
          </label>
          <select className="w-full border rounded px-3 py-2">
            {config.vehicleStatus.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        {/* Tipo de combustible */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Combustible
          </label>
          <select className="w-full border rounded px-3 py-2">
            {config.fuelTypes.map((fuel) => (
              <option key={fuel.value} value={fuel.value}>
                {fuel.label}
              </option>
            ))}
          </select>
        </div>

        {/* Características */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Características
          </label>
          <div className="space-y-2">
            {config.features.map((feature) => (
              <label key={feature.value} className="flex items-center space-x-2">
                <input type="checkbox" value={feature.value} />
                <span className="text-sm">
                  {feature.icon} {feature.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Guardar Vehículo
        </button>
      </form>
    </div>
  );
};

/**
 * Ejemplo 3: Selector de guías del marketplace
 */
export const GuideFiltersExample = () => {
  const { config, isLoading } = useMarketplaceConfig();

  if (isLoading || !config) return <div>Cargando...</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Filtros de Búsqueda de Guías</h2>

      <div className="space-y-4">
        {/* Zonas de trabajo */}
        <div>
          <h3 className="font-semibold mb-2">Zonas de Trabajo</h3>
          <div className="flex flex-wrap gap-2">
            {config.workZones.map((zone) => (
              <button
                key={zone.id}
                className="px-3 py-1 border rounded hover:bg-gray-100"
              >
                {zone.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tipos de tours */}
        <div>
          <h3 className="font-semibold mb-2">Tipos de Tours</h3>
          <div className="flex flex-wrap gap-2">
            {config.tourTypes.map((type) => (
              <button
                key={type.id}
                className="px-3 py-1 border rounded hover:bg-gray-100"
              >
                {type.icon} {type.name}
              </button>
            ))}
          </div>
        </div>

        {/* Niveles de experiencia */}
        <div>
          <h3 className="font-semibold mb-2">Experiencia</h3>
          <div className="flex gap-2">
            {config.experienceLevels.map((level) => (
              <button
                key={level.value}
                className="px-3 py-1 border rounded hover:bg-gray-100"
              >
                {level.label}
                <span className="text-xs text-gray-600 ml-1">
                  ({level.minYears}+ años)
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Categorías de rating */}
        <div>
          <h3 className="font-semibold mb-2">Calificar por</h3>
          <div className="space-y-2">
            {config.ratingCategories.map((category) => (
              <div key={category.key} className="flex items-center space-x-2">
                <label className="text-sm">{category.label}</label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} className="text-yellow-400">
                      ⭐
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Ejemplo 4: Selector de calendario con configuración dinámica
 */
export const CalendarViewSelectorExample = () => {
  const { calendar, get, isLoading } = useModulesConfig();

  if (isLoading || !calendar) return <div>Cargando...</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Vistas de Calendario</h2>

      {/* Selector de vista */}
      <div className="flex space-x-2 mb-4">
        {get.calendarViews().map((view) => (
          <button
            key={view.value}
            className="px-4 py-2 border rounded hover:bg-blue-100"
          >
            {view.label}
          </button>
        ))}
      </div>

      {/* Tipos de eventos con colores */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Leyenda de Eventos</h3>
        <div className="space-y-2">
          {get.eventTypes().map((eventType) => (
            <div key={eventType.value} className="flex items-center space-x-2">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: eventType.color }}
              />
              <span className="text-sm">{eventType.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Horario laboral */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Horario Laboral</h3>
        <div className="text-sm text-gray-600">
          {get.workingHours().start} - {get.workingHours().end}
        </div>
      </div>
    </div>
  );
};

// Exportar todos los ejemplos
export default {
  GeneralModulesExample,
  VehicleFormExample,
  GuideFiltersExample,
  CalendarViewSelectorExample
};

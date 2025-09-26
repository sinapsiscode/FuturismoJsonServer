import React from 'react';
import { PlusIcon, XMarkIcon, MapPinIcon, ClockIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const StopsManager = ({ stops = [], onChange, errors }) => {
  // Generar ID único para nueva parada
  const generateStopId = () => `stop-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Agregar nueva parada
  const addStop = () => {
    const newStop = {
      id: generateStopId(),
      order: stops.length + 1,
      name: '',
      duration: 30,
      description: ''
    };
    onChange([...stops, newStop]);
  };

  // Eliminar parada
  const removeStop = (stopId) => {
    const updatedStops = stops
      .filter(stop => stop.id !== stopId)
      .map((stop, index) => ({ ...stop, order: index + 1 }));
    onChange(updatedStops);
  };

  // Actualizar parada
  const updateStop = (stopId, field, value) => {
    const updatedStops = stops.map(stop =>
      stop.id === stopId ? { ...stop, [field]: value } : stop
    );
    onChange(updatedStops);
  };

  // Mover parada arriba
  const moveUp = (index) => {
    if (index === 0) return;
    const newStops = [...stops];
    [newStops[index - 1], newStops[index]] = [newStops[index], newStops[index - 1]];
    // Actualizar orden
    const reorderedStops = newStops.map((stop, idx) => ({ ...stop, order: idx + 1 }));
    onChange(reorderedStops);
  };

  // Mover parada abajo
  const moveDown = (index) => {
    if (index === stops.length - 1) return;
    const newStops = [...stops];
    [newStops[index], newStops[index + 1]] = [newStops[index + 1], newStops[index]];
    // Actualizar orden
    const reorderedStops = newStops.map((stop, idx) => ({ ...stop, order: idx + 1 }));
    onChange(reorderedStops);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-gray-700">Itinerario de Paradas</h4>
        <span className="text-xs text-gray-500">
          {stops.length} parada{stops.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Lista de paradas */}
      <div className="space-y-3">
        {stops.map((stop, index) => (
          <div
            key={stop.id}
            className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-colors"
          >
            <div className="flex items-start gap-3">
              {/* Número de orden */}
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  {index + 1}
                </div>
              </div>

              {/* Contenido de la parada */}
              <div className="flex-1 space-y-3">
                {/* Primera fila: Nombre y duración */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <label className="sr-only">Nombre de la parada</label>
                    <div className="relative">
                      <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={stop.name}
                        onChange={(e) => updateStop(stop.id, 'name', e.target.value)}
                        placeholder="Nombre del lugar"
                        className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="sr-only">Duración</label>
                    <div className="relative">
                      <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="number"
                        value={stop.duration}
                        onChange={(e) => updateStop(stop.id, 'duration', parseInt(e.target.value) || 0)}
                        placeholder="Minutos"
                        min="0"
                        className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                        min
                      </span>
                    </div>
                  </div>
                </div>

                {/* Segunda fila: Descripción */}
                <div>
                  <label className="sr-only">Descripción</label>
                  <textarea
                    value={stop.description}
                    onChange={(e) => updateStop(stop.id, 'description', e.target.value)}
                    placeholder="Descripción de actividades en esta parada (opcional)"
                    rows="2"
                    className="px-3 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>

              {/* Controles de orden y eliminar */}
              <div className="flex-shrink-0 flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => moveUp(index)}
                  disabled={index === 0}
                  className={`p-1 rounded ${
                    index === 0
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
                  }`}
                  title="Mover arriba"
                >
                  <ChevronUpIcon className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => moveDown(index)}
                  disabled={index === stops.length - 1}
                  className={`p-1 rounded ${
                    index === stops.length - 1
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
                  }`}
                  title="Mover abajo"
                >
                  <ChevronDownIcon className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => removeStop(stop.id)}
                  className="p-1 rounded text-red-500 hover:text-red-700 hover:bg-red-50"
                  title="Eliminar parada"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Botón agregar parada */}
      <button
        type="button"
        onClick={addStop}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center gap-2"
      >
        <PlusIcon className="h-5 w-5" />
        <span>Agregar Parada</span>
      </button>

      {/* Mensaje de error si existe */}
      {errors && (
        <p className="text-sm text-red-600 mt-1">{errors}</p>
      )}

      {/* Información de ayuda */}
      {stops.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-4">
          Agrega las paradas del tour en orden. El destino principal ya está definido arriba.
        </p>
      )}
    </div>
  );
};

export default StopsManager;
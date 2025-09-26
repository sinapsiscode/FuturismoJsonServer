import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import TourProgress from '../../components/monitoring/TourProgress';
import toast from 'react-hot-toast';

const GuideTourView = () => {
  const { tourId } = useParams();
  const navigate = useNavigate();
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);

  // Simular verificación de autenticación de guía
  useEffect(() => {
    // En una implementación real, verificar que el usuario es guía y tiene acceso a este tour
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'guide') {
      toast.error('Acceso solo para guías');
      navigate('/');
    }
  }, [navigate]);

  const handleMarkStopCompleted = (stopId) => {
    // Lógica para marcar una parada como completada
    toast.success('Parada marcada como completada');
  };

  const handleReportIncident = () => {
    // Abrir modal de reporte de incidentes
    toast.info('Función de reporte de incidentes próximamente');
  };

  const handleCompleteTour = () => {
    setShowCompletionDialog(true);
  };

  const confirmCompleteTour = () => {
    // Lógica para completar el tour
    toast.success('Tour completado exitosamente');
    setShowCompletionDialog(false);
    navigate('/guide/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header del guía */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/guide/dashboard')}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-semibold">Vista del Guía</h1>
                <p className="text-sm text-gray-600">Tour ID: {tourId}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleReportIncident}
                className="btn btn-outline flex items-center gap-2 text-yellow-600 border-yellow-600 hover:bg-yellow-50"
              >
                <ExclamationTriangleIcon className="w-4 h-4" />
                Reportar Incidente
              </button>

              <button
                onClick={handleCompleteTour}
                className="btn btn-success flex items-center gap-2"
              >
                <CheckCircleIcon className="w-4 h-4" />
                Finalizar Tour
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Instrucciones para el guía */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-blue-900 mb-2">
            📋 Instrucciones para el Guía
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Haz clic en cada parada para expandir los detalles</li>
            <li>• Puedes agregar fotos en las paradas que estés visitando (opcional)</li>
            <li>• Las fotos ayudan a documentar la visita y mejorar el servicio</li>
            <li>• Reporta cualquier incidente o retraso usando el botón correspondiente</li>
            <li>• Al finalizar todas las paradas, usa "Finalizar Tour"</li>
          </ul>
        </div>

        {/* Componente de progreso del tour con vista de guía */}
        <TourProgress 
          tourId={tourId} 
          isGuideView={true}
        />

        {/* Acciones rápidas */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-2">📱 Contacto de Emergencia</h4>
            <p className="text-sm text-gray-600 mb-3">
              Agencia: +51 987 654 321
            </p>
            <p className="text-xs text-gray-500">
              Contacta a la agencia por chat o mensaje
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-2">⚠️ Reportar Problema</h4>
            <p className="text-sm text-gray-600 mb-3">
              Retrasos, cambios de plan, etc.
            </p>
            <button 
              onClick={handleReportIncident}
              className="btn btn-outline w-full"
            >
              Reportar Incidente
            </button>
          </div>

          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-2">✅ Finalizar Servicio</h4>
            <p className="text-sm text-gray-600 mb-3">
              Cuando termines todas las paradas
            </p>
            <button 
              onClick={handleCompleteTour}
              className="btn btn-success w-full"
            >
              Finalizar Tour
            </button>
          </div>
        </div>
      </div>

      {/* Modal de confirmación para finalizar tour */}
      {showCompletionDialog && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Finalizar Tour
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        ¿Estás seguro de que deseas finalizar este tour? 
                        Esta acción notificará a la agencia que el servicio ha sido completado.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={confirmCompleteTour}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Sí, Finalizar Tour
                </button>
                <button
                  onClick={() => setShowCompletionDialog(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuideTourView;
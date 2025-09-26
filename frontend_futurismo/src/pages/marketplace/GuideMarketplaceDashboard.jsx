import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ClockIcon, 
  CheckCircleIcon, 
  CurrencyDollarIcon,
  StarIcon,
  CalendarIcon,
  UserGroupIcon,
  ChartBarIcon,
  BellIcon,
  CogIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationCircleIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';
import useMarketplaceStore from '../../stores/marketplaceStore';
import useAuthStore from '../../stores/authStore';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const GuideMarketplaceDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { 
    serviceRequests, 
    freelanceGuides,
    reviews,
    fetchFreelanceGuides,
    fetchServiceRequests,
    fetchReviews,
    updateServiceRequest,
    addMessageToRequest
  } = useMarketplaceStore();
  
  const [guide, setGuide] = useState(null);
  const [guideRequests, setGuideRequests] = useState([]);
  const [guideReviews, setGuideReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [monthlyStats, setMonthlyStats] = useState({
    earnings: 0,
    services: 0,
    avgRating: 0,
    comparison: {
      earnings: 0,
      services: 0
    }
  });

  useEffect(() => {
    const initializeDashboard = async () => {
      console.log('[GuideMarketplaceDashboard] Initializing dashboard...');
      try {
        // Primero cargar todos los datos del marketplace
        await Promise.all([
          fetchFreelanceGuides(),
          fetchServiceRequests ? fetchServiceRequests() : Promise.resolve(),
          fetchReviews ? fetchReviews() : Promise.resolve()
        ]);
        console.log('[GuideMarketplaceDashboard] Marketplace data loaded, now loading dashboard data...');
        await loadDashboardData();
      } catch (error) {
        console.error('[GuideMarketplaceDashboard] Error initializing:', error);
        setIsLoading(false);
      }
    };
    
    initializeDashboard();
  }, [fetchFreelanceGuides]);

  const loadDashboardData = async () => {
    console.log('[GuideMarketplaceDashboard] Starting loadDashboardData');
    console.log('[GuideMarketplaceDashboard] User:', user);
    console.log('[GuideMarketplaceDashboard] Available guides:', freelanceGuides);
    
    setIsLoading(true);
    try {
      // Simular carga de datos
      console.log('[GuideMarketplaceDashboard] Simulating network delay...');
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('[GuideMarketplaceDashboard] Network delay completed');
      
      // Encontrar el guía actual (simulado con user.id)
      console.log('[GuideMarketplaceDashboard] Looking for guide with email:', user.email);
      const currentGuide = freelanceGuides.find(g => g.email === user.email);
      console.log('[GuideMarketplaceDashboard] Found guide:', currentGuide);
      
      if (currentGuide) {
        setGuide(currentGuide);
        
        console.log('[GuideMarketplaceDashboard] Setting guide data...');
        
        // Filtrar solicitudes del guía
        console.log('[GuideMarketplaceDashboard] Service requests:', serviceRequests);
        const requests = serviceRequests.filter(r => r.guideId === currentGuide.id);
        console.log('[GuideMarketplaceDashboard] Filtered requests:', requests);
        setGuideRequests(requests);
        
        // Filtrar reseñas del guía
        console.log('[GuideMarketplaceDashboard] Reviews:', reviews);
        const guideReviews = reviews.filter(r => r.guideId === currentGuide.id);
        console.log('[GuideMarketplaceDashboard] Filtered reviews:', guideReviews);
        setGuideReviews(guideReviews);
        
        // Calcular estadísticas mensuales
        console.log('[GuideMarketplaceDashboard] Calculating monthly stats...');
        calculateMonthlyStats(requests);
      } else {
        console.warn('[GuideMarketplaceDashboard] No guide found for user email:', user.email);
      }
    } catch (error) {
      console.error('[GuideMarketplaceDashboard] Error loading dashboard:', error);
    } finally {
      console.log('[GuideMarketplaceDashboard] Setting isLoading to false');
      setIsLoading(false);
    }
  };

  const calculateMonthlyStats = (requests) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    
    // Filtrar solicitudes del mes actual
    const currentMonthRequests = requests.filter(req => {
      const date = new Date(req.serviceDetails.date);
      return date.getMonth() === currentMonth && 
             date.getFullYear() === currentYear &&
             req.status === 'completed';
    });
    
    // Filtrar solicitudes del mes anterior
    const lastMonthRequests = requests.filter(req => {
      const date = new Date(req.serviceDetails.date);
      return date.getMonth() === lastMonth && 
             date.getFullYear() === lastMonthYear &&
             req.status === 'completed';
    });
    
    const currentEarnings = currentMonthRequests.reduce((sum, req) => sum + req.pricing.finalRate, 0);
    const lastEarnings = lastMonthRequests.reduce((sum, req) => sum + req.pricing.finalRate, 0);
    
    // Calcular promedio de calificaciones del mes
    const monthReviews = guideReviews.filter(review => {
      const date = new Date(review.metadata.createdAt);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });
    
    const avgRating = monthReviews.length > 0
      ? monthReviews.reduce((sum, r) => sum + r.ratings.overall, 0) / monthReviews.length
      : 0;
    
    setMonthlyStats({
      earnings: currentEarnings,
      services: currentMonthRequests.length,
      avgRating,
      comparison: {
        earnings: lastEarnings > 0 ? ((currentEarnings - lastEarnings) / lastEarnings) * 100 : 0,
        services: lastMonthRequests.length > 0 
          ? ((currentMonthRequests.length - lastMonthRequests.length) / lastMonthRequests.length) * 100 
          : 0
      }
    });
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      updateServiceRequest(requestId, {
        status: 'accepted',
        timeline: {
          ...serviceRequests.find(r => r.id === requestId).timeline,
          acceptedAt: new Date().toISOString()
        }
      });
      
      addMessageToRequest(requestId, {
        from: 'guide',
        message: 'He aceptado tu solicitud. Nos vemos en la fecha acordada.'
      });
      
      toast.success('Solicitud aceptada');
      loadDashboardData();
    } catch (error) {
      toast.error('Error al aceptar la solicitud');
    }
  };

  const handleRejectRequest = async (requestId) => {
    if (window.confirm('¿Estás seguro de rechazar esta solicitud?')) {
      try {
        updateServiceRequest(requestId, {
          status: 'rejected',
          timeline: {
            ...serviceRequests.find(r => r.id === requestId).timeline,
            respondedAt: new Date().toISOString()
          }
        });
        
        addMessageToRequest(requestId, {
          from: 'guide',
          message: 'Lamento no poder aceptar tu solicitud en esta ocasión.'
        });
        
        toast.success('Solicitud rechazada');
        loadDashboardData();
      } catch (error) {
        toast.error('Error al rechazar la solicitud');
      }
    }
  };

  const getFilteredRequests = () => {
    switch (activeTab) {
      case 'pending':
        return guideRequests.filter(r => r.status === 'pending');
      case 'upcoming':
        return guideRequests.filter(r => 
          r.status === 'accepted' && 
          new Date(r.serviceDetails.date) > new Date()
        );
      case 'completed':
        return guideRequests.filter(r => r.status === 'completed');
      default:
        return guideRequests;
    }
  };

  const RequestCard = ({ request }) => {
    const isPending = request.status === 'pending';
    const isToday = new Date(request.serviceDetails.date).toDateString() === new Date().toDateString();
    
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900">{request.requestCode}</h3>
            <p className="text-sm text-gray-500">
              Solicitado el {new Date(request.timeline.requestedAt).toLocaleDateString()}
            </p>
          </div>
          {isToday && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Hoy
            </span>
          )}
        </div>
        
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <CalendarIcon className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                {new Date(request.serviceDetails.date).toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <p className="text-sm text-gray-600">
                {request.serviceDetails.startTime} - {request.serviceDetails.endTime}
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5" />
            <p className="text-sm text-gray-700">{request.serviceDetails.location}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <UserGroupIcon className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                {request.serviceDetails.groupSize} personas
              </span>
            </div>
            <div className="flex items-center gap-1">
              <CurrencyDollarIcon className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-900">
                ${request.pricing.proposedRate}
              </span>
            </div>
          </div>
          
          {request.serviceDetails.specialRequirements && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
              <p className="text-xs text-yellow-800">
                <ExclamationCircleIcon className="inline h-3 w-3 mr-1" />
                {request.serviceDetails.specialRequirements}
              </p>
            </div>
          )}
        </div>
        
        <div className="mt-4 flex gap-2">
          {isPending ? (
            <>
              <button
                onClick={() => handleAcceptRequest(request.id)}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              >
                Aceptar
              </button>
              <button
                onClick={() => handleRejectRequest(request.id)}
                className="flex-1 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
              >
                Rechazar
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate(`/marketplace/requests/${request.id}`)}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              Ver detalles
            </button>
          )}
        </div>
      </div>
    );
  };

  if (isLoading || !guide) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const filteredRequests = getFilteredRequests();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src={guide.profile.avatar}
                alt={guide.fullName}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  Panel de Guía Freelance
                  {guide.marketplaceStatus.verified && (
                    <CheckBadgeIcon className="h-6 w-6 text-cyan-500" />
                  )}
                </h1>
                <p className="text-gray-600">Gestiona tus servicios y solicitudes</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <BellIcon className="h-6 w-6" />
              </button>
              <button 
                onClick={() => navigate('/marketplace/guide/settings')}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <CogIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Estadísticas del mes */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Ganancias del mes</p>
              <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900">S/. {monthlyStats.earnings}</p>
            <div className="flex items-center gap-1 mt-2">
              {monthlyStats.comparison.earnings > 0 ? (
                <>
                  <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">
                    +{monthlyStats.comparison.earnings.toFixed(1)}%
                  </span>
                </>
              ) : monthlyStats.comparison.earnings < 0 ? (
                <>
                  <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-600">
                    {monthlyStats.comparison.earnings.toFixed(1)}%
                  </span>
                </>
              ) : (
                <span className="text-sm text-gray-500">Sin cambios</span>
              )}
              <span className="text-sm text-gray-500">vs mes anterior</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Servicios del mes</p>
              <CalendarIcon className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{monthlyStats.services}</p>
            <div className="flex items-center gap-1 mt-2">
              {monthlyStats.comparison.services > 0 ? (
                <>
                  <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">
                    +{monthlyStats.comparison.services.toFixed(1)}%
                  </span>
                </>
              ) : monthlyStats.comparison.services < 0 ? (
                <>
                  <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-600">
                    {monthlyStats.comparison.services.toFixed(1)}%
                  </span>
                </>
              ) : (
                <span className="text-sm text-gray-500">Sin cambios</span>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Calificación promedio</p>
              <StarIcon className="h-5 w-5 text-gray-400" />
            </div>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-gray-900">
                {monthlyStats.avgRating > 0 ? monthlyStats.avgRating.toFixed(1) : '-'}
              </p>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.round(monthlyStats.avgRating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Este mes</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Tasa de respuesta</p>
              <ClockIcon className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {guide.marketplaceStats.responseTime} min
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {guide.marketplaceStats.acceptanceRate}% aceptación
            </p>
          </div>
        </div>

        {/* Alertas o notificaciones importantes */}
        {guide.marketplaceStatus.active && !guide.marketplaceStatus.verified && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <ExclamationCircleIcon className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  Completa la verificación de tu perfil
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  Los perfiles verificados reciben 3x más solicitudes. 
                  <button className="font-medium underline ml-1">
                    Verificar ahora →
                  </button>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs de solicitudes */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {[
                { key: 'pending', label: 'Pendientes', count: guideRequests.filter(r => r.status === 'pending').length },
                { key: 'upcoming', label: 'Próximas', count: guideRequests.filter(r => r.status === 'accepted' && new Date(r.serviceDetails.date) > new Date()).length },
                { key: 'completed', label: 'Completadas', count: guideRequests.filter(r => r.status === 'completed').length }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.key
                      ? 'border-cyan-500 text-cyan-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                      activeTab === tab.key
                        ? 'bg-cyan-100 text-cyan-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {filteredRequests.length === 0 ? (
              <div className="text-center py-12">
                <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  {activeTab === 'pending' && 'No tienes solicitudes pendientes'}
                  {activeTab === 'upcoming' && 'No tienes servicios próximos'}
                  {activeTab === 'completed' && 'No has completado servicios aún'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredRequests.map(request => (
                  <RequestCard key={request.id} request={request} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Reseñas recientes */}
        {guideReviews.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Reseñas recientes</h2>
            <div className="space-y-4">
              {guideReviews.slice(0, 3).map((review) => (
                <div key={review.id} className="border-b border-gray-200 last:border-0 pb-4 last:pb-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.ratings.overall
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-medium text-gray-900">{review.review.title}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{review.review.content}</p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.metadata.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate('/marketplace/guide/reviews')}
              className="mt-4 text-cyan-600 hover:text-cyan-700 text-sm font-medium"
            >
              Ver todas las reseñas →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuideMarketplaceDashboard;
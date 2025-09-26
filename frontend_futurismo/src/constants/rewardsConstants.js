// Sistema de puntos y premios

// Puntos por tipo de servicio
export const SERVICE_POINTS = {
  CITY_TOUR: 100,
  GASTRONOMIC_TOUR: 150,
  ISLANDS_TOUR: 200,
  CUSTOM_TOUR: 120,
  WALKING_TOUR: 80,
  BIKE_TOUR: 90,
  FOOD_TOUR: 130,
  ADVENTURE_TOUR: 180
};

// Categorías de premios
export const REWARD_CATEGORIES = {
  ELECTRONICS: 'electronics',
  TRAVEL: 'travel', 
  GIFT_CARDS: 'gift_cards',
  EXPERIENCES: 'experiences',
  MERCHANDISE: 'merchandise'
};

export const REWARD_CATEGORY_LABELS = {
  [REWARD_CATEGORIES.ELECTRONICS]: 'Electrónicos',
  [REWARD_CATEGORIES.TRAVEL]: 'Viajes',
  [REWARD_CATEGORIES.GIFT_CARDS]: 'Tarjetas Regalo',
  [REWARD_CATEGORIES.EXPERIENCES]: 'Experiencias',
  [REWARD_CATEGORIES.MERCHANDISE]: 'Merchandising'
};

// Estados de canje
export const REDEMPTION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

export const REDEMPTION_STATUS_LABELS = {
  [REDEMPTION_STATUS.PENDING]: 'Pendiente',
  [REDEMPTION_STATUS.APPROVED]: 'Aprobado',
  [REDEMPTION_STATUS.DELIVERED]: 'Entregado',
  [REDEMPTION_STATUS.CANCELLED]: 'Cancelado'
};

export const REDEMPTION_STATUS_COLORS = {
  [REDEMPTION_STATUS.PENDING]: 'yellow',
  [REDEMPTION_STATUS.APPROVED]: 'blue',
  [REDEMPTION_STATUS.DELIVERED]: 'green',
  [REDEMPTION_STATUS.CANCELLED]: 'red'
};

// Tipos de servicios con sus puntos
export const SERVICE_TYPE_POINTS = {
  'city_tour': SERVICE_POINTS.CITY_TOUR,
  'gastronomy_tour': SERVICE_POINTS.GASTRONOMIC_TOUR,
  'islands_tour': SERVICE_POINTS.ISLANDS_TOUR,
  'walking_tour': SERVICE_POINTS.WALKING_TOUR,
  'bike_tour': SERVICE_POINTS.BIKE_TOUR,
  'food_tour': SERVICE_POINTS.FOOD_TOUR,
  'adventure_tour': SERVICE_POINTS.ADVENTURE_TOUR,
  'custom': SERVICE_POINTS.CUSTOM_TOUR
};

// Límites del sistema
export const POINTS_LIMITS = {
  MIN_REDEMPTION: 500, // Puntos mínimos para canjear
  MAX_DAILY_POINTS: 2000, // Máximo de puntos por día
  POINT_EXPIRY_DAYS: 365 // Días para que expiren los puntos
};
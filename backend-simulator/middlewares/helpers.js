// Helper functions for business logic

// Generate unique IDs
const generateId = (prefix = 'item') => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return `${prefix}-${timestamp}-${random}`;
};

// Format currency
const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  });
  return formatter.format(amount);
};

// Format date
const formatDate = (date, format = 'DD/MM/YYYY') => {
  const dateObj = new Date(date);
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const year = dateObj.getFullYear();
  const hours = dateObj.getHours().toString().padStart(2, '0');
  const minutes = dateObj.getMinutes().toString().padStart(2, '0');

  switch (format) {
    case 'DD/MM/YYYY':
      return `${day}/${month}/${year}`;
    case 'MM/DD/YYYY':
      return `${month}/${day}/${year}`;
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`;
    case 'DD/MM/YYYY HH:mm':
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    default:
      return dateObj.toLocaleDateString();
  }
};

// Calculate distance between coordinates using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2, unit = 'km') => {
  const R = unit === 'miles' ? 3959 : 6371; // Earth's radius
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Calculate price with taxes and discounts
const calculatePrice = ({
  base_price,
  tax_rate = 0.18,
  discount_percent = 0,
  group_size = 1,
  group_discount_threshold = 5,
  group_discount_rate = 0.1
}) => {
  let subtotal = base_price * group_size;

  // Apply individual discount
  const individual_discount = subtotal * (discount_percent / 100);
  subtotal = subtotal - individual_discount;

  // Apply group discount
  let group_discount_applied = 0;
  if (group_size >= group_discount_threshold) {
    group_discount_applied = subtotal * group_discount_rate;
    subtotal = subtotal - group_discount_applied;
  }

  // Calculate tax
  const tax_amount = subtotal * tax_rate;
  const total = subtotal + tax_amount;

  return {
    base_price,
    group_size,
    subtotal_before_discounts: base_price * group_size,
    individual_discount,
    group_discount_applied,
    subtotal,
    tax_rate,
    tax_amount,
    total,
    price_per_person: total / group_size
  };
};

// Validate email format
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number
const validatePhone = (phone, country = 'PE') => {
  const patterns = {
    PE: /^\+51[0-9]{9}$|^[0-9]{9}$/,
    US: /^\+1[0-9]{10}$|^[0-9]{10}$/,
    ES: /^\+34[0-9]{9}$|^[0-9]{9}$/
  };

  const pattern = patterns[country] || patterns.PE;
  return pattern.test(phone);
};

// Paginate results
const paginate = (array, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  const paginatedItems = array.slice(offset, offset + limit);

  return {
    data: paginatedItems,
    pagination: {
      current_page: page,
      per_page: limit,
      total: array.length,
      total_pages: Math.ceil(array.length / limit),
      has_next: page < Math.ceil(array.length / limit),
      has_prev: page > 1
    }
  };
};

// Sort array by field
const sortBy = (array, field, order = 'asc') => {
  return array.sort((a, b) => {
    let aVal = a[field];
    let bVal = b[field];

    // Handle different data types
    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (order === 'desc') {
      return bVal > aVal ? 1 : -1;
    }
    return aVal > bVal ? 1 : -1;
  });
};

// Filter array by multiple criteria
const filterBy = (array, filters) => {
  return array.filter(item => {
    return Object.keys(filters).every(key => {
      const filterValue = filters[key];
      const itemValue = item[key];

      if (!filterValue) return true;

      if (Array.isArray(filterValue)) {
        return filterValue.includes(itemValue);
      }

      if (typeof filterValue === 'string' && typeof itemValue === 'string') {
        return itemValue.toLowerCase().includes(filterValue.toLowerCase());
      }

      return itemValue === filterValue;
    });
  });
};

// Generate random data for testing
const generateMockData = (type, count = 10) => {
  const generators = {
    user: () => ({
      id: generateId('user'),
      first_name: ['Juan', 'María', 'Carlos', 'Ana', 'Luis'][Math.floor(Math.random() * 5)],
      last_name: ['García', 'López', 'Martínez', 'Rodríguez', 'Fernández'][Math.floor(Math.random() * 5)],
      email: `user${Math.random().toString(36).substr(2, 5)}@example.com`,
      role: ['client', 'guide', 'agency'][Math.floor(Math.random() * 3)],
      status: 'active',
      created_at: new Date().toISOString()
    }),

    reservation: () => ({
      id: generateId('reservation'),
      tour_date: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      group_size: Math.floor(Math.random() * 10) + 1,
      status: ['pending', 'confirmed', 'completed'][Math.floor(Math.random() * 3)],
      total_amount: Math.floor(Math.random() * 500) + 100,
      created_at: new Date().toISOString()
    }),

    tour: () => ({
      id: generateId('tour'),
      name: ['Machu Picchu', 'City Tour Lima', 'Sacred Valley', 'Amazon Adventure'][Math.floor(Math.random() * 4)],
      price: Math.floor(Math.random() * 400) + 50,
      duration: ['4 hours', '8 hours', '1 day', '2 days'][Math.floor(Math.random() * 4)],
      status: 'active',
      created_at: new Date().toISOString()
    })
  };

  const generator = generators[type];
  if (!generator) return [];

  return Array.from({ length: count }, generator);
};

// Response helpers
const successResponse = (data, message = 'Success') => ({
  success: true,
  message,
  data
});

const errorResponse = (error, code = 500) => ({
  success: false,
  error: typeof error === 'string' ? error : error.message,
  code
});

// Middleware for adding helper functions to request object
const addHelpers = (req, res, next) => {
  req.helpers = {
    generateId,
    formatCurrency,
    formatDate,
    calculateDistance,
    calculatePrice,
    validateEmail,
    validatePhone,
    paginate,
    sortBy,
    filterBy,
    generateMockData,
    successResponse,
    errorResponse
  };
  next();
};

module.exports = {
  generateId,
  formatCurrency,
  formatDate,
  calculateDistance,
  calculatePrice,
  validateEmail,
  validatePhone,
  paginate,
  sortBy,
  filterBy,
  generateMockData,
  successResponse,
  errorResponse,
  addHelpers
};
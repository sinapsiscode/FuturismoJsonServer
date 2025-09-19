# Futurismo API - Complete Endpoints Documentation

## Base URL
```
http://localhost:4050/api
```

## Authentication
Most endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## System Information

### GET /api/system/info
Get complete system information and available endpoints.

### GET /api/system/docs
Get API documentation.

### GET /api/system/health
Health check endpoint.

## Authentication

### POST /api/auth/login
Login to the system.
```json
{
  "email": "admin@futurismo.com",
  "password": "demo123"
}
```

### POST /api/auth/logout
Logout from the system.

### GET /api/auth/me
Get current user information.

## Configuration

### GET /api/config/constants
Get all application constants (roles, statuses, categories, etc.).

### GET /api/config/work-zones
Get all work zones.

### GET /api/config/tour-types
Get all tour types with details.

### GET /api/config/group-types
Get all group types with size limits.

### GET /api/config/languages
Get all supported languages.

### GET /api/config/settings
Get application settings and configuration.

## Validators

### POST /api/validators/email
Validate email format and availability.
```json
{
  "email": "user@example.com"
}
```

### POST /api/validators/phone
Validate phone number format.
```json
{
  "phone": "+51987654321",
  "country": "PE"
}
```

### POST /api/validators/reservation
Validate reservation data.
```json
{
  "tour_date": "2025-09-20",
  "group_size": 4,
  "client_id": "client-123",
  "service_id": "service-123"
}
```

### POST /api/validators/user-registration
Validate user registration data.
```json
{
  "email": "user@example.com",
  "password": "password123",
  "first_name": "Juan",
  "last_name": "Pérez",
  "role": "client"
}
```

### POST /api/validators/service
Validate service data.
```json
{
  "name": "Tour Name",
  "price": 100,
  "category": "tours",
  "duration": "4 hours"
}
```

## Utilities

### POST /api/utils/format-currency
Format currency amounts.
```json
{
  "amount": 299.99,
  "currency": "USD",
  "locale": "en-US"
}
```

### POST /api/utils/format-date
Format dates.
```json
{
  "date": "2025-09-19",
  "format": "DD/MM/YYYY",
  "timezone": "America/Lima"
}
```

### GET /api/utils/generate-id/:prefix?
Generate unique IDs with optional prefix.

### POST /api/utils/calculate-distance
Calculate distance between coordinates.
```json
{
  "lat1": -12.0464,
  "lon1": -77.0428,
  "lat2": -13.5319,
  "lon2": -71.9675,
  "unit": "km"
}
```

### GET /api/utils/weather/:location?
Get weather simulation for a location.

### GET /api/utils/timezone/:timezone?
Get timezone information.

### POST /api/utils/calculate-price
Calculate price with taxes and discounts.
```json
{
  "base_price": 100,
  "tax_rate": 0.18,
  "discount_percent": 10,
  "group_size": 4
}
```

## Services

### GET /api/services
Get all services with filtering, sorting, and pagination.

**Query Parameters:**
- `category` - Filter by category
- `status` - Filter by status
- `location` - Filter by location
- `min_price` - Minimum price filter
- `max_price` - Maximum price filter
- `search` - Search in name and description
- `sort_by` - Sort field (default: name)
- `sort_order` - Sort order: asc|desc (default: asc)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

### GET /api/services/:id
Get service by ID.

### POST /api/services
Create new service.
```json
{
  "name": "Tour Machu Picchu",
  "description": "Amazing tour to Machu Picchu",
  "category": "tours",
  "price": 299.99,
  "currency": "USD",
  "duration": "1 day",
  "max_group_size": 15,
  "included": ["Transport", "Guide", "Tickets"],
  "excluded": ["Meals", "Tips"],
  "location": "Cusco"
}
```

### PUT /api/services/:id
Update service.

### DELETE /api/services/:id
Delete service (soft delete).

### GET /api/services/:id/pricing
Get service pricing with calculations.

**Query Parameters:**
- `group_size` - Group size for calculation
- `discount_percent` - Discount percentage

### GET /api/services/:id/availability
Check service availability for a date.

**Query Parameters:**
- `date` - Date to check (YYYY-MM-DD)
- `group_size` - Requested group size

## Dashboard

### GET /api/dashboard/stats
Get dashboard statistics based on user role.

**Query Parameters:**
- `role` - User role (admin, agency, guide)
- `userId` - User ID for role-specific stats

### GET /api/dashboard/monthly-data
Get monthly data for charts.

### GET /api/dashboard/chart-data
Get chart data.

**Query Parameters:**
- `type` - Chart type (line, bar)
- `timeRange` - Time range filter

### GET /api/dashboard/kpis
Get KPI data.

### GET /api/dashboard/summary
Get dashboard summary data.

## Clients

### GET /api/clients
Get all clients.

**Query Parameters:**
- `status` - Filter by status
- `search` - Search in name and email

### GET /api/clients/:id
Get client by ID.

## Tours

### GET /api/tours
Get all tours.

### GET /api/tours/:id
Get tour by ID.

## Providers

### GET /api/providers
Get all providers.

### GET /api/providers/:id
Get provider by ID.

## Notifications

### GET /api/notifications
Get notifications.

### POST /api/notifications
Create notification.

### PUT /api/notifications/:id/read
Mark notification as read.

## Emergency

### GET /api/emergency
Get emergency alerts.

### POST /api/emergency
Create emergency alert.

### PUT /api/emergency/:id
Update emergency alert.

## Profile

### GET /api/profile/:userId
Get user profile.

### PUT /api/profile/:userId
Update user profile.

## Reservations

### GET /api/reservations
Get reservations.

### GET /api/reservations/:id
Get reservation by ID.

### POST /api/reservations
Create reservation.

### PUT /api/reservations/:id
Update reservation.

## Statistics

### GET /api/statistics
Get general statistics.

### GET /api/statistics/revenue
Get revenue statistics.

### GET /api/statistics/bookings
Get booking statistics.

## JSON Server Default Routes

All collections in the database are also available through standard JSON Server CRUD operations:

### GET /api/{collection}
Get all items from a collection.

### GET /api/{collection}/:id
Get item by ID.

### POST /api/{collection}
Create new item.

### PUT /api/{collection}/:id
Update item.

### PATCH /api/{collection}/:id
Partially update item.

### DELETE /api/{collection}/:id
Delete item.

**Available Collections:**
- users
- agencies
- guides
- clients
- services
- tours
- reservations
- notifications
- emergency_alerts
- financial_transactions
- dashboard_stats
- work_zones
- tour_types
- group_types
- languages

## Response Format

### Success Response
```json
{
  "success": true,
  "data": {...},
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "code": 400
}
```

## Features

✅ **Complete Backend Logic**: All business logic is handled by the server
✅ **Validation**: Server-side validation for all data
✅ **Formatting**: Currency, date, and data formatting utilities
✅ **Calculations**: Price calculations, distance, and other business calculations
✅ **Filtering & Search**: Advanced filtering and search capabilities
✅ **Pagination**: Built-in pagination for all list endpoints
✅ **Sorting**: Sort by any field in ascending or descending order
✅ **Authentication**: JWT-based authentication
✅ **Constants**: All constants and configurations served by the API
✅ **Mock Data**: Automatic mock data generation when database is empty
✅ **Documentation**: Complete API documentation
✅ **Health Monitoring**: System health and information endpoints

## Usage Example

```javascript
// Get all services with filters
fetch('/api/services?category=tours&location=Lima&min_price=50&page=1&limit=5')
  .then(response => response.json())
  .then(data => {
    console.log(data.data.services); // Service list
    console.log(data.data.pagination); // Pagination info
  });

// Validate email
fetch('/api/validators/email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test@example.com' })
})
  .then(response => response.json())
  .then(data => console.log(data.data.isValid));

// Calculate service pricing
fetch('/api/services/service-1/pricing?group_size=4&discount_percent=10')
  .then(response => response.json())
  .then(data => console.log(data.data.pricing));
```

This API provides a complete backend solution where the frontend only needs to make HTTP requests to get all the data, validations, calculations, and business logic from the server.
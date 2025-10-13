# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Futurismo** is a comprehensive tourism management platform that connects agencies, guides, drivers, vehicles, and clients. It's a full-stack application with a React frontend and a JSON Server backend simulator for development.

The system manages 53+ database tables across 14 business modules including:
- User management (agencies, guides, drivers, clients)
- Tours and reservations
- Real-time service monitoring
- Marketplace for freelance guides
- Emergency protocols
- Financial transactions and rewards
- Multi-role authentication and permissions

## Architecture

**Frontend**: React 18.3.1 + Vite 5.4.0
- State: Zustand stores (22+ stores in `frontend_futurismo/src/stores/`)
- Routing: React Router v6
- Styling: Tailwind CSS 3.4.0
- Forms: React Hook Form + Yup validation
- Charts: Recharts
- i18n: i18next (Spanish/English)

**Backend Simulator**: JSON Server with Express custom routes
- Located in `backend-simulator/`
- Runs on port 4050 (configurable)
- 20+ custom route modules in `backend-simulator/routes/`
- JWT authentication
- Centralized data in `db.json` (53 sections)

**Frontend-Backend Communication**:
- Frontend uses Vite proxy for `/api` routes in development
- All API calls use relative URLs (e.g., `/api/auth/login`)
- Production should point to actual backend URL

## Development Commands

### Backend (JSON Server)
```bash
cd backend-simulator
npm run dev      # Start with nodemon (auto-reload)
npm start        # Start without auto-reload
```

### Frontend (React + Vite)
```bash
cd frontend_futurismo
npm run dev      # Development server (port 5173)
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Running Both Concurrently
From project root, you can start both servers. Backend must run on port 4050 for frontend proxy to work correctly.

## Authentication System

**Login Credentials** (all use password `demo123`):
1. Admin: `admin@futurismo.com`
2. Agency: `contacto@tourslima.com`
3. Guide (Carlos): `carlos@guia.com`
4. Guide Freelance (Ana): `ana@freelance.com`

**Auth Flow**:
1. User logs in via `POST /api/auth/login`
2. Backend returns JWT token and user object
3. Token stored in `authStore` (Zustand)
4. Token included in subsequent API calls via Authorization header
5. `ProtectedRoute` component guards routes by role

**Key Files**:
- `frontend_futurismo/src/stores/authStore.js` - Auth state management
- `frontend_futurismo/src/services/authService.js` - API calls
- `backend-simulator/routes/auth.js` - Auth endpoints

## Important Patterns

### Zustand Store Pattern
All stores follow a consistent pattern:
```javascript
const useStore = create((set) => ({
  // State
  items: [],
  loading: false,
  error: null,

  // Actions
  fetchItems: async () => {
    set({ loading: true });
    try {
      const response = await api.get('/endpoint');
      set({ items: response.data, loading: false });
    } catch (error) {
      set({ error, loading: false });
    }
  }
}));
```

### Backend Route Pattern
Custom routes in `backend-simulator/routes/` export a function that receives the json-server router:
```javascript
module.exports = (router) => {
  const express = require('express');
  const apiRouter = express.Router();

  apiRouter.get('/endpoint', (req, res) => {
    const db = router.db; // Access to db.json
    // Logic here
    res.json({ success: true, data: result });
  });

  return apiRouter;
};
```

### API Response Format
All custom endpoints return consistent format:
```javascript
{ success: true, data: {...}, message: 'Optional message' }
{ success: false, error: 'Error message', details: {...} }
```

## Migration Status

**CRITICAL**: This project has undergone a major migration from hardcoded frontend data to centralized backend data.

**What Changed**:
- All mock data files (`mockData.js`, `mockReservationsData.js`, etc.) have been migrated to `backend-simulator/db.json`
- All constants (`sharedConstants.js`, `authConstants.js`, etc.) moved to server endpoints
- Validators and formatters moved to server-side endpoints
- Frontend now fetches everything from API

**Key Migration Files**:
- `MIGRATION_GUIDE.md` - Detailed migration instructions
- `API_ENDPOINTS.md` - Complete endpoint documentation
- `backend-simulator/routes/data.js` - Universal data access endpoint

**Using Migrated Data**:
```javascript
// OLD (don't use):
import { mockData } from '../data/mockData';

// NEW (use this):
import { useEffect, useState } from 'react';

function Component() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/api/data/section/tours_extended')
      .then(res => res.json())
      .then(result => setData(result.data));
  }, []);
}
```

## Database Structure (db.json)

The `backend-simulator/db.json` contains 53 sections organized by domain:

**Core Entities**: `agencies`, `clients`, `guides`, `drivers`, `users`, `tours`, `reservations`

**Extended Data**: `tours_extended`, `guides_extended`, `clients_extended` (with related data pre-joined)

**Emergency System**: `emergency_protocols`, `emergency_materials`, `emergency_incidents`, `emergency_categories`

**Real-time Monitoring**: `monitoring_tours`, `monitoring_guides`, `monitoring_config`

**Financial**: `financial_transactions`, `payment_methods`, `rewards_catalog`

**Communication**: `conversations`, `messages`, `notifications`

**Constants**: 15+ constant sections for various modules

Access any section via: `GET /api/data/section/:sectionName`

## Key Business Modules

### 1. **Marketplace System**
Connects agencies with freelance guides. Key endpoints in `backend-simulator/routes/marketplace.js`:
- `GET /api/marketplace/requests` - Service requests
- `POST /api/marketplace/requests` - Create request
- `GET /api/marketplace/guides/available` - Available guides
- `POST /api/marketplace/responses` - Guide responses

### 2. **Emergency Protocols**
Critical safety system. Routes in `backend-simulator/routes/emergency.js`:
- `GET /api/emergency/protocols` - All protocols
- `GET /api/emergency/protocols?category=medico` - Filter by type
- `GET /api/emergency/materials` - Emergency materials
- `POST /api/emergency/incidents` - Report incident

### 3. **Real-time Monitoring**
Active service tracking. Frontend: `frontend_futurismo/src/pages/Monitoring.jsx`
- Uses WebSocket for live updates (Socket.io)
- Tracks guide location, service status, tourist counts
- Dashboard with map integration (React Leaflet)

### 4. **Calendar/Agenda System**
Complex scheduling for guides and agencies:
- Guide availability management
- Tour assignments
- Working hours configuration
- Multiple calendar views (day/week/month)
- Component: `frontend_futurismo/src/components/calendar/FantasticalLayout.jsx`

## Role-Based Access Control

Three main roles with distinct capabilities:

**Admin** (`admin`):
- Full system access
- User management (`/users`)
- Resource assignments (`/assignments`)
- Emergency protocol management
- System statistics and reports

**Agency** (`agency`):
- Create/manage reservations (`/reservations`)
- Access marketplace (`/marketplace`)
- View calendar and reports
- Manage points/rewards

**Guide** (`guide`):
- Personal agenda (`/agenda`)
- Respond to marketplace requests
- Track finances (freelance only)
- Access emergency protocols
- Service monitoring

Guide Type: `freelance` vs `employed`
- Freelance guides access marketplace and financial dashboard
- Employed guides are assigned by agencies

## Common Development Tasks

### Adding a New API Endpoint
1. Create or modify route file in `backend-simulator/routes/`
2. Import and register in `backend-simulator/server.js`
3. Add data to appropriate section in `db.json` if needed
4. Update API_ENDPOINTS.md documentation

### Adding a New Frontend Page
1. Create page in `frontend_futurismo/src/pages/`
2. Add route in `frontend_futurismo/src/App.jsx`
3. Wrap with `<ProtectedRoute allowedRoles={['role1', 'role2']}>` if needed
4. Create/update corresponding store in `src/stores/` if needed

### Working with Forms
Forms use React Hook Form + Yup validation:
```javascript
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
  field: yup.string().required('Required')
});

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: yupResolver(schema)
});
```

### Internationalization
Use i18next hooks:
```javascript
import { useTranslation } from 'react-i18next';

function Component() {
  const { t, i18n } = useTranslation();

  return <h1>{t('dashboard.title')}</h1>;
  // Change language: i18n.changeLanguage('en');
}
```

Translation files: `frontend_futurismo/src/locales/es.json` and `en.json`

## Port Configuration

**Backend**: Port 4050 (set in `backend-simulator/server.js`)
- Change via `PORT` environment variable
- Update frontend proxy in `vite.config.js` if changed

**Frontend**: Port 5173 (set in `vite.config.js`)
- Vite uses 5173 by default
- Fallback to next available if 5173 is taken

**IMPORTANT**: If backend port changes, update:
1. `frontend_futurismo/vite.config.js` proxy target
2. Any hardcoded URLs in services
3. Documentation

## Testing

**Authentication Testing**:
- Use `test-auth.js` for backend auth testing
- Use `test-frontend-auth.js` for frontend integration testing

**No automated test suite currently exists**. When adding tests:
- Backend: Use Jest or Mocha
- Frontend: Use Vitest (included with Vite) + React Testing Library

## Common Issues & Solutions

**Issue**: CORS errors in development
- **Solution**: Ensure backend CORS is set to allow all origins (`origin: '*'`)
- **Location**: `backend-simulator/server.js` line 40-45

**Issue**: "Token expired" or authentication loops
- **Solution**: Clear localStorage and login again
- **Command**: Run `localStorage.clear()` in browser console

**Issue**: Frontend can't reach backend
- **Solution**: Verify backend is running on port 4050
- **Check**: `http://localhost:4050/api` should return JSON response

**Issue**: Vite proxy not working
- **Solution**: Restart Vite dev server, ensure URL starts with `/api`

**Issue**: Store data not persisting
- **Solution**: Zustand stores are in-memory only. Use localStorage or API calls for persistence.

## File Organization

```
frontend_futurismo/
├── src/
│   ├── components/       # React components by feature
│   │   ├── admin/       # Admin-specific
│   │   ├── agenda/      # Calendar/scheduling
│   │   ├── calendar/    # Complex calendar system
│   │   ├── chat/        # Messaging
│   │   ├── common/      # Shared components
│   │   ├── dashboard/   # Dashboard widgets
│   │   └── ...
│   ├── pages/           # Page-level components
│   ├── stores/          # Zustand state stores
│   ├── services/        # API service layer
│   ├── hooks/           # Custom React hooks
│   ├── contexts/        # React contexts
│   ├── constants/       # Frontend constants (being phased out)
│   ├── locales/         # i18n translations
│   └── App.jsx          # Main app component

backend-simulator/
├── routes/              # Express route handlers
├── middlewares/         # Custom middleware
├── db.json             # All data (53 sections)
└── server.js           # Main server file
```

## WebSocket Integration

Real-time features use Socket.io:
- **Service**: `frontend_futurismo/src/services/websocket.js`
- **Connection**: Established in `App.jsx` when authenticated
- **Events**: `service:update`, `notification:new`, `booking:update`, etc.

Backend WebSocket server setup is simulated. For production, implement actual Socket.io server.

## Notes for Code Modifications

1. **Always use relative API URLs** (`/api/...`) in frontend services
2. **Never hardcode data** in frontend - fetch from API
3. **Follow existing Zustand store patterns** for consistency
4. **Use TypeScript prop-types** or PropTypes for component props
5. **Keep route definitions in sync** between frontend (App.jsx) and documentation
6. **Update API_ENDPOINTS.md** when adding/modifying endpoints
7. **Respect role-based access** - verify user permissions before showing UI
8. **Handle loading and error states** in all async operations
9. **Use existing UI components** from `components/common/` before creating new ones
10. **Keep db.json organized** by logical sections - don't dump everything in one array

## Useful References

- **Architecture**: `ARQUITECTURA_FUTURISMO.md` - Complete system architecture
- **API Docs**: `API_ENDPOINTS.md` - All available endpoints
- **Migration**: `MIGRATION_GUIDE.md` - How to migrate from hardcoded data
- **Login Info**: `LOGIN_INFO.md` - Test credentials and auth troubleshooting

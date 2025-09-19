# 🔄 Guía de Migración: Del Hardcodeo al Servidor

Esta guía te muestra cómo migrar desde hardcodeo frontend hacia configuraciones del servidor.

## 📋 **Antes vs Después**

### **❌ ANTES (Hardcodeo)**
```javascript
// constants.js - ELIMINAR
export const USER_ROLES = {
  ADMIN: 'admin',
  AGENCY: 'agency',
  GUIDE: 'guide'
};

// component.jsx
import { USER_ROLES } from '../utils/constants.js';

function MyComponent() {
  const isAdmin = user.role === USER_ROLES.ADMIN;
  return <div>{isAdmin ? 'Admin Panel' : 'User Panel'}</div>;
}
```

### **✅ DESPUÉS (Del Servidor)**
```javascript
// component.jsx
import { useConstants, useServerConfig } from '../hooks/useServerConfig.js';

function MyComponent() {
  const { USER_ROLES } = useConstants();
  const { currentUser, isAdmin } = useServerConfig();

  return <div>{isAdmin() ? 'Admin Panel' : 'User Panel'}</div>;
}
```

## 🛠 **Pasos de Migración**

### **1. Reemplazar Imports de Constants**

**Antes:**
```javascript
import { USER_ROLES, SERVICE_STATUS } from '../utils/constants.js';
import { formatCurrency } from '../utils/formatters.js';
import { validateEmail } from '../utils/validators.js';
```

**Después:**
```javascript
import { useConstants, useServerValidation, useServerFormatting } from '../hooks/useServerConfig.js';

function MyComponent() {
  const { USER_ROLES, SERVICE_STATUS } = useConstants();
  const { validateEmail } = useServerValidation();
  const { formatCurrency } = useServerFormatting();

  // Usar igual que antes
}
```

### **2. Migrar Validaciones**

**Antes:**
```javascript
// validators.js - ELIMINAR
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// component.jsx
const isValid = validateEmail(email);
```

**Después:**
```javascript
// component.jsx
import { useServerValidation } from '../hooks/useServerConfig.js';

function MyComponent() {
  const { validateEmail } = useServerValidation();

  const handleValidate = async () => {
    const result = await validateEmail(email);
    console.log('Valid:', result.isValid);
    console.log('Available:', result.isAvailable);
  };
}
```

### **3. Migrar Formateo de Datos**

**Antes:**
```javascript
// formatters.js - ELIMINAR
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

// component.jsx
const formatted = formatCurrency(100);
```

**Después:**
```javascript
// component.jsx
import { useServerFormatting } from '../hooks/useServerConfig.js';

function MyComponent() {
  const { formatCurrency } = useServerFormatting();
  const [formatted, setFormatted] = useState('');

  useEffect(() => {
    const format = async () => {
      const result = await formatCurrency(100, 'USD', 'en-US');
      setFormatted(result.formatted);
    };
    format();
  }, []);
}
```

### **4. Migrar Cálculos**

**Antes:**
```javascript
// utils/calculations.js - ELIMINAR
export const calculatePrice = (basePrice, groupSize, discountPercent = 0) => {
  let total = basePrice * groupSize;
  if (discountPercent > 0) {
    total = total * (1 - discountPercent / 100);
  }
  return total * 1.18; // IGV
};
```

**Después:**
```javascript
import { useServerFormatting } from '../hooks/useServerConfig.js';

function PriceCalculator() {
  const { calculatePrice } = useServerFormatting();
  const [pricing, setPricing] = useState(null);

  const calculate = async () => {
    const result = await calculatePrice({
      base_price: 100,
      group_size: 4,
      discount_percent: 10
    });
    setPricing(result);
  };

  return (
    <div>
      <p>Subtotal: {pricing?.subtotal}</p>
      <p>Tax: {pricing?.tax_amount}</p>
      <p>Total: {pricing?.total}</p>
    </div>
  );
}
```

### **5. Inicialización Completa de la App**

**Antes:**
```javascript
// App.jsx
import { USER_ROLES } from './constants.js';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Lógica hardcodeada
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
  }, []);
}
```

**Después:**
```javascript
// App.jsx
import { useAppInitialization } from './hooks/useServerConfig.js';

function App() {
  const { initData, loading, error } = useAppInitialization('admin', 'user-123');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Welcome {initData.user.name}</h1>
      <Navigation items={initData.navigation} />
      <Dashboard data={initData.dashboard} />
    </div>
  );
}
```

## 🎯 **Patrones de Migración Específicos**

### **Servicios/Stores**

**Antes:**
```javascript
// servicesStore.js
const mockServices = [
  { id: 1, name: 'Tour Lima', price: 50 },
  { id: 2, name: 'Tour Cusco', price: 100 }
];
```

**Después:**
```javascript
// servicesStore.js
import { useEffect } from 'react';

const useServicesStore = create((set) => ({
  services: [],
  loading: false,

  fetchServices: async (filters = {}) => {
    set({ loading: true });
    try {
      const response = await fetch('/api/services?' + new URLSearchParams(filters));
      const result = await response.json();
      set({ services: result.data.services, loading: false });
    } catch (error) {
      set({ loading: false });
    }
  }
}));
```

### **Formularios con Validación**

**Antes:**
```javascript
const handleSubmit = async (formData) => {
  // Validación local
  if (!validateEmail(formData.email)) {
    setError('Email inválido');
    return;
  }

  await submitForm(formData);
};
```

**Después:**
```javascript
import { useServerValidation } from '../hooks/useServerConfig.js';

const { validateEmail, validateUserRegistration } = useServerValidation();

const handleSubmit = async (formData) => {
  // Validación del servidor
  const validation = await validateUserRegistration(formData);

  if (!validation.isValid) {
    setErrors(validation.errors);
    return;
  }

  await submitForm(formData);
};
```

## 🚀 **Inicialización en main.jsx**

```javascript
// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import useAppConfigStore from './stores/appConfigStore.js';

// Inicializar configuración del servidor al cargar la app
const initializeApp = async () => {
  try {
    const userFromStorage = JSON.parse(localStorage.getItem('auth_user') || '{}');

    if (userFromStorage.id && userFromStorage.role) {
      const store = useAppConfigStore.getState();
      await store.initializeApp(userFromStorage.role, userFromStorage.id);
      console.log('✅ App initialized with server config');
    }
  } catch (error) {
    console.error('❌ Error initializing app:', error);
  }
};

// Inicializar antes de renderizar
initializeApp().then(() => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
```

## 📝 **Checklist de Migración**

### ✅ **Archivos a ELIMINAR:**
- [ ] `src/utils/constants.js` - Reemplazado por `/api/config/constants`
- [ ] `src/utils/validators.js` - Reemplazado por `/api/validators/*`
- [ ] `src/utils/formatters.js` - Reemplazado por `/api/utils/format-*`
- [ ] `src/data/mockData.js` - Reemplazado por endpoints reales
- [ ] Cualquier archivo `mock*.js` en services

### ✅ **Archivos a MODIFICAR:**
- [ ] Todos los componentes que importen constants
- [ ] Stores que usen datos hardcodeados
- [ ] Servicios que hagan mock de datos
- [ ] Formularios con validación local
- [ ] Cualquier cálculo de precios local

### ✅ **Nuevos Imports a USAR:**
```javascript
// Reemplaza imports de constants
import { useConstants } from '../hooks/useServerConfig.js';

// Reemplaza validaciones locales
import { useServerValidation } from '../hooks/useServerConfig.js';

// Reemplaza formateo local
import { useServerFormatting } from '../hooks/useServerConfig.js';

// Para inicialización completa
import { useAppInitialization } from '../hooks/useServerConfig.js';
```

## 🎉 **Resultado Final**

Después de la migración:

✅ **Todo viene del servidor**
✅ **Cero hardcodeo en frontend**
✅ **Validaciones centralizadas**
✅ **Cálculos del servidor**
✅ **Configuraciones dinámicas**
✅ **Inicialización por rol**
✅ **Cache inteligente**

**El frontend será solo una interfaz que consume la API real!** 🚀
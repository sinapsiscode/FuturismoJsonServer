import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { Navigate } from 'react-router-dom';
import ProvidersManager from '../components/providers/ProvidersManager';

const Providers = () => {
  const { user } = useAuthStore();

  // Solo permitir acceso a administradores
  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  useEffect(() => {
    document.title = 'Gestión de Proveedores - Futurismo';
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <ProvidersManager />
    </div>
  );
};

export default Providers;
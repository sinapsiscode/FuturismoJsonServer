import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import useAuthStore from '../../stores/authStore';

const ProtectedRoute = ({ children, allowedRoles = [], requireGuideType = null }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  // Rutas que NO requieren autenticación (bypass completo)
  const publicRoutes = ['/demo-test', '/demo-admin', '/demo-agency', '/test-rewards'];
  if (publicRoutes.includes(location.pathname)) {
    return children;
  }

  if (!isAuthenticated) {
    // Guardar la ruta intentada para redirigir después del login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si se especifican roles permitidos, verificar
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // Redirigir al dashboard si no tiene permisos
    return <Navigate to="/dashboard" replace />;
  }

  // Si se requiere un tipo específico de guía, verificar
  if (requireGuideType && user?.role === 'guide' && user?.guideType !== requireGuideType) {
    // Redirigir al dashboard si no es el tipo de guía correcto
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
  requireGuideType: PropTypes.string
};

export default ProtectedRoute;
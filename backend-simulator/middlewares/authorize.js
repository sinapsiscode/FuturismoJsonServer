/**
 * AUTHORIZATION MIDDLEWARE
 *
 * Proporciona autorización basada en roles para proteger endpoints del backend.
 *
 * Uso:
 *   router.get('/endpoint', authorize(['admin', 'agency']), handler);
 *
 * IMPORTANTE: Este middleware debe usarse DESPUÉS del middleware de autenticación (auth.js)
 * ya que depende de req.user que es establecido por authMiddleware.
 */

/**
 * Middleware de autorización basado en roles
 *
 * @param {string[]} allowedRoles - Array de roles permitidos (ej: ['admin', 'agency', 'guide'])
 * @param {object} options - Opciones adicionales de autorización
 * @param {string} options.requireGuideType - Tipo de guía requerido ('freelance' o 'employed')
 * @param {boolean} options.allowSelfAccess - Permitir acceso a recursos propios (verifica req.params.id === req.user.userId)
 * @returns {Function} Express middleware function
 *
 * @example
 * // Solo admin puede acceder
 * router.get('/users', authorize(['admin']), handler);
 *
 * @example
 * // Admin o agency pueden acceder
 * router.post('/reservations', authorize(['admin', 'agency']), handler);
 *
 * @example
 * // Solo guías freelance pueden acceder
 * router.get('/marketplace', authorize(['guide'], { requireGuideType: 'freelance' }), handler);
 *
 * @example
 * // Usuario puede acceder a su propio perfil o admin puede acceder a cualquiera
 * router.get('/users/:id', authorize(['admin', 'guide', 'agency'], { allowSelfAccess: true }), handler);
 */
const authorize = (allowedRoles = [], options = {}) => {
  return (req, res, next) => {
    // Verificar que el usuario está autenticado (debe venir de authMiddleware)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'No autenticado. Token requerido.',
        code: 'UNAUTHORIZED'
      });
    }

    const { role, guideType, userId } = req.user;

    // 1. Verificar rol básico
    if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
      // Verificar si allowSelfAccess está habilitado
      if (options.allowSelfAccess && req.params.id && req.params.id === userId) {
        // El usuario está accediendo a su propio recurso
        return next();
      }

      return res.status(403).json({
        success: false,
        error: 'No tienes permisos para acceder a este recurso',
        code: 'FORBIDDEN',
        details: {
          required: allowedRoles,
          current: role
        }
      });
    }

    // 2. Verificar tipo de guía (si aplica)
    if (options.requireGuideType) {
      if (role !== 'guide') {
        return res.status(403).json({
          success: false,
          error: 'Este recurso solo está disponible para guías',
          code: 'FORBIDDEN_ROLE',
          details: {
            required: 'guide',
            current: role
          }
        });
      }

      if (guideType !== options.requireGuideType) {
        return res.status(403).json({
          success: false,
          error: `Este recurso solo está disponible para guías ${options.requireGuideType === 'freelance' ? 'freelance' : 'de planta'}`,
          code: 'FORBIDDEN_GUIDE_TYPE',
          details: {
            required: options.requireGuideType,
            current: guideType
          }
        });
      }
    }

    // 3. Verificar acceso a recursos propios en body (para updates/creates)
    if (options.allowSelfAccess && req.body && req.body.userId && req.body.userId !== userId && role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'No puedes modificar recursos de otros usuarios',
        code: 'FORBIDDEN_SELF_ACCESS'
      });
    }

    // Autorización exitosa
    next();
  };
};

/**
 * Helper: Solo administradores
 */
const adminOnly = () => authorize(['admin']);

/**
 * Helper: Administradores o agencias
 */
const adminOrAgency = () => authorize(['admin', 'agency']);

/**
 * Helper: Todos los usuarios autenticados
 */
const authenticated = () => authorize(['admin', 'agency', 'guide']);

/**
 * Helper: Solo guías (cualquier tipo)
 */
const guidesOnly = () => authorize(['guide']);

/**
 * Helper: Solo guías freelance
 */
const freelanceGuidesOnly = () => authorize(['guide'], { requireGuideType: 'freelance' });

/**
 * Helper: Solo guías de planta
 */
const employedGuidesOnly = () => authorize(['guide'], { requireGuideType: 'employed' });

/**
 * Helper: Acceso propio o admin
 * Permite que un usuario acceda a sus propios recursos o que admin acceda a cualquiera
 */
const selfOrAdmin = (allowedRoles = ['admin', 'agency', 'guide']) => {
  return authorize(allowedRoles, { allowSelfAccess: true });
};

module.exports = {
  authorize,
  adminOnly,
  adminOrAgency,
  authenticated,
  guidesOnly,
  freelanceGuidesOnly,
  employedGuidesOnly,
  selfOrAdmin
};

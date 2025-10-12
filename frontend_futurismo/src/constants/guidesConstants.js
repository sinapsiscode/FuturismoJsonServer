/**
 * COMPATIBILITY LAYER - Guides
 *
 * Este archivo re-exporta constantes desde el backend.
 * Mantiene compatibilidad con código existente.
 *
 * ⚠️ TEMPORAL: Este archivo es parte de la capa de compatibilidad.
 * RECOMENDADO: Migrar a useGuidesConfig() para uso en componentes React.
 */

import useModulesConfigStore from '../stores/modulesConfigStore';

// Cargar configuración si no está cargada
const store = useModulesConfigStore.getState();
if (!store.modules && !store.isLoading) {
  store.loadModules();
}

// Helper para obtener configuración
const getGuidesConfig = () => {
  const state = useModulesConfigStore.getState();
  return state.modules?.guides || {};
};


export const FORM_TABS = [
  { id: 'personal', label: 'Información Personal' },
  { id: 'languages', label: 'Idiomas' },
  { id: 'museums', label: 'Museos' }
];

export const LEVEL_OPTIONS = [
  { value: 'basic', label: 'Básico' },
  { value: 'intermediate', label: 'Intermedio' },
  { value: 'advanced', label: 'Avanzado' },
  { value: 'native', label: 'Nativo' }
];

export const GUIDE_TYPES = {
  PLANT: 'plant',
  FREELANCE: 'freelance'
};

export const GUIDE_STATUS = (() => {
  const config = getGuidesConfig();
  return config.guideStatus || [];
})();


// Export default para compatibilidad
export default {
  FORM_TABS,
  LEVEL_OPTIONS,
  GUIDE_TYPES,
  GUIDE_STATUS
};

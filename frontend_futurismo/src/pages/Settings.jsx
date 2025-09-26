import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  CogIcon,
  BuildingOfficeIcon,
  MapIcon,
  UsersIcon,
  BellIcon,
  EyeIcon,
  DocumentChartBarIcon,
  ShieldCheckIcon,
  LinkIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

import GeneralSettings from '../components/settings/GeneralSettings';
import ToursSettings from '../components/settings/ToursSettings';
import NotificationsSettings from '../components/settings/NotificationsSettings';
import { useSettingsStore } from '../stores/settingsStore';

const Settings = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('general');
  const { hasUnsavedChanges, exportSettings, importSettings } = useSettingsStore();

  const tabs = [
    {
      id: 'general',
      name: t('settings.general.title') || 'General',
      icon: BuildingOfficeIcon,
      description: t('settings.general.description') || 'Información de la empresa y configuraciones básicas'
    },
    {
      id: 'tours',
      name: t('settings.tours.title') || 'Tours',
      icon: MapIcon,
      description: t('settings.tours.description') || 'Configuración de tours y servicios'
    },
    {
      id: 'agencies',
      name: 'Agencias',
      icon: UsersIcon,
      description: 'Configuración específica para agencias'
    },
    {
      id: 'guides',
      name: 'Guías',
      icon: UsersIcon,
      description: 'Configuración para guías turísticos'
    },
    {
      id: 'notifications',
      name: 'Notificaciones',
      icon: BellIcon,
      description: 'Configuración de notificaciones por canal'
    },
    {
      id: 'monitoring',
      name: 'Monitoreo',
      icon: EyeIcon,
      description: 'Configuración de seguimiento y ubicación'
    },
    {
      id: 'reports',
      name: 'Reportes',
      icon: DocumentChartBarIcon,
      description: 'Configuración de generación de reportes'
    },
    {
      id: 'security',
      name: 'Seguridad',
      icon: ShieldCheckIcon,
      description: 'Configuración de seguridad y acceso'
    },
    {
      id: 'integrations',
      name: 'Integraciones',
      icon: LinkIcon,
      description: 'Configuración de servicios externos'
    }
  ];

  const handleFileImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = importSettings(e.target.result);
        if (result.success) {
          alert('Configuraciones importadas exitosamente');
        } else {
          alert(`Error al importar: ${result.error}`);
        }
      };
      reader.readAsText(file);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralSettings />;
      case 'tours':
        return <ToursSettings />;
      case 'notifications':
        return <NotificationsSettings />;
      case 'agencies':
        return <ComingSoonTab name="Agencias" />;
      case 'guides':
        return <ComingSoonTab name="Guías" />;
      case 'monitoring':
        return <ComingSoonTab name="Monitoreo" />;
      case 'reports':
        return <ComingSoonTab name="Reportes" />;
      case 'security':
        return <ComingSoonTab name="Seguridad" />;
      case 'integrations':
        return <ComingSoonTab name="Integraciones" />;
      default:
        return <GeneralSettings />;
    }
  };

  const ComingSoonTab = ({ name }) => (
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-sm border">
      <div className="text-center">
        <CogIcon className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
        <h3 className="mt-3 sm:mt-4 text-base sm:text-lg font-medium text-gray-900">
          Configuración de {name}
        </h3>
        <p className="mt-2 text-xs sm:text-sm text-gray-500 max-w-sm mx-auto">
          Esta sección estará disponible próximamente. Estamos trabajando en implementar 
          todas las configuraciones específicas para {name.toLowerCase()}.
        </p>
        <div className="mt-4 sm:mt-6">
          <button
            onClick={() => setActiveTab('general')}
            className="inline-flex items-center px-3 sm:px-4 py-2 border border-transparent text-xs sm:text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Volver a Configuración General
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
          <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3">
            <CogIcon className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-blue-600 flex-shrink-0" />
            <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 break-words text-center sm:text-left">
              Configuración del Sistema
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <button
              onClick={exportSettings}
              className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Exportar
            </button>
            
            <label className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer">
              Importar
              <input
                type="file"
                accept=".json"
                onChange={handleFileImport}
                className="sr-only"
              />
            </label>
          </div>
        </div>

        {/* Warning banner */}
        {hasUnsavedChanges && (
          <div className="mb-4 sm:mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <InformationCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs sm:text-sm text-yellow-800">
                Tienes cambios sin guardar en las configuraciones. 
                No olvides guardar antes de cambiar de pestaña o salir.
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Sidebar with tabs */}
          <div className="lg:w-80">
            <nav className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="p-3 sm:p-4 bg-gray-50 border-b">
                <h3 className="text-xs sm:text-sm font-medium text-gray-900">
                  Categorías de Configuración
                </h3>
              </div>
              
              <div className="space-y-1 p-2">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  const IconComponent = tab.icon;
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full text-left px-2 sm:px-3 py-2 sm:py-3 rounded-lg transition-colors duration-200 ${
                        isActive
                          ? 'bg-blue-50 border-l-4 border-blue-500 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start gap-2 sm:gap-3">
                        <IconComponent className={`h-4 w-4 sm:h-5 sm:w-5 mt-0.5 flex-shrink-0 ${
                          isActive ? 'text-blue-600' : 'text-gray-400'
                        }`} />
                        <div className="min-w-0 flex-1">
                          <div className={`text-xs sm:text-sm font-medium truncate ${
                            isActive ? 'text-blue-900' : 'text-gray-900'
                          }`}>
                            {tab.name}
                          </div>
                          <div className={`text-xs mt-1 line-clamp-2 ${
                            isActive ? 'text-blue-700' : 'text-gray-500'
                          }`}>
                            {tab.description}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </nav>
          </div>

          {/* Main content */}
          <div className="flex-1">
            {renderTabContent()}
          </div>
        </div>

        {/* Information panel */}
        <div className="mt-6 sm:mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
            <InformationCircleIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 flex-shrink-0 self-center sm:self-start sm:mt-0.5" />
            <div className="text-xs sm:text-sm text-blue-800">
              <h4 className="font-medium mb-2">Acerca de las Configuraciones</h4>
              <div className="space-y-2">
                <p>
                  Estas configuraciones controlan el comportamiento global del sistema Futurismo Tours. 
                  Los cambios se aplicarán inmediatamente y afectarán a todos los usuarios.
                </p>
                <ul className="list-disc list-inside space-y-1 mt-3 text-xs sm:text-sm">
                  <li>Las configuraciones se guardan automáticamente cuando haces clic en "Guardar"</li>
                  <li>Puedes exportar/importar configuraciones para respaldos o migración</li>
                  <li>Algunos cambios pueden requerir reiniciar sesiones activas</li>
                  <li>Se recomienda probar cambios en un entorno de desarrollo primero</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
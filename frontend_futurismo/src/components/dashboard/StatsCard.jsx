import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';

const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  color = 'primary',
  subtitle = null,
  loading = false 
}) => {
  const { t, i18n } = useTranslation();
  const [translationText, setTranslationText] = useState('vs mes anterior');
  
  useEffect(() => {
    const checkTranslation = () => {
      const translated = t('dashboard.stats.vsPreviousMonth');
      console.log('Traducción obtenida:', translated);
      console.log('Recursos disponibles:', i18n.hasResourceBundle('es', 'translation'));
      console.log('Idioma actual:', i18n.language);
      
      if (translated !== 'dashboard.stats.vsPreviousMonth') {
        setTranslationText(translated);
      }
    };
    
    checkTranslation();
    
    // Escuchar cambios en las traducciones
    i18n.on('loaded', checkTranslation);
    i18n.on('languageChanged', checkTranslation);
    
    return () => {
      i18n.off('loaded', checkTranslation);
      i18n.off('languageChanged', checkTranslation);
    };
  }, [t, i18n]);
  
  const colorClasses = {
    primary: 'bg-gradient-to-br from-secondary-100 to-secondary-200 text-secondary-700',
    secondary: 'bg-gradient-to-br from-accent-100 to-accent-200 text-accent-700',
    success: 'bg-gradient-to-br from-success-100 to-success-200 text-success-700',
    warning: 'bg-gradient-to-br from-warning-100 to-warning-200 text-warning-700',
    danger: 'bg-gradient-to-br from-error-100 to-error-200 text-error-700',
    neutral: 'bg-gradient-to-br from-neutral-100 to-neutral-200 text-neutral-700'
  };

  const isPositiveTrend = trend && trend.startsWith('+');

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0 space-y-3">
            <div className="skeleton-modern h-4 w-24"></div>
            <div className="skeleton-modern h-8 w-32"></div>
            <div className="skeleton-modern h-4 w-40"></div>
          </div>
          <div className="skeleton-modern h-16 w-16 rounded-2xl flex-shrink-0"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="card hover-lift group">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-neutral-600 mb-1 truncate tracking-wide">{title}</p>
          <p className="text-3xl font-bold text-neutral-900 mb-2 truncate gradient-text">{value}</p>
          
          {subtitle && (
            <p className="text-sm text-neutral-500 mb-1 truncate">{subtitle}</p>
          )}
          
          {trend && (
            <div className="flex items-center gap-2 min-w-0">
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                isPositiveTrend ? 'bg-success-100 text-success-700' : 'bg-error-100 text-error-700'
              }`}>
                {isPositiveTrend ? (
                  <ArrowTrendingUpIcon className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <ArrowTrendingDownIcon className="w-4 h-4 flex-shrink-0" />
                )}
                <span className="text-sm font-semibold flex-shrink-0">
                  {trend}
                </span>
              </div>
              <span className="text-sm text-neutral-500 truncate">
                {translationText}
              </span>
            </div>
          )}
        </div>
        
        <div className={`p-4 rounded-2xl flex-shrink-0 shadow-soft group-hover:shadow-glow transition-all duration-1000 ${colorClasses[color]}`}>
          <Icon className="w-8 h-8 transition-all duration-1000 group-hover:scale-110" />
        </div>
      </div>
    </div>
  );
};

StatsCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.elementType.isRequired,
  trend: PropTypes.string,
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger']),
  subtitle: PropTypes.string,
  loading: PropTypes.bool
};

export default StatsCard;
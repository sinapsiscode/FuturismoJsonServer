import React from 'react';
import { useTranslation } from 'react-i18next';
import { GlobeAltIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import useLanguageToggle from '../../hooks/useLanguageToggle';

const LanguageToggle = () => {
  const { t } = useTranslation();
  const {
    isOpen,
    languages,
    currentLanguage,
    dropdownRef,
    changeLanguage,
    toggleDropdown
  } = useLanguageToggle();

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-gray-700 border border-gray-200"
        title={t('common.changeLanguage')}
        aria-label={t('common.changeLanguage')}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <GlobeAltIcon className="w-4 h-4" />
        <span className="text-sm font-medium">{currentLanguage.flag}</span>
        <ChevronDownIcon 
          className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
          role="menu"
          aria-orientation="vertical"
        >
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => changeLanguage(language.code)}
              className={`w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                language.code === currentLanguage.code 
                  ? 'bg-primary-50 text-primary-600' 
                  : 'text-gray-700'
              }`}
              role="menuitem"
              aria-current={language.code === currentLanguage.code ? 'true' : 'false'}
            >
              <span className="text-lg" aria-hidden="true">{language.flag}</span>
              <span className="font-medium text-sm">{language.name}</span>
              {language.code === currentLanguage.code && (
                <span 
                  className="ml-auto w-2 h-2 bg-primary-600 rounded-full" 
                  aria-label={t('common.currentLanguage')}
                ></span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageToggle;
import React, { useState } from 'react';
import { CogIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import ServiceTypesSettings from './ServiceTypesSettings';
import PaymentMethodsSettings from './PaymentMethodsSettings';

const ServicesConfigSettings = () => {
  const [activeSection, setActiveSection] = useState('types'); // 'types' or 'payments'

  return (
    <div className="space-y-6">
      {/* Section selector */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setActiveSection('types')}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
              activeSection === 'types'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <CogIcon className="w-5 h-5" />
            Tipos de Servicio
          </button>
          <button
            onClick={() => setActiveSection('payments')}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
              activeSection === 'payments'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <CreditCardIcon className="w-5 h-5" />
            Métodos de Pago
          </button>
        </div>
      </div>

      {/* Content */}
      {activeSection === 'types' && <ServiceTypesSettings />}
      {activeSection === 'payments' && <PaymentMethodsSettings />}
    </div>
  );
};

export default ServicesConfigSettings;

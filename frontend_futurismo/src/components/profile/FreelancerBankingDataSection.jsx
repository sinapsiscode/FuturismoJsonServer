import { useState } from 'react';
import { 
  PencilIcon, 
  CheckIcon, 
  XMarkIcon, 
  ChevronDownIcon, 
  ChevronUpIcon,
  CreditCardIcon,
  BanknotesIcon,
  IdentificationIcon
} from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

const FreelancerBankingDataSection = () => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const [formData, setFormData] = useState({
    bankName: 'Banco de Crédito del Perú',
    accountType: 'Ahorros',
    accountNumber: '194-12345678-0-12',
    accountHolder: 'Juan Pérez García',
    identificationNumber: '12345678',
    currency: 'PEN',
    interbankCode: '002-194-001234567812'
  });

  const handleSave = () => {
    console.log('Guardando datos bancarios:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Restaurar datos originales
    setFormData({
      bankName: 'Banco de Crédito del Perú',
      accountType: 'Ahorros',
      accountNumber: '194-12345678-0-12',
      accountHolder: 'Juan Pérez García',
      identificationNumber: '12345678',
      currency: 'PEN',
      interbankCode: '002-194-001234567812'
    });
    setIsEditing(false);
  };

  const bankOptions = [
    'Banco de Crédito del Perú',
    'BBVA',
    'Interbank',
    'Scotiabank',
    'Banco de la Nación',
    'Banco Continental',
    'Banco Financiero',
    'Banco Falabella',
    'Banco Ripley'
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <CreditCardIcon className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Datos Bancarios</h3>
          </div>
          <div className="flex items-center space-x-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PencilIcon className="h-4 w-4 mr-1" />
                Editar
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <CheckIcon className="h-4 w-4 mr-1" />
                  Guardar
                </button>
                <button
                  onClick={handleCancel}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <XMarkIcon className="h-4 w-4 mr-1" />
                  Cancelar
                </button>
              </div>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              {isCollapsed ? (
                <ChevronDownIcon className="h-5 w-5" />
              ) : (
                <ChevronUpIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {!isCollapsed && (
        <div className="p-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <BanknotesIcon className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Información importante:</p>
                <p>Los datos bancarios son necesarios para recibir los pagos de tus servicios como guía. Asegúrate de que la información sea correcta y esté actualizada.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Banco *
              </label>
              {isEditing ? (
                <select
                  value={formData.bankName}
                  onChange={(e) => setFormData(prev => ({ ...prev, bankName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {bankOptions.map(bank => (
                    <option key={bank} value={bank}>{bank}</option>
                  ))}
                </select>
              ) : (
                <p className="text-gray-900 py-2">{formData.bankName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Cuenta *
              </label>
              {isEditing ? (
                <select
                  value={formData.accountType}
                  onChange={(e) => setFormData(prev => ({ ...prev, accountType: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Ahorros">Cuenta de Ahorros</option>
                  <option value="Corriente">Cuenta Corriente</option>
                </select>
              ) : (
                <p className="text-gray-900 py-2">Cuenta de {formData.accountType}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de Cuenta *
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, accountNumber: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="194-12345678-0-12"
                />
              ) : (
                <p className="text-gray-900 py-2 font-mono">{formData.accountNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código Interbancario (CCI)
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.interbankCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, interbankCode: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="002-194-001234567812"
                />
              ) : (
                <p className="text-gray-900 py-2 font-mono">{formData.interbankCode}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titular de la Cuenta *
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.accountHolder}
                  onChange={(e) => setFormData(prev => ({ ...prev, accountHolder: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nombre completo del titular"
                />
              ) : (
                <p className="text-gray-900 py-2">{formData.accountHolder}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <IdentificationIcon className="inline w-4 h-4 mr-1" />
                DNI del Titular *
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.identificationNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, identificationNumber: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="12345678"
                />
              ) : (
                <p className="text-gray-900 py-2">{formData.identificationNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Moneda
              </label>
              {isEditing ? (
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="PEN">Soles (PEN)</option>
                  <option value="USD">Soles (PEN)</option>
                </select>
              ) : (
                <p className="text-gray-900 py-2">
                  {formData.currency === 'PEN' ? 'Soles (PEN)' : 'Soles (PEN)'}
                </p>
              )}
            </div>
          </div>

          {!isEditing && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <CheckIcon className="h-5 w-5 text-green-600 mr-2" />
                <p className="text-sm text-green-800">
                  Datos bancarios verificados y actualizados
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FreelancerBankingDataSection;
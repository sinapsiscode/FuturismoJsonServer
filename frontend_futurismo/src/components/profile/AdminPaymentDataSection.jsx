import { useState, useEffect } from 'react';
import { CreditCardIcon, ChevronDownIcon, ChevronUpIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../stores/authStore';
import axios from 'axios';

const AdminPaymentDataSection = () => {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState({
    bankName: '',
    accountType: '',
    accountNumber: '',
    accountCCI: '',
    accountHolder: '',
    ruc: ''
  });

  // Cargar datos del usuario (solo lectura)
  useEffect(() => {
    if (user) {
      setPaymentData({
        bankName: 'Banco de Crédito del Perú (BCP)',
        accountType: 'Cuenta Corriente en Soles',
        accountNumber: user.company_data?.account_number || user.accountNumber || '',
        accountCCI: user.company_data?.account_cci || user.accountCCI || '',
        accountHolder: user.company_data?.business_name || user.businessName || '',
        ruc: user.company_data?.ruc || user.ruc || ''
      });
    }
  }, [user]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3 flex-1">
          <div className="p-2 bg-purple-100 rounded-lg">
            <CreditCardIcon className="w-5 h-5 text-purple-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">Medios de Pago</h3>
            <p className="text-sm text-gray-500">Información bancaria para pagos</p>
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title={isCollapsed ? 'Expandir sección' : 'Contraer sección'}
          >
            {isCollapsed ? (
              <ChevronDownIcon className="w-5 h-5" />
            ) : (
              <ChevronUpIcon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <span className="ml-3 text-gray-600">Cargando datos...</span>
          </div>
        ) : (
        <div>
          {/* Mensaje informativo */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <InformationCircleIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">¿Quién ve esta información?</p>
                <p>Esta información bancaria es visible para los guías freelance registrados en el sistema. 
                   Les permite conocer los datos para depositar sus honorarios. Los datos son de solo lectura y 
                   no se pueden modificar desde este panel.</p>
              </div>
            </div>
          </div>

          {/* Datos bancarios */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Banco
              </label>
              <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                {paymentData.bankName}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Cuenta
              </label>
              <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                {paymentData.accountType}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de Cuenta
              </label>
              <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg font-mono">
                {paymentData.accountNumber}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CCI (Código Interbancario)
              </label>
              <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg font-mono">
                {paymentData.accountCCI}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titular de la Cuenta
              </label>
              <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                {paymentData.accountHolder}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                RUC del Titular
              </label>
              <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                {paymentData.ruc}
              </p>
            </div>
          </div>

          {/* Nota adicional */}
          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Nota:</span> Esta información es únicamente para recibir pagos de los guías freelance. 
              No se solicita ni almacena ningún documento de pago en el sistema.
            </p>
          </div>
        </div>
        )
      )}
    </div>
  );
};

export default AdminPaymentDataSection;
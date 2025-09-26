import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { 
  CreditCardIcon, 
  PencilIcon, 
  CheckIcon, 
  XMarkIcon, 
  ChevronDownIcon, 
  ChevronUpIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';
import usePaymentData from '../../hooks/usePaymentData';
import PaymentMethodCard from './PaymentMethodCard';
import AddPaymentMethodForm from './AddPaymentMethodForm';

const PaymentDataSection = () => {
  const { t } = useTranslation();
  const {
    isEditing,
    setIsEditing,
    isCollapsed,
    setIsCollapsed,
    showCardNumbers,
    paymentMethods,
    newPaymentMethod,
    setNewPaymentMethod,
    maskCardNumber,
    toggleShowCardNumber,
    handleAddPaymentMethod,
    handleDeletePaymentMethod,
    handleSetAsMain,
    handleUpdateMethod,
    handleSave,
    handleCancel,
    getPaymentTypeLabel
  } = usePaymentData();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3 flex-1">
          <div className="p-2 bg-purple-100 rounded-lg">
            <CreditCardIcon className="w-5 h-5 text-purple-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {t('profile.payment.title')}
            </h3>
            <p className="text-sm text-gray-500">
              {t('profile.payment.subtitle')}
            </p>
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title={isCollapsed ? t('common.expand') : t('common.collapse')}
          >
            {isCollapsed ? (
              <ChevronDownIcon className="w-5 h-5" />
            ) : (
              <ChevronUpIcon className="w-5 h-5" />
            )}
          </button>
        </div>
        
        {!isCollapsed && (
          !isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <PencilIcon className="w-4 h-4" />
              {t('common.edit')}
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <CheckIcon className="w-4 h-4" />
                {t('common.save')}
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-4 h-4" />
                {t('common.cancel')}
              </button>
            </div>
          )
        )}
      </div>

      {!isCollapsed && (
        <div>
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <PaymentMethodCard
                key={method.id}
                method={method}
                isEditing={isEditing}
                showCardNumber={showCardNumbers[method.id] || false}
                onToggleShowCard={toggleShowCardNumber}
                onSetAsMain={handleSetAsMain}
                onDelete={handleDeletePaymentMethod}
                onUpdate={handleUpdateMethod}
                maskCardNumber={maskCardNumber}
                getPaymentTypeLabel={getPaymentTypeLabel}
              />
            ))}

            {isEditing && (
              <AddPaymentMethodForm
                newPaymentMethod={newPaymentMethod}
                setNewPaymentMethod={setNewPaymentMethod}
                onAddPaymentMethod={handleAddPaymentMethod}
                getPaymentTypeLabel={getPaymentTypeLabel}
              />
            )}
          </div>

          <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <p className="text-sm text-purple-800 flex items-start gap-2">
              <LockClosedIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>
                <span className="font-medium">{t('profile.payment.securityTitle')}:</span>{' '}
                {t('profile.payment.securityMessage')}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentDataSection;
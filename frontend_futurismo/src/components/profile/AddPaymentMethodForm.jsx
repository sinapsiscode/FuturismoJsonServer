import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { PlusIcon } from '@heroicons/react/24/outline';
import { PAYMENT_METHOD_TYPES } from '../../constants/profileConstants';

const AddPaymentMethodForm = ({ 
  newPaymentMethod, 
  setNewPaymentMethod, 
  onAddPaymentMethod,
  getPaymentTypeLabel 
}) => {
  const { t } = useTranslation();

  const isFormValid = newPaymentMethod.type && 
                     newPaymentMethod.bank && 
                     newPaymentMethod.holderName;

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
      <h4 className="text-sm font-medium text-gray-700 mb-3">
        {t('profile.payment.addNewMethod')}
      </h4>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <select
              value={newPaymentMethod.type}
              onChange={(e) => setNewPaymentMethod({ 
                ...newPaymentMethod, 
                type: e.target.value 
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">{t('profile.payment.methodType')} *</option>
              {Object.values(PAYMENT_METHOD_TYPES).map(type => (
                <option key={type} value={type}>
                  {getPaymentTypeLabel(type)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <input
              type="text"
              placeholder={`${t('profile.payment.bankEntity')} *`}
              value={newPaymentMethod.bank}
              onChange={(e) => setNewPaymentMethod({ 
                ...newPaymentMethod, 
                bank: e.target.value 
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <input
              type="text"
              placeholder={`${t('profile.payment.holder')} *`}
              value={newPaymentMethod.holderName}
              onChange={(e) => setNewPaymentMethod({ 
                ...newPaymentMethod, 
                holderName: e.target.value 
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={onAddPaymentMethod}
            disabled={!isFormValid}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PlusIcon className="w-4 h-4" />
            {t('profile.payment.addMethod')}
          </button>
        </div>
      </div>
    </div>
  );
};

AddPaymentMethodForm.propTypes = {
  newPaymentMethod: PropTypes.object.isRequired,
  setNewPaymentMethod: PropTypes.func.isRequired,
  onAddPaymentMethod: PropTypes.func.isRequired,
  getPaymentTypeLabel: PropTypes.func.isRequired
};

export default AddPaymentMethodForm;
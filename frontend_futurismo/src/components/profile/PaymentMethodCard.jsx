import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { TrashIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { 
  PAYMENT_METHOD_TYPES, 
  ACCOUNT_TYPES, 
  CURRENCIES, 
  CARD_TYPES 
} from '../../constants/profileConstants';

const PaymentMethodCard = ({ 
  method, 
  isEditing, 
  showCardNumber,
  onToggleShowCard,
  onSetAsMain,
  onDelete,
  onUpdate,
  maskCardNumber,
  getPaymentTypeLabel
}) => {
  const { t } = useTranslation();

  const getAccountTypeLabel = (type) => {
    const labels = {
      [ACCOUNT_TYPES.CHECKING]: t('profile.payment.accountTypes.checking'),
      [ACCOUNT_TYPES.SAVINGS]: t('profile.payment.accountTypes.savings'),
      [ACCOUNT_TYPES.CTS]: t('profile.payment.accountTypes.cts')
    };
    return labels[type] || type;
  };

  const getCardTypeLabel = (type) => {
    const labels = {
      [CARD_TYPES.VISA]: 'Visa',
      [CARD_TYPES.MASTERCARD]: 'Mastercard',
      [CARD_TYPES.AMEX]: 'American Express'
    };
    return labels[type] || type;
  };

  const getCurrencyLabel = (currency) => {
    const labels = {
      [CURRENCIES.PEN]: t('profile.payment.currencies.pen'),
      [CURRENCIES.USD]: t('profile.payment.currencies.usd'),
      [CURRENCIES.EUR]: t('profile.payment.currencies.eur')
    };
    return labels[currency] || currency;
  };

  return (
    <div className={`border rounded-lg p-4 ${method.isMain ? 'border-blue-300 bg-blue-50' : 'border-gray-200'}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium px-2 py-1 rounded ${
            method.type === PAYMENT_METHOD_TYPES.BANK_ACCOUNT 
              ? 'bg-green-100 text-green-800' 
              : 'bg-blue-100 text-blue-800'
          }`}>
            {getPaymentTypeLabel(method.type)}
          </span>
          {method.isMain && (
            <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
              {t('profile.payment.main')}
            </span>
          )}
        </div>
        {isEditing && (
          <div className="flex gap-2">
            {!method.isMain && (
              <button
                onClick={() => onSetAsMain(method.id)}
                className="text-xs text-blue-600 hover:bg-blue-50 px-2 py-1 rounded"
              >
                {t('profile.payment.setAsMain')}
              </button>
            )}
            <button
              onClick={() => onDelete(method.id)}
              className="text-red-600 hover:bg-red-50 p-1 rounded"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('profile.payment.bankEntity')}
          </label>
          {isEditing ? (
            <input
              type="text"
              value={method.bank}
              onChange={(e) => onUpdate(method.id, 'bank', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          ) : (
            <p className="text-gray-900 font-medium">{method.bank}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {method.type === PAYMENT_METHOD_TYPES.BANK_ACCOUNT 
              ? t('profile.payment.accountNumber') 
              : t('profile.payment.cardNumber')}
          </label>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <input
                type="text"
                value={method.accountNumber || method.cardNumber}
                onChange={(e) => {
                  const field = method.type === PAYMENT_METHOD_TYPES.BANK_ACCOUNT 
                    ? 'accountNumber' 
                    : 'cardNumber';
                  onUpdate(method.id, field, e.target.value);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <>
                <p className="text-gray-900 flex-1">
                  {showCardNumber ? 
                    (method.accountNumber || method.cardNumber) : 
                    maskCardNumber(method.accountNumber || method.cardNumber)
                  }
                </p>
                <button
                  onClick={() => onToggleShowCard(method.id)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {showCardNumber ? 
                    <EyeSlashIcon className="w-4 h-4" /> : 
                    <EyeIcon className="w-4 h-4" />
                  }
                </button>
              </>
            )}
          </div>
        </div>

        {method.type === PAYMENT_METHOD_TYPES.BANK_ACCOUNT && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('profile.payment.accountType')}
              </label>
              {isEditing ? (
                <select
                  value={method.accountType}
                  onChange={(e) => onUpdate(method.id, 'accountType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">{t('profile.payment.select')}</option>
                  {Object.values(ACCOUNT_TYPES).map(type => (
                    <option key={type} value={type}>
                      {getAccountTypeLabel(type)}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-gray-900">{getAccountTypeLabel(method.accountType)}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('profile.payment.currency')}
              </label>
              {isEditing ? (
                <select
                  value={method.currency}
                  onChange={(e) => onUpdate(method.id, 'currency', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {Object.values(CURRENCIES).map(currency => (
                    <option key={currency} value={currency}>
                      {getCurrencyLabel(currency)}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-gray-900">{method.currency}</p>
              )}
            </div>
          </>
        )}

        {method.type === PAYMENT_METHOD_TYPES.CREDIT_CARD && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('profile.payment.cardType')}
              </label>
              {isEditing ? (
                <select
                  value={method.cardType}
                  onChange={(e) => onUpdate(method.id, 'cardType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">{t('profile.payment.select')}</option>
                  {Object.values(CARD_TYPES).map(type => (
                    <option key={type} value={type}>
                      {getCardTypeLabel(type)}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-gray-900">{getCardTypeLabel(method.cardType)}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('profile.payment.expiryDate')}
              </label>
              {isEditing ? (
                <input
                  type="text"
                  placeholder="MM/YYYY"
                  value={method.expiryDate}
                  onChange={(e) => onUpdate(method.id, 'expiryDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-900">{method.expiryDate}</p>
              )}
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('profile.payment.holder')}
          </label>
          {isEditing ? (
            <input
              type="text"
              value={method.holderName}
              onChange={(e) => onUpdate(method.id, 'holderName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          ) : (
            <p className="text-gray-900">{method.holderName}</p>
          )}
        </div>
      </div>
    </div>
  );
};

PaymentMethodCard.propTypes = {
  method: PropTypes.object.isRequired,
  isEditing: PropTypes.bool.isRequired,
  showCardNumber: PropTypes.bool.isRequired,
  onToggleShowCard: PropTypes.func.isRequired,
  onSetAsMain: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  maskCardNumber: PropTypes.func.isRequired,
  getPaymentTypeLabel: PropTypes.func.isRequired
};

export default PaymentMethodCard;
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import profileService from '../services/profileService';
import { PAYMENT_METHOD_TYPES } from '../constants/profileConstants';

const usePaymentData = () => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showCardNumbers, setShowCardNumbers] = useState({});
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    type: '',
    bank: '',
    accountNumber: '',
    cardNumber: '',
    accountType: '',
    cardType: '',
    currency: 'PEN',
    holderName: '',
    expiryDate: '',
    isMain: false
  });
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load payment methods from API
  useEffect(() => {
    const loadPaymentMethods = async () => {
      try {
        setLoading(true);
        const result = await profileService.getPaymentMethods();
        if (result.success) {
          setPaymentMethods(result.data || []);
        }
      } catch (error) {
        console.error('Error loading payment methods:', error);
        toast.error('Error al cargar métodos de pago');
      } finally {
        setLoading(false);
      }
    };

    loadPaymentMethods();
  }, []);

  const maskCardNumber = (number) => {
    if (!number) return '';
    const cleaned = number.replace(/\D/g, '');
    if (cleaned.length < 8) return cleaned;
    return `${cleaned.slice(0, 4)}-****-****-${cleaned.slice(-4)}`;
  };

  const toggleShowCardNumber = (id) => {
    setShowCardNumbers(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleAddPaymentMethod = async () => {
    if (newPaymentMethod.type && newPaymentMethod.bank && newPaymentMethod.holderName) {
      try {
        const result = await profileService.addPaymentMethod(newPaymentMethod);
        if (result.success) {
          setPaymentMethods([...paymentMethods, { ...newPaymentMethod, id: Date.now() }]);
          setNewPaymentMethod({
            type: '',
            bank: '',
            accountNumber: '',
            cardNumber: '',
            accountType: '',
            cardType: '',
            currency: 'PEN',
            holderName: '',
            expiryDate: '',
            isMain: false
          });
          toast.success(t('profile.payment.methodAdded'));
        } else {
          toast.error(result.error || 'Error al agregar método de pago');
        }
      } catch (error) {
        console.error('Error adding payment method:', error);
        toast.error('Error al agregar método de pago');
      }
    }
  };

  const handleDeletePaymentMethod = (id) => {
    const method = paymentMethods.find(m => m.id === id);
    if (method?.isMain) {
      toast.error(t('profile.payment.cannotDeleteMain'));
      return;
    }
    setPaymentMethods(paymentMethods.filter(method => method.id !== id));
    toast.success(t('profile.payment.methodDeleted'));
  };

  const handleSetAsMain = (id) => {
    const updatedMethods = paymentMethods.map(method => ({
      ...method,
      isMain: method.id === id
    }));
    setPaymentMethods(updatedMethods);
    toast.success(t('profile.payment.mainMethodUpdated'));
  };

  const handleUpdateMethod = (id, field, value) => {
    const updatedMethods = paymentMethods.map(m => 
      m.id === id ? { ...m, [field]: value } : m
    );
    setPaymentMethods(updatedMethods);
  };

  const handleSave = () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Saving payment methods:', paymentMethods);
    }
    setIsEditing(false);
    toast.success(t('profile.payment.saved'));
  };

  const handleCancel = async () => {
    setIsEditing(false);
    // Reload original data from API
    try {
      const result = await profileService.getPaymentMethods();
      if (result.success) {
        setPaymentMethods(result.data || []);
      }
    } catch (error) {
      console.error('Error reloading payment methods:', error);
    }
  };

  const getPaymentTypeLabel = (type) => {
    switch (type) {
      case PAYMENT_METHOD_TYPES.BANK_ACCOUNT:
        return t('profile.payment.types.bankAccount');
      case PAYMENT_METHOD_TYPES.CREDIT_CARD:
        return t('profile.payment.types.creditCard');
      default:
        return type;
    }
  };

  return {
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
  };
};

export default usePaymentData;
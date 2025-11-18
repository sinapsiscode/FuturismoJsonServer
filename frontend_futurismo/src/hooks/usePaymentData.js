import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useAgencyStore } from '../stores/agencyStore';
import { PAYMENT_METHOD_TYPES } from '../constants/profileConstants';

const usePaymentData = () => {
  const { t } = useTranslation();
  const currentAgency = useAgencyStore((state) => state.currentAgency);
  const actions = useAgencyStore((state) => state.actions);
  const storeLoading = useAgencyStore((state) => state.isLoading);
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
  const [loading, setLoading] = useState(false);

  // Load payment methods from currentAgency
  useEffect(() => {
    if (currentAgency?.payment_methods) {
      setPaymentMethods(currentAgency.payment_methods);
    } else if (currentAgency) {
      setPaymentMethods([]);
    }
  }, [currentAgency]);

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

  const handleAddPaymentMethod = () => {
    if (newPaymentMethod.type && newPaymentMethod.bank && newPaymentMethod.holderName) {
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

  const handleSave = async () => {
    if (!currentAgency) {
      toast.error('No se encontró la información de la agencia');
      return;
    }

    setLoading(true);

    try {
      const updateData = {
        payment_methods: paymentMethods
      };

      console.log('💾 Guardando métodos de pago:', updateData);

      await actions.updateAgencyProfile(updateData);

      toast.success(t('profile.payment.saved'));
      setIsEditing(false);
    } catch (error) {
      console.error('❌ Error al guardar:', error);
      toast.error(`Error al actualizar: ${error.message || 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Restaurar datos originales
    if (currentAgency?.payment_methods) {
      setPaymentMethods(currentAgency.payment_methods);
    } else {
      setPaymentMethods([]);
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
    getPaymentTypeLabel,
    loading: loading || storeLoading
  };
};

export default usePaymentData;
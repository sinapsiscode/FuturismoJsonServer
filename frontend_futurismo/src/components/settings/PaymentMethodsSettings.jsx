import React, { useState, useEffect } from 'react';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  CreditCardIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const PaymentMethodsSettings = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingMethod, setEditingMethod] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    enabled: true,
    icon: 'credit-card'
  });

  // Cargar métodos de pago
  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/config/payment-methods');
      const result = await response.json();

      if (result.success) {
        setPaymentMethods(result.data || []);
      } else {
        toast.error('Error al cargar métodos de pago');
      }
    } catch (error) {
      console.error('Error loading payment methods:', error);
      toast.error('Error al conectar con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.id || !formData.name) {
      toast.error('ID y nombre son requeridos');
      return;
    }

    try {
      const url = editingMethod
        ? `/api/config/payment-methods/${editingMethod.id}`
        : '/api/config/payment-methods';

      const method = editingMethod ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        toast.success(editingMethod ? 'Método actualizado' : 'Método creado');
        loadPaymentMethods();
        resetForm();
      } else {
        toast.error(result.error || 'Error al guardar');
      }
    } catch (error) {
      console.error('Error saving payment method:', error);
      toast.error('Error al guardar');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este método de pago?')) {
      return;
    }

    try {
      const response = await fetch(`/api/config/payment-methods/${id}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Método eliminado');
        loadPaymentMethods();
      } else {
        toast.error(result.error || 'Error al eliminar');
      }
    } catch (error) {
      console.error('Error deleting payment method:', error);
      toast.error('Error al eliminar');
    }
  };

  const handleEdit = (method) => {
    setEditingMethod(method);
    setFormData({
      id: method.id,
      name: method.name,
      description: method.description || '',
      enabled: method.enabled !== false,
      icon: method.icon || 'credit-card'
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      description: '',
      enabled: true,
      icon: 'credit-card'
    });
    setEditingMethod(null);
    setShowForm(false);
  };

  const getIconComponent = (iconName) => {
    switch (iconName) {
      case 'bank':
      case 'banknotes':
        return BanknotesIcon;
      case 'cash':
        return BanknotesIcon;
      case 'credit-card':
      default:
        return CreditCardIcon;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-sm border">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Métodos de Pago</h3>
          <p className="text-sm text-gray-600 mt-1">
            Gestiona los métodos de pago disponibles para las reservas
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {showForm ? (
            <>
              <XMarkIcon className="w-5 h-5" />
              Cancelar
            </>
          ) : (
            <>
              <PlusIcon className="w-5 h-5" />
              Nuevo Método
            </>
          )}
        </button>
      </div>

      {/* Formulario de creación/edición */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="text-md font-semibold text-gray-900 mb-4">
            {editingMethod ? 'Editar Método de Pago' : 'Nuevo Método de Pago'}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID *
              </label>
              <input
                type="text"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="paypal"
                required
                disabled={editingMethod !== null}
              />
              <p className="text-xs text-gray-500 mt-1">
                Identificador único (sin espacios, usar guiones bajos)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="PayPal"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Descripción del método de pago"
                rows="2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ícono
              </label>
              <select
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="credit-card">Tarjeta de Crédito</option>
                <option value="bank">Banco</option>
                <option value="cash">Efectivo</option>
                <option value="banknotes">Billetes</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.enabled}
                  onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Método habilitado
                </span>
              </label>
              <p className="text-xs text-gray-500 mt-1 ml-6">
                Solo los métodos habilitados aparecerán en las reservas
              </p>
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <CheckIcon className="w-5 h-5" />
              {editingMethod ? 'Actualizar' : 'Crear'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Lista de métodos de pago */}
      <div className="space-y-3">
        {paymentMethods.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <CreditCardIcon className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No hay métodos de pago configurados</p>
            <p className="text-sm mt-1">Crea el primer método de pago</p>
          </div>
        ) : (
          paymentMethods.map((method) => {
            const IconComponent = getIconComponent(method.icon);
            return (
              <div
                key={method.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${method.enabled !== false ? 'bg-green-100' : 'bg-gray-100'} rounded-lg flex items-center justify-center`}>
                      <IconComponent className={`w-5 h-5 ${method.enabled !== false ? 'text-green-600' : 'text-gray-400'}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900">{method.name}</h4>
                        {method.enabled === false && (
                          <span className="px-2 py-0.5 text-xs bg-gray-200 text-gray-600 rounded">
                            Deshabilitado
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{method.description}</p>
                      <div className="flex gap-3 mt-1">
                        <span className="text-xs text-gray-500">
                          ID: <code className="bg-gray-100 px-1 rounded">{method.id}</code>
                        </span>
                        <span className="text-xs text-gray-500">
                          Ícono: <span className="bg-gray-100 px-1 rounded">{method.icon}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(method)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(method.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default PaymentMethodsSettings;

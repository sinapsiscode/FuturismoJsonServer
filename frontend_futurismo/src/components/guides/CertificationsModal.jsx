import React, { useState } from 'react';
import { XMarkIcon, PlusIcon, TrashIcon, DocumentCheckIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

const CertificationsModal = ({ isOpen, onClose, certifications = [], onUpdate }) => {
  const { t } = useTranslation();
  const [newCertification, setNewCertification] = useState({
    name: '',
    issuer: '',
    issueDate: '',
    expiryDate: '',
    credentialId: ''
  });
  const [isAdding, setIsAdding] = useState(false);

  if (!isOpen) return null;

  const handleAdd = () => {
    if (newCertification.name && newCertification.issuer) {
      const certification = {
        id: Date.now().toString(),
        ...newCertification,
        createdAt: new Date().toISOString()
      };
      
      onUpdate([...certifications, certification]);
      
      setNewCertification({
        name: '',
        issuer: '',
        issueDate: '',
        expiryDate: '',
        credentialId: ''
      });
      setIsAdding(false);
    }
  };

  const handleDelete = (id) => {
    if (confirm('¿Estás seguro de eliminar esta certificación?')) {
      onUpdate(certifications.filter(cert => cert.id !== id));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'short'
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <DocumentCheckIcon className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Certificaciones y Credenciales
              </h2>
              <p className="text-sm text-gray-500">
                Gestiona tus certificaciones profesionales
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Lista de certificaciones */}
          <div className="space-y-3 mb-6">
            {certifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No hay certificaciones registradas
              </div>
            ) : (
              certifications.map((cert) => (
                <div
                  key={cert.id}
                  className="bg-gray-50 rounded-lg p-4 flex items-start justify-between"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{cert.name}</h4>
                    <p className="text-sm text-gray-600">{cert.issuer}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="w-3 h-3" />
                        Emitido: {formatDate(cert.issueDate)}
                      </span>
                      {cert.expiryDate && (
                        <span className="flex items-center gap-1">
                          Vence: {formatDate(cert.expiryDate)}
                        </span>
                      )}
                      {cert.credentialId && (
                        <span>ID: {cert.credentialId}</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(cert.id)}
                    className="p-2 text-red-500 hover:text-red-700 transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Formulario para agregar */}
          {isAdding ? (
            <div className="border border-gray-200 rounded-lg p-4 space-y-4">
              <h3 className="font-medium text-gray-900 mb-3">
                Nueva Certificación
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre de la certificación *
                  </label>
                  <input
                    type="text"
                    value={newCertification.name}
                    onChange={(e) => setNewCertification({
                      ...newCertification,
                      name: e.target.value
                    })}
                    placeholder="Ej: Guía Oficial MINCETUR"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Institución emisora *
                  </label>
                  <input
                    type="text"
                    value={newCertification.issuer}
                    onChange={(e) => setNewCertification({
                      ...newCertification,
                      issuer: e.target.value
                    })}
                    placeholder="Ej: Ministerio de Comercio Exterior y Turismo"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de emisión
                  </label>
                  <input
                    type="date"
                    value={newCertification.issueDate}
                    onChange={(e) => setNewCertification({
                      ...newCertification,
                      issueDate: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de vencimiento
                  </label>
                  <input
                    type="date"
                    value={newCertification.expiryDate}
                    onChange={(e) => setNewCertification({
                      ...newCertification,
                      expiryDate: e.target.value
                    })}
                    min={newCertification.issueDate}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ID de credencial (opcional)
                  </label>
                  <input
                    type="text"
                    value={newCertification.credentialId}
                    onChange={(e) => setNewCertification({
                      ...newCertification,
                      credentialId: e.target.value
                    })}
                    placeholder="Número o código de certificación"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => {
                    setIsAdding(false);
                    setNewCertification({
                      name: '',
                      issuer: '',
                      issueDate: '',
                      expiryDate: '',
                      credentialId: ''
                    });
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAdd}
                  disabled={!newCertification.name || !newCertification.issuer}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Agregar Certificación
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center gap-2"
            >
              <PlusIcon className="w-5 h-5" />
              Agregar nueva certificación
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CertificationsModal;
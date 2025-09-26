import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { UserGroupIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

const ProtocolMaterials = ({ 
  materialFields, 
  register, 
  appendMaterial, 
  removeMaterial 
}) => {
  const { t } = useTranslation();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <UserGroupIcon className="w-5 h-5 mr-2 text-purple-500" />
          {t('emergency.protocol.necessaryMaterials')}
        </h3>
        <button
          type="button"
          onClick={() => appendMaterial({ name: '' })}
          className="px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center space-x-2"
        >
          <PlusIcon className="w-4 h-4" />
          <span>{t('emergency.protocol.addMaterial')}</span>
        </button>
      </div>

      <div className="space-y-2">
        {materialFields.map((field, index) => (
          <div key={field.id} className="flex items-center space-x-3">
            <div className="flex-1">
              <input
                {...register(`materials.${index}.name`)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder={t('emergency.protocol.materialPlaceholder')}
              />
            </div>
            {materialFields.length > 1 && (
              <button
                type="button"
                onClick={() => removeMaterial(index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                aria-label={t('common.delete')}
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

ProtocolMaterials.propTypes = {
  materialFields: PropTypes.array.isRequired,
  register: PropTypes.func.isRequired,
  appendMaterial: PropTypes.func.isRequired,
  removeMaterial: PropTypes.func.isRequired
};

export default ProtocolMaterials;
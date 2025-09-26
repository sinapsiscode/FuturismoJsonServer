import React, { useState } from 'react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useUsersStore } from '../../stores/usersStoreSimple';
import { useTranslation } from 'react-i18next';
import { 
  USER_STATUS, 
  USER_ROLES,
  VALIDATION_PATTERNS
} from '../../constants/usersConstants';
import UserFormFields from './UserFormFields';
import UserAgencyFields from './UserAgencyFields';
import UserGuideFields from './UserGuideFields';

const UserForm = ({ user = null, onSubmit, onCancel, isLoading = false }) => {
  const { t } = useTranslation();
  const { createUser, updateUser, getRoles } = useUsersStore();
  const isEdit = !!user;
  const roles = getRoles();

  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    role: user?.role || '',
    company: user?.company || '',
    position: user?.position || '',
    status: user?.status || USER_STATUS.ACTIVE,
    // Campos específicos para agencias
    ruc: user?.ruc || '',
    address: user?.address || '',
    creditLimit: user?.creditLimit || '',
    // Campos específicos para guías
    guideType: user?.guideType || '',
    languages: user?.languages || [],
    specialties: user?.specialties || [],
    experience: user?.experience || '',
    certifications: user?.certifications || []
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpiar error del campo si existe
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = t('users.form.errors.usernameRequired');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('users.form.errors.emailRequired');
    } else if (!VALIDATION_PATTERNS.EMAIL.test(formData.email)) {
      newErrors.email = t('users.form.errors.emailInvalid');
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = t('users.form.errors.firstNameRequired');
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = t('users.form.errors.lastNameRequired');
    }

    if (!formData.role) {
      newErrors.role = t('users.form.errors.roleRequired');
    }

    if (!formData.company.trim()) {
      newErrors.company = t('users.form.errors.companyRequired');
    }

    if (!formData.position.trim()) {
      newErrors.position = t('users.form.errors.positionRequired');
    }

    // Validaciones específicas por rol
    if (formData.role === USER_ROLES.AGENCY) {
      if (!formData.ruc.trim()) {
        newErrors.ruc = t('users.form.errors.rucRequired');
      }
      if (!formData.address.trim()) {
        newErrors.address = t('users.form.errors.addressRequired');
      }
    }

    if (formData.role === USER_ROLES.GUIDE) {
      if (!formData.guideType) {
        newErrors.guideType = t('users.form.errors.guideTypeRequired');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      if (isEdit) {
        updateUser(user.id, formData);
      } else {
        createUser(formData);
      }
      
      if (onSubmit) {
        onSubmit(formData);
      }
    } catch (error) {
      // Error handling is done in the store
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border space-y-4 sm:space-y-6">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-4">
            {isEdit ? t('users.form.editUser') : t('users.form.newUser')}
          </h3>

          <UserFormFields
            formData={formData}
            handleChange={handleChange}
            errors={errors}
            roles={roles}
            isEdit={isEdit}
          />

          {/* Agency-specific fields */}
          {formData.role === USER_ROLES.AGENCY && (
            <UserAgencyFields
              formData={formData}
              handleChange={handleChange}
              errors={errors}
            />
          )}

          {/* Guide-specific fields */}
          {formData.role === USER_ROLES.GUIDE && (
            <UserGuideFields
              formData={formData}
              setFormData={setFormData}
              handleChange={handleChange}
              errors={errors}
            />
          )}
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 sm:pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-4 py-2 sm:py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm sm:text-base font-medium"
            disabled={isLoading}
          >
            <XMarkIcon className="h-4 w-4 mr-2 inline" />
            {t('common.cancel')}
          </button>
          
          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 text-sm sm:text-base font-medium"
            disabled={isLoading}
          >
            <CheckIcon className="h-4 w-4 mr-2 inline" />
            {isLoading ? t('users.form.saving') : (isEdit ? t('users.form.update') : t('users.form.create'))}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
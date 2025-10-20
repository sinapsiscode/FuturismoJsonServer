import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useUsersStore } from '../../stores/usersStore';
import { useTranslation } from 'react-i18next';
import {
  FORM_LIMITS,
  VALIDATION_PATTERNS,
  USER_STATUS,
  DEFAULT_PREFERENCES
} from '../../constants/usersConstants';
import UserFormTabs from './UserFormTabs';
import UserBasicInfoForm from './UserBasicInfoForm';

// Esquema de validación
const createUserSchema = (t) => yup.object({
  username: yup
    .string()
    .required(t('users.form.errors.usernameRequired'))
    .min(FORM_LIMITS.USERNAME_MIN, t('users.form.errors.usernameMin'))
    .matches(VALIDATION_PATTERNS.USERNAME, t('users.form.errors.usernamePattern')),
  email: yup
    .string()
    .required(t('users.form.errors.emailRequired'))
    .email(t('users.form.errors.emailInvalid')),
  firstName: yup
    .string()
    .required(t('users.form.errors.firstNameRequired'))
    .min(FORM_LIMITS.NAME_MIN, t('users.form.errors.firstNameMin')),
  lastName: yup
    .string()
    .required(t('users.form.errors.lastNameRequired'))
    .min(FORM_LIMITS.NAME_MIN, t('users.form.errors.lastNameMin')),
  phone: yup
    .string()
    .required(t('users.form.errors.phoneRequired'))
    .matches(VALIDATION_PATTERNS.PHONE, t('users.form.errors.phoneInvalid')),
  role: yup
    .string()
    .required(t('users.form.errors.roleRequired')),
  status: yup
    .string()
    .required(t('users.form.errors.statusRequired')),
  password: yup
    .string()
    .when('isEdit', {
      is: false,
      then: (schema) => schema.required(t('users.form.errors.passwordRequired')).min(FORM_LIMITS.PASSWORD_MIN, t('users.form.errors.passwordMin')),
      otherwise: (schema) => schema.min(FORM_LIMITS.PASSWORD_MIN, t('users.form.errors.passwordMin'))
    }),
  confirmPassword: yup
    .string()
    .when('password', {
      is: (password) => password && password.length > 0,
      then: (schema) => schema
        .required(t('users.form.errors.confirmPasswordRequired'))
        .oneOf([yup.ref('password')], t('users.form.errors.passwordMismatch'))
    })
});

const UserForm = ({ user = null, onSubmit, onCancel, isLoading = false }) => {
  const { t } = useTranslation();
  const {
    getRoles,
    createUser,
    updateUser
  } = useUsersStore();

  const [roles, setRoles] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  const isEdit = !!user;
  const userSchema = createUserSchema(t);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(userSchema.concat(yup.object({ isEdit: yup.boolean().default(isEdit) }))),
    defaultValues: {
      username: user?.username || '',
      email: user?.email || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
      role: user?.role || '',
      status: user?.status || USER_STATUS.ACTIVE,
      avatar: user?.avatar || '',
      isEdit
    }
  });

  useEffect(() => {
    const systemRoles = getRoles();
    console.log('Roles obtenidos:', systemRoles);

    // Fallback si getRoles() no devuelve nada
    const finalRoles = systemRoles?.length ? systemRoles : [
      { id: 'admin', name: 'Administrador', description: 'Acceso total al sistema' },
      { id: 'agency', name: 'Agencia', description: 'Gestión de reservas y tours' },
      { id: 'guide-planta', name: 'Guía Planta', description: 'Guía empleado fijo de la empresa' },
      { id: 'guide-freelance', name: 'Guía Freelance', description: 'Guía independiente por servicios' }
    ];

    setRoles(finalRoles);
  }, []);

  const handleFormSubmit = async (data) => {
    const userData = {
      ...data,
      preferences: user?.preferences || DEFAULT_PREFERENCES
    };

    try {
      if (isEdit) {
        updateUser(user.id, userData);
      } else {
        createUser(userData);
      }

      if (onSubmit) {
        onSubmit(userData);
      }
    } catch (error) {
      // Error handling is done in the store
    }
  };


  return (
    <div className="modal-overlay">
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title">
              {isEdit ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
            </h2>
            <button
              type="button"
              onClick={onCancel}
              className="modal-close"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <div className="modal-body">
              <div className="space-y-4 sm:space-y-6">
        {/* Tabs */}
        <UserFormTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Basic Information */}
        {activeTab === 'basic' && (
          <UserBasicInfoForm
            register={register}
            errors={errors}
            watch={watch}
            roles={roles}
            isEdit={isEdit}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            showConfirmPassword={showConfirmPassword}
            setShowConfirmPassword={setShowConfirmPassword}
          />
        )}

              </div>
            </div>
            
            <div className="modal-footer">
              <button
                type="button"
                onClick={onCancel}
                className="btn btn-secondary"
                disabled={isLoading}
              >
                {t('common.cancel')}
              </button>
              
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                <CheckIcon className="h-4 w-4 mr-2" />
                {isLoading ? t('users.form.saving') : (isEdit ? t('users.form.update') : t('users.form.create'))}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserForm;
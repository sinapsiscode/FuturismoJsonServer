import PropTypes from 'prop-types';
import { useEffect } from 'react';
import useProviderForm from '../../hooks/useProviderForm';
import useModalTransitions from '../../hooks/useModalTransitions';
import ProviderFormHeader from './ProviderFormHeader';
import ProviderBasicInfo from './ProviderBasicInfo';
import ProviderContactInfo from './ProviderContactInfo';
import ProviderServicesSection from './ProviderServicesSection';

const ProviderForm = ({ provider, onSave, onCancel }) => {
  const {
    register,
    handleSubmit,
    errors,
    watch,
    services,
    handleAddService,
    handleRemoveService,
    handleServiceChange,
    onSubmit,
    handleCancel
  } = useProviderForm(provider, onSave, onCancel);
  
  // Hook para manejar transiciones suaves del modal
  const {
    modalRef,
    closeWithAnimation,
    getModalProps,
    getDialogProps
  } = useModalTransitions(true, onCancel, {
    closeOnEscape: true,
    closeOnOverlay: true,
    transitionDuration: 1000,
    animationType: 'scale'
  });
  
  // Función mejorada para cerrar con animación
  const handleCancelWithAnimation = () => {
    closeWithAnimation();
  };

  const selectedCategory = watch('category');

  return (
    <div
      {...getModalProps()}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
    >
      <div
        {...getDialogProps()}
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[95vh] flex flex-col my-4 sm:my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
          <ProviderFormHeader
            isEditing={!!provider}
            onCancel={handleCancelWithAnimation}
            onSubmit={handleSubmit(onSubmit)}
          />

          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
            <div className="space-y-4 sm:space-y-6">
              <ProviderBasicInfo
                register={register}
                errors={errors}
                watch={watch}
              />

              <ProviderContactInfo
                register={register}
                errors={errors}
              />

              <ProviderServicesSection
                services={services}
                handleAddService={handleAddService}
                handleRemoveService={handleRemoveService}
                handleServiceChange={handleServiceChange}
                selectedCategory={selectedCategory}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

ProviderForm.propTypes = {
  provider: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default ProviderForm;
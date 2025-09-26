import PropTypes from 'prop-types';
import { useEffect } from 'react';
import useProviderForm from '../../hooks/useProviderForm';
import useModalTransitions from '../../hooks/useModalTransitions';
import ProviderFormHeader from './ProviderFormHeader';
import ProviderBasicInfo from './ProviderBasicInfo';
import ProviderContactInfo from './ProviderContactInfo';
import ProviderServicesSection from './ProviderServicesSection';
import ProviderPricingSection from './ProviderPricingSection';

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
    <div {...getModalProps()}>
      <div {...getDialogProps()} className="modal-dialog modal-lg">
        <div className="modal-content modal-open">
          <form onSubmit={handleSubmit(onSubmit)}>
            <ProviderFormHeader
              isEditing={!!provider}
              onCancel={handleCancelWithAnimation}
              onSubmit={handleSubmit(onSubmit)}
            />

            <div className="modal-body">
              <div className="space-y-6">
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

                <ProviderPricingSection
                  register={register}
                  errors={errors}
                  watch={watch}
                />
              </div>
            </div>
          </form>
        </div>
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
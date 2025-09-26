import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { XMarkIcon, DocumentCheckIcon } from '@heroicons/react/24/outline';

const ProviderFormHeader = ({ isEditing, onCancel, onSubmit }) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="modal-header">
        <h2 className="modal-title">
          {isEditing ? t('providers.form.editTitle') : t('providers.form.createTitle')}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="modal-close"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>
      
      <div className="modal-footer">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary"
        >
          {t('common.cancel')}
        </button>
        <button
          type="button"
          onClick={onSubmit}
          className="btn btn-primary"
        >
          <DocumentCheckIcon className="w-5 h-5 mr-2" />
          {t('common.save')}
        </button>
      </div>
    </>
  );
};

ProviderFormHeader.propTypes = {
  isEditing: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default ProviderFormHeader;
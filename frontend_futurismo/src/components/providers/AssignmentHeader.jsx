import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { 
  XMarkIcon, 
  DocumentCheckIcon, 
  CheckCircleIcon, 
  ArrowDownTrayIcon 
} from '@heroicons/react/24/outline';

const AssignmentHeader = ({ 
  isExisting, 
  onClose, 
  onSave, 
  onFinalize, 
  onExport,
  hasProviders 
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold">
        {isExisting 
          ? t('providers.assignment.editTitle') 
          : t('providers.assignment.createTitle')}
      </h2>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <XMarkIcon className="w-5 h-5 inline mr-2" />
          {t('common.cancel')}
        </button>
        {isExisting && (
          <button
            type="button"
            onClick={onExport}
            className="px-4 py-2 text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
          >
            <ArrowDownTrayIcon className="w-5 h-5 inline mr-2" />
            {t('providers.assignment.exportPDF')}
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <DocumentCheckIcon className="w-5 h-5 inline mr-2" />
          {t('providers.assignment.saveDraft')}
        </button>
        <button
          type="button"
          onClick={onFinalize}
          disabled={!hasProviders}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CheckCircleIcon className="w-5 h-5 inline mr-2" />
          {t('providers.assignment.finalize')}
        </button>
      </div>
    </div>
  );
};

AssignmentHeader.propTypes = {
  isExisting: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onFinalize: PropTypes.func.isRequired,
  onExport: PropTypes.func.isRequired,
  hasProviders: PropTypes.bool.isRequired
};

export default AssignmentHeader;
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { 
  EyeIcon, 
  ArrowDownTrayIcon, 
  TrashIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { DOCUMENT_STATUS } from '../../constants/profileConstants';

const DocumentCard = ({ 
  document, 
  getStatusBadge, 
  formatDate, 
  isExpiringSoon,
  onView,
  onDelete 
}) => {
  const { t } = useTranslation();
  const statusBadge = getStatusBadge(document.status);

  const getStatusIcon = (status) => {
    switch (status) {
      case DOCUMENT_STATUS.VALID:
        return CheckCircleIcon;
      case DOCUMENT_STATUS.EXPIRED:
      case DOCUMENT_STATUS.REJECTED:
        return ExclamationTriangleIcon;
      case DOCUMENT_STATUS.PENDING:
      default:
        return ClockIcon;
    }
  };

  const StatusIcon = getStatusIcon(document.status);

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">{document.name}</h4>
          <p className="text-sm text-gray-500 mt-1">{document.fileName}</p>
          
          <div className="flex items-center gap-4 mt-3 text-sm">
            <span className="text-gray-600">
              {t('profile.documents.size')}: {document.size}
            </span>
            <span className="text-gray-600">
              {t('profile.documents.uploaded')}: {formatDate(document.uploadDate)}
            </span>
          </div>

          {document.expiryDate && (
            <div className="mt-2">
              <span className={`text-sm ${
                isExpiringSoon(document.expiryDate) ? 'text-orange-600 font-medium' : 'text-gray-600'
              }`}>
                {t('profile.documents.expires')}: {formatDate(document.expiryDate)}
                {isExpiringSoon(document.expiryDate) && (
                  <span className="ml-2 text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded">
                    {t('profile.documents.expiringSoon')}
                  </span>
                )}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${statusBadge.color}`}>
            <StatusIcon className="w-4 h-4" />
            <span>{statusBadge.text}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
        <button
          onClick={() => onView(document)}
          className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
        >
          <EyeIcon className="w-4 h-4" />
          {t('profile.documents.view')}
        </button>
        <button
          className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded"
        >
          <ArrowDownTrayIcon className="w-4 h-4" />
          {t('profile.documents.download')}
        </button>
        <button
          onClick={() => onDelete(document.id)}
          className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded ml-auto"
        >
          <TrashIcon className="w-4 h-4" />
          {t('common.delete')}
        </button>
      </div>
    </div>
  );
};

DocumentCard.propTypes = {
  document: PropTypes.object.isRequired,
  getStatusBadge: PropTypes.func.isRequired,
  formatDate: PropTypes.func.isRequired,
  isExpiringSoon: PropTypes.func.isRequired,
  onView: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default DocumentCard;
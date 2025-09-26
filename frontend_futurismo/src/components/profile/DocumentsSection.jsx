import { useTranslation } from 'react-i18next';
import { 
  DocumentTextIcon, 
  ArrowUpTrayIcon, 
  ChevronDownIcon, 
  ChevronUpIcon,
  ExclamationTriangleIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import useDocuments from '../../hooks/useDocuments';
import DocumentCard from './DocumentCard';
import { ACCEPTED_FILE_TYPES } from '../../constants/profileConstants';

const DocumentsSection = () => {
  const { t } = useTranslation();
  const {
    isCollapsed,
    setIsCollapsed,
    selectedCategory,
    setSelectedCategory,
    isUploading,
    categories,
    getStatusBadge,
    formatDate,
    isExpiringSoon,
    handleFileUpload,
    handleDeleteDocument,
    handleViewDocument,
    filteredDocuments,
    getExpiredCount,
    getExpiringSoonCount
  } = useDocuments();

  const expiredCount = getExpiredCount();
  const expiringSoonCount = getExpiringSoonCount();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3 flex-1">
          <div className="p-2 bg-blue-100 rounded-lg">
            <DocumentTextIcon className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {t('profile.documents.title')}
            </h3>
            <p className="text-sm text-gray-500">
              {t('profile.documents.subtitle')}
            </p>
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title={isCollapsed ? t('common.expand') : t('common.collapse')}
          >
            {isCollapsed ? (
              <ChevronDownIcon className="w-5 h-5" />
            ) : (
              <ChevronUpIcon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div>
          {(expiredCount > 0 || expiringSoonCount > 0) && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-2">
                <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  {expiredCount > 0 && (
                    <p>
                      {t('profile.documents.expiredWarning', { count: expiredCount })}
                    </p>
                  )}
                  {expiringSoonCount > 0 && (
                    <p>
                      {t('profile.documents.expiringSoonWarning', { count: expiringSoonCount })}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {Object.entries(categories).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    selectedCategory === key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <label className="relative">
              <input
                type="file"
                onChange={handleFileUpload}
                accept={ACCEPTED_FILE_TYPES.documents}
                className="hidden"
                disabled={isUploading}
              />
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    {t('profile.documents.uploading')}
                  </>
                ) : (
                  <>
                    <ArrowUpTrayIcon className="w-4 h-4" />
                    {t('profile.documents.uploadNew')}
                  </>
                )}
              </div>
            </label>
          </div>

          <div className="grid gap-4">
            {filteredDocuments.length > 0 ? (
              filteredDocuments.map(document => (
                <DocumentCard
                  key={document.id}
                  document={document}
                  getStatusBadge={getStatusBadge}
                  formatDate={formatDate}
                  isExpiringSoon={isExpiringSoon}
                  onView={handleViewDocument}
                  onDelete={handleDeleteDocument}
                />
              ))
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  {t('profile.documents.noDocuments')}
                </p>
                <label className="relative inline-flex">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    accept={ACCEPTED_FILE_TYPES.documents}
                    className="hidden"
                    disabled={isUploading}
                  />
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                    <PlusIcon className="w-4 h-4" />
                    {t('profile.documents.uploadFirst')}
                  </div>
                </label>
              </div>
            )}
          </div>

          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-600">
              <span className="font-medium">{t('profile.documents.noteTitle')}:</span>{' '}
              {t('profile.documents.noteMessage')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsSection;
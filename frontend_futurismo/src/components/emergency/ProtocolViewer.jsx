import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ClockIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import useProtocolViewer from '../../hooks/useProtocolViewer';
import ProtocolHeader from './ProtocolHeader';
import ProtocolDescription from './ProtocolDescription';
import ProtocolStepsList from './ProtocolStepsList';
import ProtocolContactsList from './ProtocolContactsList';
import ProtocolMaterials from './ProtocolMaterials';

const ProtocolViewer = ({ protocol, onClose, onEdit, onDownload }) => {
  const { t } = useTranslation();
  const {
    canEdit,
    getPriorityColor,
    getContactType,
    importantReminders,
    stats
  } = useProtocolViewer(protocol);

  return (
    <div className="modal-overlay p-4">
      <div className="modal-content max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-xl">
        <ProtocolHeader
          protocol={protocol}
          onClose={onClose}
          onEdit={onEdit}
          onDownload={onDownload}
          canEdit={canEdit}
          getPriorityColor={getPriorityColor}
        />

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-6">
            <ProtocolDescription 
              protocol={protocol}
              importantReminders={importantReminders}
            />
            
            <ProtocolStepsList 
              steps={protocol.content.steps}
            />
            
            <ProtocolContactsList 
              contacts={protocol.content.contacts}
            />
            
            {protocol.content.materials && protocol.content.materials.length > 0 && (
              <ProtocolMaterials 
                materials={protocol.content.materials}
              />
            )}

            {/* Stats Summary */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.steps}
                  </div>
                  <div className="text-sm text-gray-600">{t('emergency.protocol.steps')}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.contacts}
                  </div>
                  <div className="text-sm text-gray-600">{t('emergency.protocol.contacts')}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.materials}
                  </div>
                  <div className="text-sm text-gray-600">{t('emergency.protocol.materials')}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {t(`emergency.priority.${stats.priority}`).toUpperCase()}
                  </div>
                  <div className="text-sm text-gray-600">{t('emergency.protocol.priority')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <ClockIcon className="w-4 h-4" />
            <span>{t('emergency.protocol.lastUpdated', { date: protocol.lastUpdated })}</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t('common.close')}
            </button>
            <button
              onClick={onDownload}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              <span>{t('emergency.protocol.downloadPDF')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

ProtocolViewer.propTypes = {
  protocol: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    priority: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    lastUpdated: PropTypes.string.isRequired,
    content: PropTypes.shape({
      steps: PropTypes.arrayOf(PropTypes.string).isRequired,
      contacts: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        phone: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired
      })).isRequired,
      materials: PropTypes.arrayOf(PropTypes.string)
    }).isRequired
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDownload: PropTypes.func.isRequired
};

export default ProtocolViewer;
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { 
  XMarkIcon, 
  ChatBubbleLeftRightIcon, 
  UserIcon, 
  BuildingOffice2Icon 
} from '@heroicons/react/24/outline';
import ServiceAreaFeedback from './ServiceAreaFeedback';
import StaffFeedback from './StaffFeedback';

const FeedbackModal = ({ 
  isOpen, 
  onClose, 
  type = 'service',
  data = null,
  onSubmit 
}) => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [feedbackData, setFeedbackData] = useState(null);

  if (!isOpen) return null;

  const handleFeedbackSubmit = (submittedData) => {
    setFeedbackData(submittedData);
    console.log('Feedback submitted:', submittedData);
    onSubmit(submittedData);
    handleClose();
  };

  const handleClose = () => {
    setCurrentStep(1);
    setFeedbackData(null);
    onClose();
  };

  const renderModalContent = () => {
    if (type === 'service') {
      return (
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <BuildingOffice2Icon className="text-blue-600 w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {t('feedback.modal.opinionsTitle')}
                </h2>
                <p className="text-gray-600">
                  {data?.serviceName || t('feedback.modal.aboutService')}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <ServiceAreaFeedback
            serviceId={data?.serviceId}
            onFeedbackSubmit={handleFeedbackSubmit}
            existingFeedback={data?.existingFeedback}
          />
        </div>
      );
    }

    if (type === 'staff') {
      return (
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <UserIcon className="text-green-600 w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {t('feedback.modal.staffFeedbackTitle')}
                </h2>
                <p className="text-gray-600">
                  {t('feedback.modal.staffFeedbackSubtitle')}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <StaffFeedback
            staffMember={data}
            onFeedbackSubmit={handleFeedbackSubmit}
            existingFeedback={data?.existingFeedback}
          />
        </div>
      );
    }

    return null;
  };

  return (
    <div className="modal-overlay p-4">
      <div className="modal-content max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        {renderModalContent()}
      </div>
    </div>
  );
};

FeedbackModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['service', 'staff']),
  data: PropTypes.object,
  onSubmit: PropTypes.func.isRequired
};

export default FeedbackModal;
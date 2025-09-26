import React, { useState } from 'react';
import { 
  XMarkIcon as X, 
  StarIcon as Star, 
  UserIcon as User, 
  BuildingOffice2Icon as Building 
} from '@heroicons/react/24/outline';
import ServiceAreaRating from './ServiceAreaRating';
import StaffEvaluation from './StaffEvaluation';

const RatingModal = ({ 
  isOpen, 
  onClose, 
  type = 'service', // 'service' or 'staff'
  data = null, // service data or staff member data
  onSubmit 
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [ratingData, setRatingData] = useState(null);

  if (!isOpen) return null;

  const handleRatingSubmit = (submittedData) => {
    setRatingData(submittedData);
    console.log('Rating submitted:', submittedData);
    onSubmit(submittedData);
    handleClose();
  };

  const handleClose = () => {
    setCurrentStep(1);
    setRatingData(null);
    onClose();
  };

  const renderModalContent = () => {
    if (type === 'service') {
      return (
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Building className="text-blue-600" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Valorar Servicio
                </h2>
                <p className="text-gray-600">
                  {data?.serviceName || 'Servicio Turístico'}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <ServiceAreaRating
            serviceId={data?.serviceId}
            onRatingSubmit={handleRatingSubmit}
            initialRatings={data?.existingRatings}
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
                <User className="text-green-600" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Evaluar Personal
                </h2>
                <p className="text-gray-600">
                  Evaluación de desempeño
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <StaffEvaluation
            staffMember={data}
            onEvaluationSubmit={handleRatingSubmit}
            existingEvaluation={data?.existingEvaluation}
          />
        </div>
      );
    }

    return null;
  };

  return (
    <div className="modal-overlay p-4">
      <div className="modal-content max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        {renderModalContent()}
      </div>
    </div>
  );
};

export default RatingModal;
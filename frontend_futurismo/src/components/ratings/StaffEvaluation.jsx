import React from 'react';
import PropTypes from 'prop-types';
import { UserIcon as User } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { useStaffEvaluation } from '../../hooks/useStaffEvaluation';
import EvaluationCriteriaItem from './EvaluationCriteriaItem';
import EvaluationFeedbackSection from './EvaluationFeedbackSection';
import EvaluationRecommendationSection from './EvaluationRecommendationSection';
import EvaluationSummary from './EvaluationSummary';

const StaffEvaluation = ({ staffMember, onEvaluationSubmit, existingEvaluation = null }) => {
  const { t } = useTranslation();
  const {
    evaluation,
    feedback,
    recommendation,
    evaluationCriteria,
    recommendationOptions,
    isComplete,
    averageRating,
    handleRatingChange,
    handleFeedbackChange,
    setRecommendation,
    handleSubmit
  } = useStaffEvaluation(existingEvaluation, onEvaluationSubmit);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
            <User className="text-blue-600" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {t('ratings.evaluation.title')}
            </h2>
            <p className="text-gray-600">
              {staffMember.name} - {t(staffMember.role)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {evaluationCriteria.map((criterion) => (
          <EvaluationCriteriaItem
            key={criterion.key}
            criterion={criterion}
            rating={evaluation[criterion.key]}
            onRatingChange={handleRatingChange}
          />
        ))}
      </div>

      <div className="mb-6">
        <EvaluationFeedbackSection
          feedback={feedback}
          onFeedbackChange={handleFeedbackChange}
        />
      </div>

      <div className="mb-6">
        <EvaluationRecommendationSection
          recommendation={recommendation}
          recommendationOptions={recommendationOptions}
          onRecommendationChange={setRecommendation}
        />
      </div>

      {isComplete && (
        <div className="mb-6">
          <EvaluationSummary
            averageRating={averageRating}
            recommendationLabel={recommendationOptions.find(opt => opt.value === recommendation)?.label}
          />
        </div>
      )}

      <div className="flex justify-end gap-3">
        <button
          onClick={() => handleSubmit(staffMember)}
          disabled={!isComplete}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            isComplete
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {t('ratings.evaluation.saveButton')}
        </button>
      </div>
    </div>
  );
};

StaffEvaluation.propTypes = {
  staffMember: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired
  }).isRequired,
  onEvaluationSubmit: PropTypes.func.isRequired,
  existingEvaluation: PropTypes.object
};

export default StaffEvaluation;
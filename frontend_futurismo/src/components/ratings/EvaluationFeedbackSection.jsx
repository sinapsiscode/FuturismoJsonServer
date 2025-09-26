import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { FEEDBACK_TYPES } from '../../constants/ratingsConstants';

const EvaluationFeedbackSection = ({ feedback, onFeedbackChange }) => {
  const { t } = useTranslation();

  const feedbackFields = [
    {
      type: FEEDBACK_TYPES.STRENGTHS,
      label: 'ratings.evaluation.feedback.strengths',
      placeholder: 'ratings.evaluation.feedback.strengthsPlaceholder'
    },
    {
      type: FEEDBACK_TYPES.IMPROVEMENTS,
      label: 'ratings.evaluation.feedback.improvements',
      placeholder: 'ratings.evaluation.feedback.improvementsPlaceholder'
    },
    {
      type: FEEDBACK_TYPES.GENERAL_COMMENTS,
      label: 'ratings.evaluation.feedback.generalComments',
      placeholder: 'ratings.evaluation.feedback.generalCommentsPlaceholder'
    }
  ];

  return (
    <div className="space-y-4">
      {feedbackFields.map((field) => (
        <div key={field.type}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t(field.label)}
          </label>
          <textarea
            value={feedback[field.type]}
            onChange={(e) => onFeedbackChange(field.type, e.target.value)}
            placeholder={t(field.placeholder)}
            className="w-full p-3 border rounded-md resize-none"
            rows={3}
            maxLength={500}
          />
          <div className="text-xs text-gray-500 mt-1">
            {feedback[field.type].length}/500 {t('common.characters')}
          </div>
        </div>
      ))}
    </div>
  );
};

EvaluationFeedbackSection.propTypes = {
  feedback: PropTypes.shape({
    [FEEDBACK_TYPES.STRENGTHS]: PropTypes.string.isRequired,
    [FEEDBACK_TYPES.IMPROVEMENTS]: PropTypes.string.isRequired,
    [FEEDBACK_TYPES.GENERAL_COMMENTS]: PropTypes.string.isRequired
  }).isRequired,
  onFeedbackChange: PropTypes.func.isRequired
};

export default EvaluationFeedbackSection;
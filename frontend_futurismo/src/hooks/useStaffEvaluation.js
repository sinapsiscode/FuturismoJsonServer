import { useState } from 'react';
import { getEmptyEvaluation, getMockEvaluationCriteria, getMockRecommendationOptions } from '../data/mockRatingsData';
import { DEFAULT_FEEDBACK, RECOMMENDATION_TYPES } from '../constants/ratingsConstants';

export const useStaffEvaluation = (existingEvaluation = null, onEvaluationSubmit) => {
  const [evaluation, setEvaluation] = useState(
    existingEvaluation?.evaluation || getEmptyEvaluation()
  );

  const [feedback, setFeedback] = useState(
    existingEvaluation?.feedback || DEFAULT_FEEDBACK
  );

  const [recommendation, setRecommendation] = useState(
    existingEvaluation?.recommendation || RECOMMENDATION_TYPES.HIGHLY_RECOMMEND
  );

  const evaluationCriteria = getMockEvaluationCriteria();
  const recommendationOptions = getMockRecommendationOptions();

  const handleRatingChange = (criterion, rating) => {
    setEvaluation(prev => ({
      ...prev,
      [criterion]: rating
    }));
  };

  const handleFeedbackChange = (type, value) => {
    setFeedback(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const calculateAverageRating = () => {
    const ratings = Object.values(evaluation);
    return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
  };

  const isComplete = Object.values(evaluation).every(rating => rating > 0);

  const handleSubmit = (staffMember) => {
    const evaluationData = {
      staffMemberId: staffMember.id,
      evaluation,
      feedback,
      recommendation,
      timestamp: new Date().toISOString(),
      averageRating: calculateAverageRating(),
      evaluatedBy: 'current_user_id' // Should be replaced with actual user ID
    };
    
    onEvaluationSubmit(evaluationData);
  };

  return {
    evaluation,
    feedback,
    recommendation,
    evaluationCriteria,
    recommendationOptions,
    isComplete,
    averageRating: calculateAverageRating(),
    handleRatingChange,
    handleFeedbackChange,
    setRecommendation,
    handleSubmit
  };
};
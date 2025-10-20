import { useState, useEffect } from 'react';

// Helper para crear evaluación vacía
const getEmptyEvaluation = () => ({
  punctuality: 0,
  knowledge: 0,
  communication: 0,
  professionalism: 0,
  problemSolving: 0
});

// Constante para feedback por defecto
const DEFAULT_FEEDBACK = {
  strengths: '',
  improvements: '',
  additionalComments: ''
};

// Tipos de recomendación
const RECOMMENDATION_TYPES = {
  HIGHLY_RECOMMEND: 'highly-recommend',
  RECOMMEND: 'recommend',
  NEUTRAL: 'neutral',
  NOT_RECOMMEND: 'not-recommend'
};

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

  // Estados para datos de la API
  const [evaluationCriteria, setEvaluationCriteria] = useState([]);
  const [recommendationOptions, setRecommendationOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos desde la API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [criteriaRes, recommendationsRes] = await Promise.all([
          fetch('/api/evaluations/criteria'),
          fetch('/api/evaluations/recommendations')
        ]);

        const [criteria, recommendations] = await Promise.all([
          criteriaRes.json(),
          recommendationsRes.json()
        ]);

        if (criteria.success) {
          setEvaluationCriteria(criteria.data);
        }

        if (recommendations.success) {
          setRecommendationOptions(recommendations.data);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error loading evaluation data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
    const validRatings = ratings.filter(r => r > 0);

    if (validRatings.length === 0) return 0;

    return validRatings.reduce((sum, rating) => sum + rating, 0) / validRatings.length;
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
    handleSubmit,
    loading
  };
};

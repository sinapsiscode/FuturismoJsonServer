import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { CalendarIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

const AssignmentTourInfo = ({ 
  register, 
  errors, 
  availableTours,
  selectedTour,
  setSelectedTour,
  selectedDate,
  setSelectedDate 
}) => {
  const { t } = useTranslation();

  const handleTourChange = (e) => {
    const tourId = e.target.value;
    setSelectedTour(tourId);
    const tour = availableTours.find(t => t.id === tourId);
    if (tour) {
      register('tourName').onChange({ target: { value: tour.name } });
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">
        {t('providers.assignment.tourInfo')}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('providers.assignment.tour')} *
          </label>
          <select
            {...register('tourId', { required: true })}
            value={selectedTour}
            onChange={handleTourChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors.tourId ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">{t('providers.assignment.selectTour')}</option>
            {availableTours.map(tour => (
              <option key={tour.id} value={tour.id}>
                {tour.name}
              </option>
            ))}
          </select>
          {errors.tourId && (
            <p className="mt-1 text-sm text-red-600">
              {t('providers.assignment.tourRequired')}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <CalendarIcon className="w-4 h-4 inline mr-1" />
            {t('providers.assignment.date')} *
          </label>
          <input
            type="date"
            {...register('date', { required: true })}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors.date ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-600">
              {t('providers.assignment.dateRequired')}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <DocumentTextIcon className="w-4 h-4 inline mr-1" />
            {t('providers.assignment.notes')}
          </label>
          <textarea
            {...register('notes')}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder={t('providers.assignment.notesPlaceholder')}
          />
        </div>
      </div>

      <input type="hidden" {...register('tourName')} />
    </div>
  );
};

AssignmentTourInfo.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  availableTours: PropTypes.array.isRequired,
  selectedTour: PropTypes.string.isRequired,
  setSelectedTour: PropTypes.func.isRequired,
  selectedDate: PropTypes.string.isRequired,
  setSelectedDate: PropTypes.func.isRequired
};

export default AssignmentTourInfo;
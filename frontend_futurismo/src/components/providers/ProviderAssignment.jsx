import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { PlusIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import useProviderAssignment from '../../hooks/useProviderAssignment';
import AssignmentHeader from './AssignmentHeader';
import AssignmentTourInfo from './AssignmentTourInfo';
import AssignedProviderCard from './AssignedProviderCard';
import ProviderSearchFilters from './ProviderSearchFilters';
import AvailableProviderCard from './AvailableProviderCard';

const ProviderAssignment = ({ onClose, existingAssignment = null }) => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    errors,
    watch,
    selectedTour,
    setSelectedTour,
    selectedDate,
    setSelectedDate,
    selectedLocation,
    setSelectedLocation,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    assignedProviders,
    availableProviders,
    availableTours,
    locations,
    categories,
    handleAddProvider,
    handleRemoveProvider,
    handleProviderTimeChange,
    handleSaveAssignment,
    handleFinalizeAssignment,
    handleExportPDF
  } = useProviderAssignment(existingAssignment, onClose);

  return (
    <div className="modal-overlay p-4">
      <div className="modal-content w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <form onSubmit={handleSubmit(handleSaveAssignment)}>
            <AssignmentHeader
              isExisting={!!existingAssignment}
              onClose={onClose}
              onSave={handleSubmit(handleSaveAssignment)}
              onFinalize={handleFinalizeAssignment}
              onExport={handleExportPDF}
              hasProviders={assignedProviders.length > 0}
            />

            <AssignmentTourInfo
              register={register}
              errors={errors}
              availableTours={availableTours}
              selectedTour={selectedTour}
              setSelectedTour={setSelectedTour}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <UserGroupIcon className="w-5 h-5 mr-2" />
                  {t('providers.assignment.assignedProviders')} ({assignedProviders.length})
                </h3>
                
                {assignedProviders.length > 0 ? (
                  <div className="space-y-4">
                    {assignedProviders.map((provider, index) => (
                      <AssignedProviderCard
                        key={index}
                        provider={provider}
                        index={index}
                        onRemove={handleRemoveProvider}
                        onTimeChange={handleProviderTimeChange}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
                    <UserGroupIcon className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p>{t('providers.assignment.noProvidersAssigned')}</p>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">
                  {t('providers.assignment.availableProviders')}
                </h3>
                
                <ProviderSearchFilters
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  selectedLocation={selectedLocation}
                  setSelectedLocation={setSelectedLocation}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  locations={locations}
                  categories={categories}
                />

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {availableProviders.length > 0 ? (
                    availableProviders.map(provider => (
                      <AvailableProviderCard
                        key={provider.id}
                        provider={provider}
                        onAdd={() => handleAddProvider(provider)}
                      />
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>{t('providers.assignment.noProvidersAvailable')}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

ProviderAssignment.propTypes = {
  onClose: PropTypes.func.isRequired,
  existingAssignment: PropTypes.object
};

export default ProviderAssignment;
import React from 'react';
import PropTypes from 'prop-types';
import useGuideProfile from '../../hooks/useGuideProfile';
import ProfileHeader from './ProfileHeader';
import PersonalInfoCard from './PersonalInfoCard';
import GuideStatsCard from './GuideStatsCard';
import MuseumSpecializationCard from './MuseumSpecializationCard';
// import CompetenciesSummary from './CompetenciesSummary';

const GuideProfile = ({ guide, onClose, onEdit }) => {
  const {
    getInitials,
    getGuideTypeLabel,
    getGuideTypeColor,
    getLanguageInfo,
    getMuseumInfo,
    getLevelInfo,
    isActive,
    stats,
    languages,
    museums
  } = useGuideProfile(guide);

  return (
    <div className="p-0">
      <ProfileHeader
        guide={guide}
        initials={getInitials(guide?.fullName)}
        guideTypeLabel={getGuideTypeLabel(guide?.guideType)}
        guideTypeColor={getGuideTypeColor(guide?.guideType)}
        rating={stats.rating}
        onEdit={onEdit}
        onClose={onClose}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mt-4 sm:mt-6">
        {/* Left column - Personal information */}
        <div className="lg:col-span-1 space-y-4 sm:space-y-6">
          <PersonalInfoCard
            guide={guide}
            isActive={isActive}
          />

          <GuideStatsCard
            stats={stats}
          />
        </div>

        {/* Right column - Specializations */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <MuseumSpecializationCard
            museums={museums}
            getMuseumInfo={getMuseumInfo}
            getLevelInfo={getLevelInfo}
          />

        </div>
      </div>
    </div>
  );
};

GuideProfile.propTypes = {
  guide: PropTypes.shape({
    id: PropTypes.string,
    fullName: PropTypes.string,
    dni: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,
    address: PropTypes.string,
    guideType: PropTypes.string,
    status: PropTypes.string,
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string,
    stats: PropTypes.shape({
      toursCompleted: PropTypes.number,
      yearsExperience: PropTypes.number,
      certifications: PropTypes.number,
      rating: PropTypes.number
    }),
    specializations: PropTypes.shape({
      languages: PropTypes.array,
      museums: PropTypes.array
    })
  }),
  onClose: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired
};

export default GuideProfile;
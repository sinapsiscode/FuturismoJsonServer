import React, { useState } from 'react';
import PropTypes from 'prop-types';
import useGuideProfile from '../../hooks/useGuideProfile';
import ProfileHeader from './ProfileHeader';
import PersonalInfoCard from './PersonalInfoCard';
import GuideStatsCard from './GuideStatsCard';
import LanguageSpecializationCard from './LanguageSpecializationCard';
import MuseumSpecializationCard from './MuseumSpecializationCard';
// import CompetenciesSummary from './CompetenciesSummary';
import ExperienceSection from './ExperienceSection';
import BiographySection from './BiographySection';
import CertificationsModal from './CertificationsModal';
import { AcademicCapIcon, DocumentCheckIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const GuideProfileEnhanced = ({ guide, onClose, onEdit }) => {
  const [guideData, setGuideData] = useState(guide);
  const [showCertificationsModal, setShowCertificationsModal] = useState(false);
  
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
  } = useGuideProfile(guideData);

  // Actualizar datos del guía localmente
  const handleUpdateGuide = (updates) => {
    const updatedGuide = { ...guideData, ...updates };
    setGuideData(updatedGuide);
    
    // Aquí normalmente harías la llamada a la API
    // Por ahora solo mostramos un toast
    toast.success('Datos actualizados correctamente');
    
    // Si tienes una función onEdit del padre, úsala
    if (onEdit) {
      onEdit(updatedGuide);
    }
  };

  const handleUpdateCertifications = (certifications) => {
    handleUpdateGuide({ 
      certifications,
      stats: {
        ...guideData.stats,
        certifications: certifications.length
      }
    });
  };

  return (
    <div className="p-6">
      <ProfileHeader
        guide={guideData}
        initials={getInitials(guideData?.fullName)}
        guideTypeLabel={getGuideTypeLabel(guideData?.guideType)}
        guideTypeColor={getGuideTypeColor(guideData?.guideType)}
        rating={stats.rating}
        onEdit={onEdit}
        onClose={onClose}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Personal information */}
        <div className="lg:col-span-1 space-y-6">
          <PersonalInfoCard 
            guide={guideData} 
            isActive={isActive} 
          />
          
          <GuideStatsCard 
            stats={stats} 
          />

          {/* Botón para certificaciones */}
          <button
            onClick={() => setShowCertificationsModal(true)}
            className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <DocumentCheckIcon className="w-5 h-5 text-yellow-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Certificaciones</p>
                  <p className="text-sm text-gray-500">
                    {guideData?.certifications?.length || 0} certificaciones
                  </p>
                </div>
              </div>
              <AcademicCapIcon className="w-5 h-5 text-gray-400" />
            </div>
          </button>
        </div>

        {/* Right column - Specializations and new sections */}
        <div className="lg:col-span-2 space-y-6">
          {/* Nueva sección de experiencia */}
          <ExperienceSection 
            guide={guideData}
            onUpdate={handleUpdateGuide}
          />

          {/* Nueva sección de biografía */}
          <BiographySection
            guide={guideData}
            onUpdate={handleUpdateGuide}
          />

          <LanguageSpecializationCard
            languages={languages}
            getLanguageInfo={getLanguageInfo}
            getLevelInfo={getLevelInfo}
          />

          <MuseumSpecializationCard
            museums={museums}
            getMuseumInfo={getMuseumInfo}
            getLevelInfo={getLevelInfo}
          />

        </div>
      </div>

      {/* Modal de certificaciones */}
      <CertificationsModal
        isOpen={showCertificationsModal}
        onClose={() => setShowCertificationsModal(false)}
        certifications={guideData?.certifications || []}
        onUpdate={handleUpdateCertifications}
      />
    </div>
  );
};

GuideProfileEnhanced.propTypes = {
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
    professionalStartDate: PropTypes.string,
    biography: PropTypes.string,
    skills: PropTypes.array,
    certifications: PropTypes.array,
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
  onEdit: PropTypes.func
};

export default GuideProfileEnhanced;
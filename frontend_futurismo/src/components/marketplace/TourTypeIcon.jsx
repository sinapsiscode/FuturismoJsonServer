import PropTypes from 'prop-types';
import { 
  BuildingLibraryIcon,
  GlobeAltIcon,
  CakeIcon,
  SparklesIcon,
  CameraIcon
} from '@heroicons/react/24/solid';

const TourTypeIcon = ({ type, className = "h-5 w-5" }) => {
  const icons = {
    cultural: BuildingLibraryIcon,
    aventura: GlobeAltIcon,
    gastronomico: CakeIcon,
    mistico: SparklesIcon,
    fotografico: CameraIcon
  };

  const Icon = icons[type] || GlobeAltIcon;
  
  return <Icon className={className} />;
};

TourTypeIcon.propTypes = {
  type: PropTypes.string.isRequired,
  className: PropTypes.string
};

export default TourTypeIcon;
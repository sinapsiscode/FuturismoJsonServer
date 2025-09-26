import PropTypes from 'prop-types';
import useGuideMarketplaceCard from '../../hooks/useGuideMarketplaceCard';
import GuideCardHeader from './GuideCardHeader';
import GuideCardContent from './GuideCardContent';
import GuideListItem from './GuideListItem';

const GuideMarketplaceCard = ({ guide, onSelect, layout = 'grid' }) => {
  const {
    isFavorite,
    displayLanguages,
    workZoneNames,
    yearsExperience,
    handleFavoriteToggle,
    handleCardClick
  } = useGuideMarketplaceCard(guide, onSelect);

  if (layout === 'list') {
    return (
      <div 
        className="bg-white rounded-lg shadow hover:shadow-md transition-all cursor-pointer p-6"
        onClick={handleCardClick}
      >
        <GuideListItem
          guide={guide}
          isFavorite={isFavorite}
          onFavoriteToggle={handleFavoriteToggle}
          displayLanguages={displayLanguages}
          workZoneNames={workZoneNames}
          yearsExperience={yearsExperience}
        />
      </div>
    );
  }

  return (
    <div 
      className="bg-white rounded-lg shadow hover:shadow-lg transition-all cursor-pointer overflow-hidden group"
      onClick={handleCardClick}
    >
      <GuideCardHeader
        guide={guide}
        isFavorite={isFavorite}
        onFavoriteToggle={handleFavoriteToggle}
        displayLanguages={displayLanguages}
      />
      <GuideCardContent guide={guide} />
    </div>
  );
};

GuideMarketplaceCard.propTypes = {
  guide: PropTypes.object.isRequired,
  onSelect: PropTypes.func,
  layout: PropTypes.oneOf(['grid', 'list'])
};

export default GuideMarketplaceCard;
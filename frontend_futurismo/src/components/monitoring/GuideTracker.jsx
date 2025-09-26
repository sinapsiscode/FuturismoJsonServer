import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import useGuideTracker from '../../hooks/useGuideTracker';
import GuideHeader from './GuideHeader';
import GuideInfo from './GuideInfo';
import GuideActivity from './GuideActivity';
import GuideStats from './GuideStats';
import { TABS } from '../../constants/monitoringConstants';

const GuideTracker = ({ guide }) => {
  const { t } = useTranslation();
  const {
    guide: guideData,
    activeTab,
    setActiveTab,
    getSignalColor,
    getBatteryColor
  } = useGuideTracker(guide);

  const tabs = [
    { id: TABS.INFO, label: t('monitoring.guide.tabs.info') },
    { id: TABS.ACTIVITY, label: t('monitoring.guide.tabs.activity') },
    { id: TABS.STATS, label: t('monitoring.guide.tabs.stats') }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <GuideHeader 
        guide={guideData}
        getBatteryColor={getBatteryColor}
        getSignalColor={getSignalColor}
      />

      <div className="border-b border-gray-200">
        <div className="flex">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id 
                  ? 'border-primary-500 text-primary-600' 
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {activeTab === TABS.INFO && <GuideInfo guide={guideData} />}
        {activeTab === TABS.ACTIVITY && <GuideActivity recentActivity={guideData.recentActivity} />}
        {activeTab === TABS.STATS && <GuideStats stats={guideData.stats} />}
      </div>
    </div>
  );
};

GuideTracker.propTypes = {
  guide: PropTypes.object
};

export default GuideTracker;
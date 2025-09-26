import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { formatters } from '../../utils/formatters';

const GuideInfo = ({ guide }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-gray-600">{t('monitoring.guide.lastUpdate')}</p>
        <p className="font-medium">{formatters.formatDateTime(guide.device.lastUpdate)}</p>
      </div>
      <div>
        <p className="text-sm text-gray-600">{t('monitoring.guide.deviceStatus')}</p>
        <div className="mt-2 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">{t('monitoring.guide.gps')}</span>
            <span className={`flex items-center gap-1 text-sm font-medium ${guide.deviceStatus.gps.color}`}>
              <guide.deviceStatus.gps.icon className="w-4 h-4" />
              {t(guide.deviceStatus.gps.active ? 'monitoring.guide.active' : 'monitoring.guide.inactive')}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">{t('monitoring.guide.internetConnection')}</span>
            <span className={`flex items-center gap-1 text-sm font-medium ${guide.deviceStatus.internet.color}`}>
              <guide.deviceStatus.internet.icon className="w-4 h-4" />
              {t(guide.deviceStatus.internet.active ? 'monitoring.guide.connected' : 'monitoring.guide.disconnected')}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">{t('monitoring.guide.batterySaverMode')}</span>
            <span className={`flex items-center gap-1 text-sm font-medium ${guide.deviceStatus.batterySaver.color}`}>
              <guide.deviceStatus.batterySaver.icon className="w-4 h-4" />
              {t(guide.deviceStatus.batterySaver.active ? 'monitoring.guide.enabled' : 'monitoring.guide.disabled')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

GuideInfo.propTypes = {
  guide: PropTypes.object.isRequired
};

export default GuideInfo;
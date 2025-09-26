import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { 
  EnvelopeIcon,
  BoltIcon,
  SignalIcon,
  ClockIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { formatters } from '../../utils/formatters';
import { GUIDE_STATUS, PROGRESS_CIRCLE } from '../../constants/monitoringConstants';

const GuideHeader = ({ guide, getBatteryColor, getSignalColor }) => {
  const { t } = useTranslation();

  return (
    <div className="p-6 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={guide.avatar}
              alt={guide.name}
              className="w-16 h-16 rounded-full"
            />
            <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
              guide.status === GUIDE_STATUS.ACTIVE ? 'bg-green-500' : 'bg-gray-400'
            }`} />
          </div>
          <div>
            <h3 className="text-xl font-semibold">{guide.name}</h3>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <EnvelopeIcon className="w-4 h-4" />
                <span>{guide.email}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className={`flex items-center gap-1 ${getBatteryColor(guide.device.battery)}`}>
              <BoltIcon className="w-5 h-5" />
              <span className="font-semibold">{guide.device.battery}%</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">{t('monitoring.guide.battery')}</p>
          </div>
          <div className="text-center">
            <div className={`flex items-center gap-1 ${getSignalColor(guide.device.signal)}`}>
              <SignalIcon className="w-5 h-5" />
              <span className="font-semibold capitalize">{t(`monitoring.guide.signal.${guide.device.signal}`)}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">{t('monitoring.guide.signal.label')}</p>
          </div>
        </div>
      </div>

      {guide.currentTour && (
        <div className="mt-4 p-4 bg-primary-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-primary-900">{t('monitoring.guide.currentTour')}</p>
              <p className="text-lg font-semibold text-primary-800">{guide.currentTour.name}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-primary-700">
                <div className="flex items-center gap-1">
                  <ClockIcon className="w-4 h-4" />
                  <span>{t('monitoring.guide.startTime')}: {formatters.formatTime(guide.currentTour.startTime)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <UserIcon className="w-4 h-4" />
                  <span>{guide.currentTour.tourists} {t('monitoring.guide.tourists')}</span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle
                    cx={PROGRESS_CIRCLE.cx}
                    cy={PROGRESS_CIRCLE.cy}
                    r={PROGRESS_CIRCLE.r}
                    stroke="#E5E7EB"
                    strokeWidth={PROGRESS_CIRCLE.strokeWidth}
                    fill="none"
                  />
                  <circle
                    cx={PROGRESS_CIRCLE.cx}
                    cy={PROGRESS_CIRCLE.cy}
                    r={PROGRESS_CIRCLE.r}
                    stroke="#1E40AF"
                    strokeWidth={PROGRESS_CIRCLE.strokeWidth}
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * PROGRESS_CIRCLE.r}`}
                    strokeDashoffset={`${2 * Math.PI * PROGRESS_CIRCLE.r * (1 - guide.currentTour.progress / 100)}`}
                    className="transition-all duration-500"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold">
                  {guide.currentTour.progress}%
                </span>
              </div>
              <p className="text-xs text-primary-700 mt-1">{t('monitoring.guide.progress')}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

GuideHeader.propTypes = {
  guide: PropTypes.object.isRequired,
  getBatteryColor: PropTypes.func.isRequired,
  getSignalColor: PropTypes.func.isRequired
};

export default GuideHeader;
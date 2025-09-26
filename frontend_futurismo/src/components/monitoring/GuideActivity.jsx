import PropTypes from 'prop-types';
import { formatters } from '../../utils/formatters';

const GuideActivity = ({ recentActivity }) => {
  return (
    <div className="space-y-3">
      {recentActivity.map((activity) => (
        <div key={activity.id} className="flex items-start gap-3">
          <div className={`mt-1 ${activity.color}`}>
            <activity.icon className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{activity.message}</p>
            <p className="text-xs text-gray-500">{formatters.formatRelativeTime(activity.time)}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

GuideActivity.propTypes = {
  recentActivity: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default GuideActivity;
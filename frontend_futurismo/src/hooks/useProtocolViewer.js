import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../stores/authStore';
import { PRIORITY_COLORS, CONTACT_TYPES, PRIORITY_LEVELS } from '../constants/emergencyConstants';

const useProtocolViewer = (protocol) => {
  const { t } = useTranslation();
  const { user } = useAuthStore();

  const getPriorityColor = (priority) => {
    return PRIORITY_COLORS[priority] || PRIORITY_COLORS.default;
  };

  const getContactType = (type) => {
    return CONTACT_TYPES[type] || 'default';
  };

  const getPriorityLevel = (priority) => {
    return PRIORITY_LEVELS[priority] || 'default';
  };

  const importantReminders = [
    t('emergency.protocol.stayCalm'),
    t('emergency.protocol.touristSafety'),
    t('emergency.protocol.documentIncidents'),
    t('emergency.protocol.contactCoordinator'),
    t('emergency.protocol.followProtocols')
  ];

  const stats = {
    steps: protocol?.content?.steps?.length || 0,
    contacts: protocol?.content?.contacts?.length || 0,
    materials: protocol?.content?.materials?.length || 0,
    priority: protocol?.priority
  };

  const canEdit = user?.role === 'admin';

  return {
    t,
    user,
    getPriorityColor,
    getContactType,
    getPriorityLevel,
    importantReminders,
    stats,
    canEdit
  };
};

export default useProtocolViewer;
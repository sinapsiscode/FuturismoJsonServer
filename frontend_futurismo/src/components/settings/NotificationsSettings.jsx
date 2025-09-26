import React, { useState } from 'react';
import { 
  BellIcon,
  EnvelopeIcon,
  PhoneIcon,
  DevicePhoneMobileIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { useSettingsStore } from '../../stores/settingsStore';
import { useTranslation } from 'react-i18next';
import { NOTIFICATION_CHANNELS, NOTIFICATION_TYPES, CHANNEL_COLORS } from '../../constants/settingsConstants';

const NotificationsSettings = () => {
  const { t } = useTranslation();
  const { 
    settings,
    updateNotificationsSettings,
    hasUnsavedChanges,
    saveSettings,
    isLoading
  } = useSettingsStore();

  const [formData, setFormData] = useState(settings.notifications || {});

  const handleChannelToggle = (channel, enabled) => {
    setFormData(prev => ({
      ...prev,
      [channel]: {
        ...prev[channel] || {},
        enabled
      }
    }));
  };

  const handleNotificationToggle = (channel, notification, enabled) => {
    setFormData(prev => ({
      ...prev,
      [channel]: {
        ...prev[channel] || {},
        [notification]: enabled
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    updateNotificationsSettings(formData);
    await saveSettings();
  };

  const notificationTypes = [
    { key: NOTIFICATION_TYPES.NEW_RESERVATION, label: t('settings.notifications.types.newReservation'), description: t('settings.notifications.types.newReservationDesc') },
    { key: NOTIFICATION_TYPES.CANCELLATION, label: t('settings.notifications.types.cancellation'), description: t('settings.notifications.types.cancellationDesc') },
    { key: NOTIFICATION_TYPES.REMINDER_24H, label: t('settings.notifications.types.reminder24h'), description: t('settings.notifications.types.reminder24hDesc') },
    { key: NOTIFICATION_TYPES.REMINDER_2H, label: t('settings.notifications.types.reminder2h'), description: t('settings.notifications.types.reminder2hDesc') },
    { key: NOTIFICATION_TYPES.TOUR_COMPLETE, label: t('settings.notifications.types.tourComplete'), description: t('settings.notifications.types.tourCompleteDesc') },
    { key: NOTIFICATION_TYPES.PAYMENT_RECEIVED, label: t('settings.notifications.types.paymentReceived'), description: t('settings.notifications.types.paymentReceivedDesc') },
    { key: NOTIFICATION_TYPES.LOW_CREDIT, label: t('settings.notifications.types.lowCredit'), description: t('settings.notifications.types.lowCreditDesc') },
    { key: NOTIFICATION_TYPES.SYSTEM_ALERTS, label: t('settings.notifications.types.systemAlerts'), description: t('settings.notifications.types.systemAlertsDesc') }
  ];

  const channels = [
    {
      key: NOTIFICATION_CHANNELS.EMAIL,
      label: t('settings.notifications.channels.email'),
      icon: EnvelopeIcon,
      color: CHANNEL_COLORS.EMAIL,
      description: t('settings.notifications.channels.emailDesc')
    },
    {
      key: NOTIFICATION_CHANNELS.SMS,
      label: t('settings.notifications.channels.sms'),
      icon: PhoneIcon,
      color: CHANNEL_COLORS.SMS,
      description: t('settings.notifications.channels.smsDesc')
    },
    {
      key: NOTIFICATION_CHANNELS.PUSH,
      label: t('settings.notifications.channels.push'),
      icon: DevicePhoneMobileIcon,
      color: CHANNEL_COLORS.PUSH,
      description: t('settings.notifications.channels.pushDesc')
    },
    {
      key: NOTIFICATION_CHANNELS.WHATSAPP,
      label: t('settings.notifications.channels.whatsapp'),
      icon: ChatBubbleLeftRightIcon,
      color: CHANNEL_COLORS.WHATSAPP,
      description: t('settings.notifications.channels.whatsappDesc')
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center mb-6">
          <BellIcon className="h-6 w-6 text-blue-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">
            {t('settings.notifications.title')}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Configuración por canal */}
          {channels.map((channel) => (
            <div key={channel.key} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <channel.icon className={`h-6 w-6 text-${channel.color}-600 mr-3`} />
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">
                      {channel.label}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {channel.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData[channel.key]?.enabled || false}
                      onChange={(e) => handleChannelToggle(channel.key, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              {formData[channel.key]?.enabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
                  {notificationTypes.map((notificationType) => {
                    // Solo mostrar notificaciones específicas para SMS
                    if (channel.key === NOTIFICATION_CHANNELS.SMS && 
                        ![NOTIFICATION_TYPES.CANCELLATION, NOTIFICATION_TYPES.REMINDER_2H, NOTIFICATION_TYPES.EMERGENCY_ONLY].includes(notificationType.key)) {
                      return null;
                    }
                    
                    // Solo mostrar notificaciones específicas para WhatsApp
                    if (channel.key === NOTIFICATION_CHANNELS.WHATSAPP && 
                        ![NOTIFICATION_TYPES.NEW_RESERVATION, NOTIFICATION_TYPES.REMINDER_24H, NOTIFICATION_TYPES.TOUR_COMPLETE].includes(notificationType.key)) {
                      return null;
                    }

                    // Agregar emergencyOnly solo para SMS
                    if (channel.key === NOTIFICATION_CHANNELS.SMS && notificationType.key === NOTIFICATION_TYPES.EMERGENCY_ONLY) {
                      return (
                        <div key={NOTIFICATION_TYPES.EMERGENCY_ONLY} className="flex items-center justify-between">
                          <div>
                            <label className="text-sm font-medium text-gray-700">
                              {t('settings.notifications.types.emergencyOnly')}
                            </label>
                            <p className="text-xs text-gray-500">
                              {t('settings.notifications.types.emergencyOnlyDesc')}
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            checked={formData[channel.key]?.emergencyOnly || false}
                            onChange={(e) => handleNotificationToggle(channel.key, NOTIFICATION_TYPES.EMERGENCY_ONLY, e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </div>
                      );
                    }

                    if (formData[channel.key]?.[notificationType.key] !== undefined) {
                      return (
                        <div key={notificationType.key} className="flex items-center justify-between">
                          <div>
                            <label className="text-sm font-medium text-gray-700">
                              {notificationType.label}
                            </label>
                            <p className="text-xs text-gray-500">
                              {notificationType.description}
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            checked={formData[channel.key]?.[notificationType.key] || false}
                            onChange={(e) => handleNotificationToggle(channel.key, notificationType.key, e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              )}

              {!formData[channel.key]?.enabled && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500 text-center py-4">
                    {t('settings.notifications.channelDisabled', { channel: channel.label.toLowerCase() })}
                  </p>
                </div>
              )}
            </div>
          ))}

          {/* Información adicional */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <BellIcon className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <h4 className="font-medium mb-1">{t('settings.notifications.infoTitle')}</h4>
                <ul className="space-y-1">
                  <li>• {t('settings.notifications.infoEmail')}</li>
                  <li>• {t('settings.notifications.infoSms')}</li>
                  <li>• {t('settings.notifications.infoPush')}</li>
                  <li>• {t('settings.notifications.infoWhatsapp')}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={() => setFormData(settings.notifications)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              disabled={isLoading}
            >
              {t('common.cancel')}
            </button>
            
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? t('common.saving') : t('common.saveChanges')}
            </button>
          </div>
        </form>

        {hasUnsavedChanges && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              {t('settings.notifications.unsavedChanges')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsSettings;
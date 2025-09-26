import { STATUS_BADGE_COLORS, PAYMENT_BADGE_COLORS } from '../constants/reservationConstants';

export const getStatusBadge = (status) => {
  return STATUS_BADGE_COLORS[status] || STATUS_BADGE_COLORS.default;
};

export const getPaymentBadge = (status) => {
  return PAYMENT_BADGE_COLORS[status] || PAYMENT_BADGE_COLORS.default;
};

export const canRateService = (reservation) => {
  return reservation.status === 'completada' && !reservation.isRated;
};
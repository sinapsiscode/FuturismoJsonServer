/**
 * Central export point for all constants
 * This file provides a convenient way to import constants from a single location
 */

// Shared constants
export * from './sharedConstants';

// Module-specific constants
export * from './emergencyConstants';
export * from './feedbackConstants';
export * from './guidesConstants';
export * from './layoutConstants';
export * from './marketplaceConstants';
export * from './monitoringConstants';
export * from './profileConstants';
export * from './providersConstants';
export * from './ratingsConstants';
export * from './reservationConstants';
export * from './settingsConstants';
export * from './usersConstants';

// Default export with organized constants by module
export default {
  shared: require('./sharedConstants'),
  emergency: require('./emergencyConstants'),
  feedback: require('./feedbackConstants'),
  guides: require('./guidesConstants'),
  layout: require('./layoutConstants'),
  marketplace: require('./marketplaceConstants'),
  monitoring: require('./monitoringConstants'),
  profile: require('./profileConstants'),
  providers: require('./providersConstants'),
  ratings: require('./ratingsConstants'),
  reservation: require('./reservationConstants'),
  settings: require('./settingsConstants'),
  users: require('./usersConstants')
};
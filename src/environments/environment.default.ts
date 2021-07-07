import { overrides } from './environment.local';
import { ENVIRONMENT_DEFAULTS, Environment } from './environment.model';

export const environment: Environment = {
  ...ENVIRONMENT_DEFAULTS,

  icmChannel: 'inSPIRED-inTRONICS-Site',

  theme: 'default',

  features: ['compare', 'recently', 'rating', 'guestCheckout', 'wishlists'],

  ...overrides,
};

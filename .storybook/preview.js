import { app } from '@storybook/vue3';

import '../src/styles/main.scss';

export const parameters = {
  backgrounds: {
    default: 'default',
    values: [
      {
        name: 'default',
        value: 'linear-gradient(89deg, #ff5edf 0%, #04c8de 100%)'
      }
    ]
  },
  layout: 'centered'
};

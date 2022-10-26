const path = require('path');

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions'
  ],
  framework: '@storybook/vue3',
  core: {
    builder: '@storybook/builder-vite'
  },
  features: {
    storyStoreV7: false
  },

  async viteFinal(
    /**
     * @type {import('vite').UserConfig}
     */
    config
  ) {
    config.resolve = {
      alias: {
        '@':  `${path.resolve(__dirname, '../src')}`,
        'vue': 'vue/dist/vue.esm-bundler.js'
      }
    };

    // config.css = {
    //   preprocessorOptions: {
    //     scss: {
    //       additionalData: `@import '../src/styles/main.scss';`
    //     }
    //   }
    // }

    return config;
  }
};

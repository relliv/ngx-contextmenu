import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  framework: {
    name: '@storybook/angular',
    options: {},
  },

  stories: ['../**/*.@(mdx|stories.@(js|jsx|ts|tsx))'],

  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-mdx-gfm',
  ],
  staticDirs: [
    './public',
    {
      from: '../src/stories/assets',
      to: '/assets',
    },
  ],

  docs: {},
};

export default config;

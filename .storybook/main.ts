import { StorybookConfig } from '@storybook/core-common';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-controls',
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    // '@storybook/addon-interactions',
    '@storybook/preset-scss',
    {
      name: '@storybook/addon-docs',
      options: {
        configureJSX: true,
        babelOptions: {},
        sourceLoaderOptions: null,
        transcludeMarkdown: true,
      },
    },
  ],
  framework: '@storybook/angular',
  staticDirs: ['./public'],
  core: {
    builder: 'webpack5',
  },
};

module.exports = config;

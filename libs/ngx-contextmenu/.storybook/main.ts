import type { StorybookConfig } from '@storybook/angular';
import remarkGfm from 'remark-gfm';

const config: StorybookConfig = {
  framework: {
    name: '@storybook/angular',
    options: {},
  },

  stories: ['../**/*.@(mdx|stories.@(js|jsx|ts|tsx))'],

  addons: [
    {
      name: '@storybook/addon-docs',
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      },
    },
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

import { StorybookConfig } from '@storybook/angular';
import remarkGfm from 'remark-gfm';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    // '@storybook/addon-controls',
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
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      },
    },
  ],
  framework: {
    name: '@storybook/angular',
    options: {},
  },
  staticDirs: [
    './public',
    {
      from: '../src/stories/assets',
      to: '/assets',
    },
  ],
  core: {},
  features: {
    // modernInlineRender: true,
  },
  docs: {
    autodocs: 'tag',
  },
};
module.exports = config;

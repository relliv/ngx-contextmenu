import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming';
// @ts-expect-error TS2307
import logo from './theme/assets/logo.jpg';

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: '@perfectmemory/ngx-contextmenu',
    brandUrl: '/',
    brandImage: logo,
  }),
  isToolshown: false,
});

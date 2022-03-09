import { addons } from '@storybook/addons';
import { create } from '@storybook/theming';
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

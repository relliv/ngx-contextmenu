import { ContextMenuModule } from '@perfectmemory/ngx-contextmenu';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import NgxContextMenuComponent from './ngx-contextmenu/ngx-contextmenu.component';

export default {
  title: 'Context Menu/Demo',
  component: NgxContextMenuComponent,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/angular/configure/story-layout
    layout: 'centered',
  },
  decorators: [
    moduleMetadata({
      imports: [ContextMenuModule],
    }),
  ],
  argTypes: {
    dir: {
      name: 'Direction',
      description:
        'Defines the orientation of the context menu, left-to-right or right-to-left',
      options: ['left-to-right', 'right-to-left'],
      mapping: {
        'left-to-right': 'ltr',
        'right-to-left': 'rtl',
      },
      control: { type: 'radio' },
    },
    onMenuItemExecuted: {
      action: 'From the context menu, you chose',
      table: {
        disable: true,
      },
    },
    menuClass: {
      description: 'CSS class to apply to the menu',
      options: ['none', 'custom-theme-blue'],
      control: { type: 'select' },
    },
    onOpen: {
      action: 'Context menu was opened',
      table: {
        disable: true,
      },
    },
    onClose: {
      action: 'Context menu was closed',
      table: {
        disable: true,
      },
    },
    close: {
      table: {
        disable: true,
      },
    },
    open: {
      table: {
        disable: true,
      },
    },
    execute: {
      table: {
        disable: true,
      },
    },
    demoMode: {
      table: {
        disable: true,
      },
    },
  },
} as Meta;

const Template: Story<NgxContextMenuComponent> = (
  args: NgxContextMenuComponent
) => ({
  styles: ['./assets/stylesheets/index.scss'],
  props: args,
});

export const Simple = Template.bind({});
export const Form = Template.bind({});
Form.args = {
  demoMode: 'form',
};

// [] Divider --> Separator
// [] Update change log

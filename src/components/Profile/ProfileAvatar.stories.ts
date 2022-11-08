import { ArgTypes, Story } from '@storybook/vue3';

import ProfileAvatar from './ProfileAvatar.vue';

export default {
  title: 'ProfileAvatar',
  component: ProfileAvatar
};

const Template: Story = (args) => ({
  components: { ProfileAvatar },
  setup() {
    return { args };
  },
  template: `<ProfileAvatar :name="args.name"/>`
});

export const Default: Story = Template.bind({});
Default.args = {
  name: 'Paul'
};
Default.argTypes = {
  name: {
    description: 'The logged in user name'
  }
} as ArgTypes;

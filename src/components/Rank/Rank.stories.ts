import { ArgTypes, Story } from '@storybook/vue3';
import Rank from './Rank.vue';

export default {
  title: 'Rank',
  component: Rank
};

const Template: Story = (args) => ({
  components: { Rank },
  setup() {
    return { args };
  },
  template: `<Rank :user="args.user" :userRank="args.userRank"/>`
});

export const Default = Template.bind({});

Default.args = {
  user: {
    id: '1',
    name: 'Paul',
    email: 'test@test.com',
    entries: 1,
    joined: '2021-04-09T00:00:00.000Z',
    pet: 'Ruby',
    age: 37
  },
  userRank: '😀'
};
Default.argTypes = {
  user: {
    description: 'The current logged in user'
  },
  userRank: {
    description: 'The rank of the user'
  }
} as ArgTypes;

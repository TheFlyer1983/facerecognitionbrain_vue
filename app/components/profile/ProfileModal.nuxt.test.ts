import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime';
import { createTestingPinia } from '@pinia/testing';
import { useUserStore } from '~/stores/user';
import ProfileModal from './ProfileModal.vue';

const { navigateToMock } = vi.hoisted(() => ({
  navigateToMock: vi.fn()
}));

mockNuxtImport('navigateTo', () => navigateToMock);

const createPinia = (overrides = {}) =>
  createTestingPinia({
    createSpy: vi.fn,
    stubActions: true,
    initialState: {
      UserStore: {
        isProfileOpen: true,
        user: {
          name: 'Test User',
          entries: 5,
          joined: '2024-01-01T00:00:00.000Z',
          age: 30,
          pet: 'Dog'
        },
        ...overrides
      }
    }
  });

const render = async (overrides = {}) => {
  const pinia = createPinia(overrides);
  const component = await mountSuspended(ProfileModal, {
    global: { plugins: [pinia] }
  });
  const store = useUserStore(pinia);
  return { component, store };
};

describe('Given the ProfileModal component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders user information', async () => {
    const { component } = await render();

    expect(component.text()).toContain('Test User');
    expect(component.text()).toContain('Images Submitted: 5');
    expect(component.findComponent({ name: 'ProfileAvatar' }).exists()).toBe(
      true
    );
  });

  it('updates changed fields and closes modal when save is clicked', async () => {
    const { component, store } = await render();

    await component.find('#name').setValue('Updated Name');
    await component.find('[data-test="save-profile"]').trigger('click');

    expect(store.updateUser).toHaveBeenCalledWith({ name: 'Updated Name' });
    expect(store.isProfileOpen).toBe(false);
  });

  it('does not call updateUser when nothing changed and closes modal', async () => {
    const { component, store } = await render();

    await component.find('[data-test="save-profile"]').trigger('click');

    expect(store.updateUser).not.toHaveBeenCalled();
    expect(store.isProfileOpen).toBe(false);
  });

  it('closes modal when cancel is clicked in profile form', async () => {
    const { component, store } = await render();

    await component.find('[data-test="cancel-profile"]').trigger('click');

    expect(store.isProfileOpen).toBe(false);
  });

  it('closes modal when close icon is clicked', async () => {
    const { component, store } = await render();

    await component.find('[data-test="close-profile"]').trigger('click');

    expect(store.isProfileOpen).toBe(false);
  });

  it('updates multiple changed fields in a single save', async () => {
    const { component, store } = await render();

    await component.find('#name').setValue('Updated Name');
    await component.find('#age').setValue('31');
    await component.find('#pet').setValue('Cat');
    await component.find('[data-test="save-profile"]').trigger('click');

    expect(store.updateUser).toHaveBeenCalledWith({
      name: 'Updated Name',
      age: 31,
      pet: 'Cat'
    });
  });

  it('only sends changed fields in update payload', async () => {
    const { component, store } = await render();

    await component.find('#name').setValue('Test User');
    await component.find('#pet').setValue('Cat');
    await component.find('[data-test="save-profile"]').trigger('click');

    expect(store.updateUser).toHaveBeenCalledWith({ pet: 'Cat' });
  });

  it('opens delete confirmation and closes modal when delete is cancelled', async () => {
    const { component, store } = await render();

    await component.find('[data-test="delete"]').trigger('click');
    expect(component.find('[data-test="confirm"]').exists()).toBe(true);

    await component.find('[data-test="cancel-delete"]').trigger('click');
    expect(store.isProfileOpen).toBe(false);
  });

  it('shows confirmation view and hides delete button after delete is clicked', async () => {
    const { component } = await render();

    const confirm = () => component.find('[data-test="confirm"]');
    const deleteButton = () => component.find('[data-test="delete"]');

    expect(confirm().exists()).toBe(false);
    expect(deleteButton().exists()).toBe(true);
    await component.find('[data-test="delete"]').trigger('click');
    expect(confirm().exists()).toBe(true);
    expect(deleteButton().exists()).toBe(false);
  });

  it('deletes user and navigates to login when confirmed', async () => {
    const { component, store } = await render();

    await component.find('[data-test="delete"]').trigger('click');
    await component.find('[data-test="confirm"]').trigger('click');

    expect(store.deleteUser).toHaveBeenCalled();
    expect(navigateToMock).toHaveBeenCalledWith('/login');
  });
});

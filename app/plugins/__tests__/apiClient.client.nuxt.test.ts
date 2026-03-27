import MockAdapter from 'axios-mock-adapter';

describe('Given the apiClient plugin', () => {
  let store: ReturnType<typeof useUserStore>;
  let $api: ReturnType<typeof useNuxtApp>['$api'];

  beforeEach(() => {
    store = useUserStore();
    ({ $api } = useNuxtApp());
    store.token = null;
  });

  it('should provide the $api function', () => {
    expect($api).toBeDefined();
    expect(typeof $api).toBe('function');
  });

  it('should return an axios instance', () => {
    const client = $api();
    expect(client).toBeDefined();
    expect(client.interceptors).toBeDefined();
  });

  describe('when a request is made with a token', () => {
    beforeEach(() => {
      store.token = 'valid-token';
    });

    it('should set the Authorization header', async () => {
      const client = $api();
      const mock = new MockAdapter(client);
      mock.onGet('/test').reply(200);

      await client.get('/test');

      expect(mock.history.get[0]?.headers?.Authorization).toBe('valid-token');
      mock.restore();
    });
  });

  describe('when a request is made without a token', () => {
    it('should not set the Authorization header', async () => {
      store.token = null;
      const client = $api();
      const mock = new MockAdapter(client);
      mock.onGet('/test').reply(200);

      await client.get('/test');

      expect(mock.history.get[0]?.headers?.Authorization).toBeUndefined();
      mock.restore();
    });
  });
});

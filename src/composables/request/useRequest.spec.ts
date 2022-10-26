import { defineComponent, watch } from 'vue';
import { shallowMount, VueWrapper } from '@vue/test-utils';

import request from '@/functions/request';
import useRequest from './useRequest';

vi.mock('@/functions/request');

describe('Given the `useRequest` composable', () => {
  const watchIsLoadingCallback = vi.fn();
  const dataMock = { property: 'value' };
  const TestComponent = (...config: Parameters<typeof useRequest>) =>
    defineComponent({
      name: 'TestComponent',
      setup() {
        const request = useRequest<typeof dataMock>(...config);

        watch(request.isLoading, watchIsLoadingCallback);

        return request;
      },
      template: '<div>Test</div>'
    });
  let wrapper: VueWrapper<InstanceType<ReturnType<typeof TestComponent>>>;

  const requestMock: Partial<Awaited<ReturnType<typeof request>>> = {
    data: dataMock
  };
  const givenConfig: Parameters<typeof useRequest>[0] = {
    config: {
      method: 'POST',
      url: '/url',
      data: {}
    },
    onSuccess: vi.fn(),
    onCatch: vi.fn(),
    onFulfill: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  beforeAll(() => {
    vi.mocked(request).mockResolvedValue(
      requestMock as Awaited<ReturnType<typeof request>>
    );
  });

  describe('when it is called', () => {
    beforeEach(() => {
      wrapper = shallowMount(TestComponent(givenConfig));
    });

    it('should NOT make the request', () => {
      expect(request).not.toHaveBeenCalled();
    });

    it('should have the correct `data` value', () => {
      expect(wrapper.vm.data).toBeNull();
    });

    describe('and when the request is validated', () => {
      beforeEach(async () => {
        await wrapper.vm.validate();
      });

      it('should make the correct request', () => {
        expect(request).toHaveBeenCalledWith(givenConfig.config);
      });

      it('should update the `data` value', () => {
        expect(wrapper.vm.data).toStrictEqual(requestMock.data);
      });

      it('should call the `onSuccess` callback', () => {
        expect(givenConfig.onSuccess).toHaveBeenCalledWith(requestMock.data);
      });

      it('should call the `onFulfill` callback', () => {
        expect(givenConfig.onFulfill).toHaveBeenCalledWith();
      });

      it('should change the loading state correctly initially', () => {
        expect(watchIsLoadingCallback).toHaveBeenNthCalledWith(
          1,
          true,
          false,
          expect.any(Function)
        );
      });

      it('should change the loading state correctly initially', () => {
        expect(watchIsLoadingCallback).toHaveBeenNthCalledWith(
          2,
          false,
          true,
          expect.any(Function)
        );
      });

      describe('and when the request was NOT successful', () => {
        const givenError = new Error('Given error description');

        beforeAll(() => {
          vi.mocked(request).mockRejectedValue(givenError);
        });

        it('it should make the correct request', () => {
          expect(request).toHaveBeenCalledWith(givenConfig.config);
        });

        it('should NOT call the `onSuccess` callback', () => {
          expect(givenConfig.onSuccess).not.toHaveBeenCalled();
        });

        it('should call the `onCatch` callback', () => {
          expect(givenConfig.onCatch).toHaveBeenCalledWith(givenError);
        });

        it('should call the `onFulfill` callback', () => {
          expect(givenConfig.onFulfill).toHaveBeenCalledWith();
        });
      });
    });
  });

  describe('when the `validation on mount` flag is active', () => {
    const givenConfigWithValidationOnMount = {
      ...givenConfig,
      validateOnMount: true
    };

    beforeEach(() => {
      wrapper = shallowMount(TestComponent(givenConfigWithValidationOnMount));
    });

    it('should mak ethe correct request', () => {
      expect(request).toHaveBeenCalledWith(
        givenConfigWithValidationOnMount.config
      );
    });
  });
});

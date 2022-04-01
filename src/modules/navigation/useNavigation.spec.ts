import { reactive } from 'vue';
import { beforeAll, beforeEach, describe, expect, vi, it } from 'vitest';
import { useRouter, Router } from 'vue-router';

import useNavigation from './useNavigation';

vi.mock('vue-router');

const mockedUseRouter = vi.mocked<() => Partial<Router>>(useRouter);

describe('Given the useNavigation hook', () => {
  const pushMock = vi.fn();

  beforeAll(() => {
    mockedUseRouter.mockReturnValue({ push: pushMock });
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('when it is called and route not empty', () => {
    // const route = reactive<{ name: string | null }>({ name: null });
    const routeMock = '/expected-route';
    let result: ReturnType<typeof useNavigation>

    beforeEach(() => {
      result = useNavigation();
    })

    describe('and when the navigate function is called', () => {
      beforeEach(() => {
        result.navigate(routeMock);
      });

      it('should navigate to the given route', () => {
        expect(pushMock).toHaveBeenLastCalledWith(routeMock);
      });
    });
  })
});

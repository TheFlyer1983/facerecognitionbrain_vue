import { beforeAll, describe, expect, it, vi } from 'vitest';
import axios from 'axios';

import request from './request';
import { getAuthTokenInSession } from './storageFunctions';

vi.mock('axios', () => {
  const mockedAxiosInstance = {
    interceptors: {
      request: {
        use: vi.fn()
      },
      response: {
        use: vi.fn()
      }
    }
  };

  return {
    create: () => mockedAxiosInstance
  };
});
vi.mock('./storageFunctions');

const mockedGetAuthTokenInSession = vi.mocked(getAuthTokenInSession, true);


describe('Given the request client', () => {
  describe('when it is instantiated', () => {
    it('should return the created instance of axios', () => {
      expect(request).toEqual(axios.create());
    });

    it('should register the interceptor', () => {
      expect(request.interceptors.request.use).toHaveBeenCalledWith(
        expect.any(Function)
      );
    });

    // describe('and when the request interceptor is called', () => {
    //   const interceptors: Function = (
    //     request.interceptors.request.use
    //   ).mock.calls[0][0];

    //   describe('and when there is no token available', () => {
    //     let token;
    //     const configMock = {
    //       headers: {}
    //     }

    //     beforeAll(() => {
    //       token = mockedGetAuthTokenInSession.mockReturnValue(null);
    //     })

    //     it('should NOT change the config', async () => {
    //       expect(await interceptors(configMock)).toStrictEqual(configMock);
    //     })
    //   })
    // });
  });
});

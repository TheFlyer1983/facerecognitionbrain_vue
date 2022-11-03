import { beforeAll, describe, expect, it, vi } from 'vitest';
import axios from 'axios';

import client from './request';
import { getAuthTokenInSession } from './storageFunctions';

vi.doMock('axios', () => {
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
    create: vi.fn(() => mockedAxiosInstance)
  };
});

vi.mock('./storageFunctions');

describe.skip('Given the request client', () => {
  describe('when it is instantiated', () => {
    it('should return the created instance of axios', () => {
      expect(client).toBeDefined();
    });

    it('should register the interceptor', () => {
      expect(client.interceptors.request.use).toHaveBeenCalledWith(
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

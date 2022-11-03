import { SpyInstance } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useUserStore } from './user';
import request from '@/functions/request';
import {
  getAuthTokenInSession,
  removeAuthTokenFromSession,
  saveAuthTokenInSession
} from '@/functions/storageFunctions';
import { endpoints, reAuthURL } from '@/constants';
import { LoginInfo } from '@/types';
import { ReAuthenticationMock, UserMock } from '@/fixtures/users';

vi.mock('@/functions/request');
vi.mock('@/functions/storageFunctions');

const mockedGetToken = vi.mocked(getAuthTokenInSession);
const mockedRemoveToken = vi.mocked(removeAuthTokenFromSession);
const mockedSaveToken = vi.mocked(saveAuthTokenInSession);

const pinia = createPinia();
const mockUserStore = useUserStore(pinia);

describe('Given the user store', () => {
  beforeAll(() => {
    setActivePinia(pinia);
  });

  describe('and when the actions are called', () => {
    let requestSpy: SpyInstance;
    let errorSpy: SpyInstance;
    let functionSpy: SpyInstance;

    describe('and when `getUser` is called', () => {
      const payloadMock = '1';
      const requestURL = endpoints.profile.replace(':id', payloadMock);
      const responseMock = {
        id: 1,
        name: 'User 1',
        email: 'test@test.com',
        entries: '6',
        joined: '2021-04-09T00:00:00.000Z'
      };
      const tokenMock = '123ABC123ABC';

      beforeEach(async () => {
        requestSpy = vi
          .spyOn(request, 'get')
          .mockResolvedValue({ data: responseMock });

        mockUserStore.$patch({ token: tokenMock });

        functionSpy = vi.spyOn(mockUserStore, 'getRank');

        await mockUserStore.getUser(payloadMock);
      });

      it('should call the `getUser` api', () => {
        expect(requestSpy).toHaveBeenCalledWith(requestURL, {
          params: { auth: mockUserStore.token }
        });
      });

      it('should update the state correctly', () => {
        expect(mockUserStore.user).toStrictEqual(responseMock);
        expect(mockUserStore.isSignedIn).toBe(true);
      });

      it('should call the next action', () => {
        expect(functionSpy).toHaveBeenCalled();
      });

      describe('and when the api call is unsuccessful', () => {
        const error = new Error('error');

        beforeEach(async () => {
          mockUserStore.$reset();
          vi.spyOn(request, 'get').mockRejectedValue(error.message);

          errorSpy = vi.spyOn(console, 'error').mockImplementation(() => ({}));

          await mockUserStore.getUser(payloadMock);
        });

        it('should throw error', () => {
          expect(errorSpy).toHaveBeenCalledWith(error.message);
        });

        it('should not update the state', () => {
          expect(mockUserStore.user).toBeNull();
          expect(mockUserStore.isSignedIn).toBe(false);
        });
      });
    });

    describe('and when `login` is called', () => {
      const requestURL = endpoints.signin;

      const payload: LoginInfo = {
        email: 'test@test.com',
        password: 'password'
      };

      const mockedResponse = {
        localId: '1',
        refreshToken: 'refreshToken',
        idToken: 'ABC123ABC123'
      };

      beforeEach(async () => {
        requestSpy = vi
          .spyOn(request, 'post')
          .mockResolvedValue({ data: mockedResponse });

        errorSpy = vi.spyOn(console, 'error');

        functionSpy = vi
          .spyOn(mockUserStore, 'getUser')
          .mockResolvedValue(true);

        await mockUserStore.login(payload);
      });

      it('should call the login api', () => {
        expect(requestSpy).toHaveBeenCalledWith(
          requestURL,
          {
            ...payload,
            returnSecureToken: true
          },
          { params: { key: import.meta.env.VITE_APP_FIREBASE_API_KEY } }
        );
      });

      it('shoud update the state corectly', () => {
        expect(mockUserStore.token).toStrictEqual(mockedResponse.idToken);
        expect(mockUserStore.id).toStrictEqual(mockedResponse.localId);
      });

      it('should save the token in local storage', () => {
        expect(mockedSaveToken).toHaveBeenCalledWith(
          mockedResponse.idToken,
          mockedResponse.refreshToken
        );
      });

      it('should call the next action', () => {
        expect(mockUserStore.getUser).toHaveBeenCalledWith(
          mockedResponse.localId
        );
      });

      it('and the action should return `true`', () => {
        expect(functionSpy.mock.results[0].value).toBe(true);
      });

      it('should not throw an error', () => {
        expect(errorSpy).not.toHaveBeenCalled();
      });

      describe('and when the api call fails', () => {
        const error = new Error('error');

        beforeEach(async () => {
          mockUserStore.$reset();
          vi.spyOn(request, 'post').mockRejectedValue(error.message);

          errorSpy = vi.spyOn(console, 'error').mockImplementation(() => ({}));

          await mockUserStore.login(payload);
        });

        it('should throw an error', () => {
          expect(errorSpy).toHaveBeenCalledWith(error.message);
        });

        it('should not update the state', () => {
          expect(mockUserStore.token).toBe('');
          expect(mockUserStore.user).toBeNull();
        });
      });

      describe('when the action returns false', () => {
        const error = new Error('Error');

        beforeEach(async () => {
          vi.spyOn(request, 'post').mockResolvedValue({ data: mockedResponse });

          functionSpy = vi
            .spyOn(mockUserStore, 'getUser')
            .mockResolvedValue(false);

          errorSpy = vi.spyOn(console, 'error').mockImplementation(() => ({}));

          await mockUserStore.login(payload);
        });

        it('the action should return false', () => {
          expect(functionSpy.mock.results[0].value).toBe(false);
        });

        it('should throw an error', () => {
          expect(errorSpy).toHaveBeenCalledWith(error);
        });
      });
    });

    describe('and when `registerUser` is called', () => {
      const payloadMock = {
        name: 'User 1',
        email: 'test@test.com',
        password: 'password'
      };
      const apiPayload = {
        email: 'test@test.com',
        password: 'password',
        returnSecureToken: true
      };
      const requestURL = endpoints.register;
      const responseMock = {
        idToken: '123ABC123',
        refreshToken: 'refreshToken',
        localId: '2'
      };

      beforeEach(async () => {
        requestSpy = vi
          .spyOn(request, 'post')
          .mockResolvedValue({ data: responseMock });

        functionSpy = vi.spyOn(mockUserStore, 'createProfile');

        await mockUserStore.registerUser(payloadMock);
      });

      it('should call the `registerUser` api', () => {
        expect(requestSpy).toHaveBeenCalledWith(requestURL, apiPayload, {
          params: { key: import.meta.env.VITE_APP_FIREBASE_API_KEY }
        });
      });

      it('should update the state correctly', () => {
        expect(mockUserStore.token).toStrictEqual(responseMock.idToken);
        expect(mockUserStore.id).toStrictEqual(responseMock.localId);
      });

      it('should save the token in local storage', () => {
        expect(mockedSaveToken).toHaveBeenCalledWith(
          responseMock.idToken,
          responseMock.refreshToken
        );
      });

      it('should call the next action', () => {
        expect(functionSpy).toHaveBeenCalledWith(payloadMock.name);
      });

      describe('and when the api call fails', () => {
        const error = new Error('error');

        beforeEach(async () => {
          mockUserStore.$reset();
          vi.spyOn(request, 'post').mockRejectedValue(error.message);

          errorSpy = vi.spyOn(console, 'error').mockImplementation(() => ({}));

          await mockUserStore.registerUser(payloadMock);
        });

        it('should throw error', () => {
          expect(errorSpy).toHaveBeenCalledWith(error.message);
        });

        it('should not update the state', () => {
          expect(mockUserStore.user).toBeNull();
        });
      });
    });

    describe('and when `createProfile` is called', () => {
      const profilePayload = {
        name: 'Paul',
        entries: 0,
        joined: new Date('2022-10-26')
      };

      const requestURL = endpoints.profile.replace(':id', mockUserStore.id);

      beforeEach(async () => {
        vi.useFakeTimers().setSystemTime(new Date('2022-10-26'));

        requestSpy = vi
          .spyOn(request, 'put')
          .mockResolvedValue({ data: profilePayload });

        await mockUserStore.createProfile('Paul');
      });

      it('should call the api', () => {
        expect(requestSpy).toHaveBeenCalledWith(requestURL, profilePayload, {
          params: { auth: mockUserStore.token }
        });
      });
    });

    describe('and when `reauthenticate` is called', () => {
      const mockedToken = 'ABC123ABC123';
      const mockedRefreshToken = 'RefreshToken';

      const mockedPayload = {
        grant_type: 'refresh_token',
        refresh_token: mockedRefreshToken
      };
      const mockedResponse = ReAuthenticationMock;

      beforeEach(async () => {
        mockedGetToken.mockReturnValue({
          token: mockedToken,
          refreshToken: mockedRefreshToken
        });

        requestSpy = vi
          .spyOn(request, 'post')
          .mockResolvedValue({ data: mockedResponse });

        functionSpy = vi.spyOn(mockUserStore, 'getUser');

        await mockUserStore.reauthenticate();
      });

      it('should call the api', () => {
        expect(requestSpy).toHaveBeenCalledWith(reAuthURL, mockedPayload, {
          params: { key: import.meta.env.VITE_APP_FIREBASE_API_KEY }
        });
      });

      it('should update the state correctly', () => {
        expect(mockUserStore.token).toStrictEqual(mockedResponse.id_token);
        expect(mockUserStore.id).toStrictEqual(mockedResponse.user_id);
      });

      it('call the next action', () => {
        expect(functionSpy).toHaveBeenCalledWith(mockedResponse.user_id);
      });

      it('should save the tokens in session storeage', () => {
        expect(mockedSaveToken).toHaveBeenCalledWith(
          mockedResponse.id_token,
          mockedResponse.refresh_token
        );
      });

      describe('and when the api call fails', () => {
        const error = new Error('error');

        beforeEach(async () => {
          vi.spyOn(request, 'post').mockRejectedValue(error.message);

          errorSpy = vi.spyOn(console, 'error').mockImplementation(() => ({}));

          await mockUserStore.reauthenticate();
        });

        it('should throw error', () => {
          expect(errorSpy).toHaveBeenCalledWith(error.message);
        });
      });

      describe('and when there is no token', () => {
        beforeEach(async () => {
          mockedGetToken.mockReturnValue({
            token: mockedToken,
            refreshToken: ''
          });

          mockUserStore.$reset();

          requestSpy = vi.spyOn(request, 'post');

          functionSpy = vi.spyOn(mockUserStore, 'getUser');

          await mockUserStore.reauthenticate();
        });

        it('should not call the api', () => {
          expect(requestSpy).not.toHaveBeenCalled();
        });

        it('should not call the next action', () => {
          expect(functionSpy).not.toHaveBeenCalled();
        });
      });
    });

    describe('and when `getRank` is called', () => {
      const mockedResponse = {
        message: 'Success',
        input: '🔸'
      };

      beforeEach(async () => {
        mockUserStore.$patch({ user: { ...UserMock } });

        requestSpy = vi
          .spyOn(request, 'get')
          .mockResolvedValue({ data: mockedResponse });

        await mockUserStore.getRank();
      });

      it('should call the api', () => {
        expect(requestSpy).toHaveBeenCalledWith(endpoints.rank, {
          params: {
            rank: mockUserStore.user?.entries
          }
        });
      });

      it('should update the state correctly', () => {
        expect(mockUserStore.rank).toStrictEqual(mockedResponse.input);
      });

      describe('and when the api call fails', () => {
        const error = new Error('error');

        beforeEach(async () => {
          mockUserStore.$reset();

          vi.spyOn(request, 'get').mockRejectedValue(error.message);

          errorSpy = vi.spyOn(console, 'error').mockImplementation(() => ({}));

          await mockUserStore.getRank();
        });

        it('should throw an error', () => {
          expect(errorSpy).toHaveBeenCalledWith(error.message);
        });

        it('should not update the state', () => {
          expect(mockUserStore.rank).toStrictEqual('');
        });
      });
    });

    describe('and when signout is called', () => {
      beforeEach(() => {
        functionSpy = vi.spyOn(mockUserStore, '$reset');
        mockUserStore.signout();
      });

      it('should call `removeAuthTokenFromSession`', () => {
        expect(mockedRemoveToken).toHaveBeenCalled();
      });

      it('should reset the state', () => {
        expect(functionSpy).toHaveBeenCalled();
      });
    });

    describe('and when `updateUser` is called', () => {
      const mockedResponse = 'success';

      const mockedPayload = {
        name: 'Paul',
        age: 39,
        pet: 'Ruby'
      };

      const requestURL = endpoints.profile.replace(':id', mockUserStore.token);

      beforeEach(async () => {
        mockUserStore.$patch({ user: { ...UserMock } });

        requestSpy = vi
          .spyOn(request, 'patch')
          .mockResolvedValue({ data: mockedResponse });

        functionSpy = vi.spyOn(mockUserStore, 'getUser');

        await mockUserStore.updateUser(mockedPayload);
      });

      it('should call the api', () => {
        expect(requestSpy).toHaveBeenCalledWith(requestURL, mockedPayload, {
          params: { auth: mockUserStore.token }
        });
      });

      it('should call the next action', () => {
        expect(functionSpy).toHaveBeenCalledWith(mockUserStore.token);
      });

      describe('and when the api call fails', () => {
        const error = new Error('error');

        beforeEach(async () => {
          vi.spyOn(request, 'patch').mockRejectedValue(error.message);

          errorSpy = vi.spyOn(console, 'error').mockImplementation(() => ({}));

          await mockUserStore.updateUser(mockedPayload);
        });

        it('should throw an error', () => {
          expect(errorSpy).toHaveBeenCalledWith(error.message);
        });
      });
    });

    describe('and when `deleteUser` is called', () => {
      const mockedResponse = { kind: 'identitytoolkit#DeleteAccountResponse' };

      const requestURL = endpoints.profile.replace(':id', mockUserStore.id);

      let deleteSpy: SpyInstance;

      beforeEach(async () => {
        mockUserStore.$patch({ user: { ...UserMock } });

        requestSpy = vi
          .spyOn(request, 'delete')
          .mockResolvedValue({ data: null });

        deleteSpy = vi
          .spyOn(request, 'post')
          .mockResolvedValue({ data: mockedResponse });

        functionSpy = vi.spyOn(mockUserStore, 'signout');

        await mockUserStore.deleteUser();
      });

      it('should call the api', () => {
        expect(requestSpy).toHaveBeenCalledWith(requestURL, {
          params: { auth: mockUserStore.token }
        });

        expect(deleteSpy).toHaveBeenCalledWith(
          endpoints.delete,
          {
            idToken: mockUserStore.token
          },
          {
            params: { key: import.meta.env.VITE_APP_FIREBASE_API_KEY }
          }
        );
      });

      it('should call the next action', () => {
        expect(functionSpy).toHaveBeenCalled();
      });

      describe('when the api call fails', () => {
        const error = new Error('error');

        beforeEach(async () => {
          vi.spyOn(request, 'delete').mockRejectedValue(error.message);

          errorSpy = vi.spyOn(console, 'error').mockImplementation(() => ({}));

          await mockUserStore.deleteUser();
        });

        it('should throw an error', () => {
          expect(errorSpy).toHaveBeenCalledWith(error.message);
        });
      });
    });
  });
});

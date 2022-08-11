import { SpyInstance } from 'vitest';

import { getters, mutations, actions } from './user';
import { UserState } from './userTypes';
import { UserMock } from '@/fixtures/users';
import { LoginInfo } from '@/types';
import { endpoints } from '@/constants';
import request from '@/functions/request';
import {
  saveAuthTokenInSession,
  getAuthTokenInSession,
  removeAuthTokenFromSession
} from '@/functions/storageFunctions';

const stateMock: UserState = {
  isSignedIn: false,
  isProfileOpen: false,
  user: null,
  token: '',
  rank: ''
};

vi.mock('@/functions/storageFunctions');

const mockedSaveToken = vi.mocked(saveAuthTokenInSession);
const mockedGetToken = vi.mocked(getAuthTokenInSession);
const mockedRemoveToken = vi.mocked(removeAuthTokenFromSession);

const contextMock = {
  state: stateMock,
  commit: vi.fn(),
  dispatch: vi.fn(),
  getters: {},
  rootState: {},
  rootGetters: {}
};

let requestSpy: SpyInstance;
let errorSpy: SpyInstance;
let dispatchSpy: SpyInstance;

describe('Given the `user` state', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('and when `getters` are invoked', () => {
    describe('and when `getUser` is called', () => {
      const stateMock: UserState = {
        isSignedIn: false,
        isProfileOpen: false,
        user: UserMock,
        token: '',
        rank: ''
      };

      it('should return then correct result', () => {
        expect(getters.getUser(stateMock)).toStrictEqual(stateMock.user);
      });
    });

    describe('and when `getToken` is called', () => {
      const stateMock: UserState = {
        isSignedIn: false,
        isProfileOpen: false,
        user: null,
        token: 'ABC123ABC123',
        rank: ''
      };

      it('should return the correct result', () => {
        expect(getters.getToken(stateMock)).toStrictEqual(stateMock.token);
      });
    });

    describe('and when `getIsSignedIn` is called', () => {
      const stateMock: UserState = {
        isSignedIn: true,
        isProfileOpen: false,
        user: null,
        token: '',
        rank: ''
      };

      it('should return then correct result', () => {
        expect(getters.getIsSignedIn(stateMock)).toStrictEqual(
          stateMock.isSignedIn
        );
      });
    });

    describe('and when `getRank` is called', () => {
      const stateMock: UserState = {
        isSignedIn: false,
        isProfileOpen: false,
        user: null,
        token: '',
        rank: '😃'
      };

      it('should return then correct result', () => {
        expect(getters.getRank(stateMock)).toStrictEqual(stateMock.rank);
      });
    });

    describe('and when `getIsProfileOpen` is called', () => {
      const stateMock: UserState = {
        isSignedIn: false,
        isProfileOpen: true,
        user: null,
        token: '',
        rank: ''
      };

      it('should return then correct result', () => {
        expect(getters.getIsProfileOpen(stateMock)).toStrictEqual(
          stateMock.isProfileOpen
        );
      });
    });
  });

  describe('and when `mutations` are invoked', () => {
    describe('and when `setUserId` is called', () => {
      const stateMock: UserState = {
        isSignedIn: false,
        isProfileOpen: false,
        user: null,
        token: '',
        rank: ''
      };
      const payload = '1';
      const expectedResult: UserState = {
        isSignedIn: false,
        isProfileOpen: false,
        user: { id: payload },
        token: '',
        rank: ''
      };

      beforeEach(() => {
        mutations.setUserId(stateMock, payload);
      });

      it('should change the state correctly', () => {
        expect(stateMock).toStrictEqual(expectedResult);
      });
    });

    describe('and when `setUser` is called', () => {
      const stateMock: UserState = {
        isSignedIn: false,
        isProfileOpen: false,
        user: null,
        token: '',
        rank: ''
      };
      const payload = UserMock;
      const expectedResult: UserState = {
        isSignedIn: false,
        isProfileOpen: false,
        user: payload,
        token: '',
        rank: ''
      };

      beforeEach(() => {
        mutations.setUser(stateMock, payload);
      });

      it('should change the state correctly', () => {
        expect(stateMock).toStrictEqual(expectedResult);
      });
    });

    describe('and when `toggleSignIn` is called', () => {
      const stateMock: UserState = {
        isSignedIn: false,
        isProfileOpen: false,
        user: null,
        token: '',
        rank: ''
      };
      const payload = true;
      const expectedResult: UserState = {
        isSignedIn: payload,
        isProfileOpen: false,
        user: null,
        token: '',
        rank: ''
      };

      beforeEach(() => {
        mutations.toggleSignIn(stateMock, payload);
      });

      it('should change the state correctly', () => {
        expect(stateMock).toStrictEqual(expectedResult);
      });
    });

    describe('and when `setToken` is called', () => {
      const stateMock: UserState = {
        isSignedIn: false,
        isProfileOpen: false,
        user: null,
        token: '',
        rank: ''
      };
      const payload = '123ABC123ABC';
      const expectedResult: UserState = {
        isSignedIn: false,
        isProfileOpen: false,
        user: null,
        token: payload,
        rank: ''
      };

      beforeEach(() => {
        mutations.setToken(stateMock, payload);
      });

      it('should change the state correctly', () => {
        expect(stateMock).toStrictEqual(expectedResult);
      });
    });

    describe('and when `toggleSignIn` is called', () => {
      const stateMock: UserState = {
        isSignedIn: false,
        isProfileOpen: false,
        user: UserMock,
        token: '',
        rank: ''
      };
      const payload = 1;
      const expectedResult: UserState = {
        isSignedIn: false,
        isProfileOpen: false,
        user: { ...UserMock, entries: payload },
        token: '',
        rank: ''
      };

      beforeEach(() => {
        mutations.updateEntries(stateMock, payload);
      });

      it('should change the state correctly', () => {
        expect(stateMock).toStrictEqual(expectedResult);
      });
    });

    describe('and when `setRank` is called', () => {
      const stateMock: UserState = {
        isSignedIn: false,
        isProfileOpen: false,
        user: null,
        token: '',
        rank: ''
      };
      const payload = '😃';
      const expectedResult: UserState = {
        isSignedIn: false,
        isProfileOpen: false,
        user: null,
        token: '',
        rank: payload
      };

      beforeEach(() => {
        mutations.setRank(stateMock, payload);
      });

      it('should change the state correctly', () => {
        expect(stateMock).toStrictEqual(expectedResult);
      });
    });

    describe('and when `clearUser` is called', () => {
      const stateMock: UserState = {
        isSignedIn: true,
        isProfileOpen: false,
        user: UserMock,
        token: '',
        rank: ''
      };
      const expectedResult: UserState = {
        isSignedIn: false,
        isProfileOpen: false,
        user: null,
        token: '',
        rank: ''
      };

      beforeEach(() => {
        mutations.clearUser(stateMock);
      });

      it('should change the state correctly', () => {
        expect(stateMock).toStrictEqual(expectedResult);
      });
    });

    describe('and when `toggleModal` is called', () => {
      const stateMock: UserState = {
        isSignedIn: false,
        isProfileOpen: false,
        user: null,
        token: '',
        rank: ''
      };
      const expectedResult: UserState = {
        isSignedIn: false,
        isProfileOpen: true,
        user: null,
        token: '',
        rank: ''
      };

      beforeEach(() => {
        mutations.toggleModal(stateMock);
      });

      it('should change the state correctly', () => {
        expect(stateMock).toStrictEqual(expectedResult);
      });
    });
  });

  describe('and when actions are invoked', () => {
    describe('and when `login` is called', () => {
      const requestURL = endpoints.signin;

      const payload: LoginInfo = {
        email: 'test@test.com',
        password: 'password'
      };

      const mockedResponse = {
        success: 'true',
        userId: 1,
        token: 'ABC123ABC123'
      };

      beforeEach(async () => {
        vi.clearAllMocks();

        requestSpy = vi
          .spyOn(request, 'post')
          .mockResolvedValue({ data: mockedResponse });

        dispatchSpy = vi.spyOn(contextMock, 'dispatch').mockReturnValue(true);

        errorSpy = vi.spyOn(console, 'error');

        await actions.login(contextMock, payload);
      });
      it('should call the login api', () => {
        expect(requestSpy).toHaveBeenCalledWith(requestURL, payload);
      });

      it('should commit the correct mutations', () => {
        expect(contextMock.commit).toHaveBeenNthCalledWith(
          1,
          'setToken',
          mockedResponse.token
        );

        expect(contextMock.commit).toHaveBeenNthCalledWith(
          2,
          'setUserId',
          mockedResponse.userId
        );
      });

      it('should dispatch the correct action', () => {
        expect(contextMock.dispatch).toHaveBeenCalledWith(
          'getUser',
          mockedResponse.userId
        );
      });

      it('the dispatched action should return `true`', () => {
        expect(dispatchSpy.mock.results[0].value).toBe(true);
      });

      it('should not throw an error', () => {
        expect(errorSpy).not.toHaveBeenCalled();
      });

      describe('and when the api call fails', () => {
        const error = new Error('error');
        beforeEach(async () => {
          vi.spyOn(request, 'post').mockRejectedValue(error.message);

          errorSpy = vi.spyOn(console, 'error').mockImplementation(() => ({}));

          await actions.login(contextMock, payload);
        });

        it('should throw error', () => {
          expect(errorSpy).toHaveBeenCalledWith(error.message);
        });
      });

      describe('when the dispatched action fails', () => {
        const error = new Error('Error');

        beforeEach(async () => {
          vi.clearAllMocks();

          vi.spyOn(request, 'post').mockResolvedValue({ data: mockedResponse });

          dispatchSpy = vi
            .spyOn(contextMock, 'dispatch')
            .mockReturnValue(false);

          errorSpy = vi.spyOn(console, 'error').mockImplementation(() => ({}));

          await actions.login(contextMock, payload);
        });

        it('the dispatched action should return `false`', () => {
          expect(dispatchSpy.mock.results[0].value).toBe(false);
        });

        it('should throw an error', () => {
          expect(errorSpy).toHaveBeenCalledWith(error);
        });
      });
    });

    describe('and when `getUser` is called', () => {
      const payloadMock = '1';
      const requestURL = endpoints.getProfile.replace(':id', payloadMock);
      const responseMock = {
        id: 1,
        name: 'User 1',
        email: 'test@test.com',
        entries: '6',
        joined: '2021-04-09T00:00:00.000Z'
      };

      beforeEach(async () => {
        requestSpy = vi
          .spyOn(request, 'get')
          .mockResolvedValue({ data: responseMock });

        await actions.getUser(contextMock, payloadMock);
      });

      it('should call the `getUser` api', () => {
        expect(requestSpy).toHaveBeenCalledWith(requestURL);
      });

      it('should call the correct mutations', () => {
        expect(contextMock.commit).toHaveBeenNthCalledWith(
          1,
          'setUser',
          responseMock
        );

        expect(contextMock.commit).toHaveBeenNthCalledWith(
          2,
          'toggleSignIn',
          true
        );
      });

      it('should dispatch the correct action', () => {
        expect(contextMock.dispatch).toHaveBeenCalledWith('getRank');
      });

      describe('and when the api call fails', () => {
        const error = new Error('error');

        beforeEach(async () => {
          vi.spyOn(request, 'get').mockRejectedValue(error.message);

          errorSpy = vi.spyOn(console, 'error').mockImplementation(() => ({}));

          await actions.getUser(contextMock, payloadMock);
        });

        it('should throw error', () => {
          expect(errorSpy).toHaveBeenCalledWith(error.message);
        });
      });
    });

    describe('and when `registerUser` is called', () => {
      const payloadMock = {
        name: 'User 1',
        email: 'test@test.com',
        password: 'password'
      };
      const requestURL = endpoints.register;
      const responseMock = {
        register: {
          response: 'Success',
          user: {
            id: 2,
            name: 'Paul',
            email: 'theflyer1983123@gmail.com',
            entries: '0',
            joined: '2022-03-15T15:43:43.780Z'
          }
        },
        session: {
          success: 'true',
          userId: 2,
          token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRoZWZseWVyMTk4MzEyM0BnbWFpbC5jb20iLCJpYXQiOjE2NDczNTkwMjMsImV4cCI6MTY0NzUzMTgyM30.KLUZdREDkcFdtgkkRN1yrP9d2rvV24X_SOph4n9CYi0'
        }
      };

      beforeEach(async () => {
        requestSpy = vi
          .spyOn(request, 'post')
          .mockResolvedValue({ data: responseMock });

        await actions.registerUser(contextMock, payloadMock);
      });

      it('should call the `getUser` api', () => {
        expect(requestSpy).toHaveBeenCalledWith(requestURL, payloadMock);
      });

      it('should call the correct mutations', () => {
        expect(contextMock.commit).toHaveBeenCalledWith(
          'setUser',
          responseMock.register.user
        );
      });

      it('should save the token', () => {
        expect(mockedSaveToken).toHaveBeenCalledWith(
          responseMock.session.token
        );
      });

      describe('and when the api call fails', () => {
        const error = new Error('error');
        beforeEach(async () => {
          vi.spyOn(request, 'post').mockRejectedValue(error.message);

          errorSpy = vi.spyOn(console, 'error').mockImplementation(() => ({}));

          await actions.registerUser(contextMock, payloadMock);
        });

        it('should throw error', () => {
          expect(errorSpy).toHaveBeenCalledWith(error.message);
        });
      });
    });

    describe('and when `getToken` is called', () => {
      const mockedToken = '123ABC123ABC';

      beforeEach(() => {
        mockedGetToken.mockReturnValue(mockedToken);
        actions.getToken(contextMock);
      });

      it('should retreive the token', () => {
        expect(mockedGetToken).toHaveBeenCalled();
      });

      it('should commmit the correct mutations', () => {
        expect(contextMock.commit).toHaveBeenCalledWith(
          'setToken',
          mockedToken
        );
      });

      it('should dispatch the correct action', () => {
        expect(contextMock.dispatch).toHaveBeenCalledWith('authenticated');
      });

      describe('when no token available', () => {
        const mockedToken = null;

        beforeEach(() => {
          vi.clearAllMocks();

          mockedGetToken.mockReturnValue(mockedToken);
          actions.getToken(contextMock);
        });

        it('should not commit any mutations', () => {
          expect(contextMock.commit).not.toHaveBeenCalled();
        });

        it('should not dispatch any actions', () => {
          expect(contextMock.dispatch).not.toHaveBeenCalled();
        });
      });
    });

    describe('and when `authencitated` is called', () => {
      const mockedResponse = {
        id: 1
      };

      beforeEach(async () => {
        vi.clearAllMocks();
        stateMock.token = 'ABC123ABC123';

        requestSpy = vi
          .spyOn(request, 'post')
          .mockResolvedValue({ data: mockedResponse });

        await actions.authenticated(contextMock);
      });

      it('should call the api', () => {
        expect(requestSpy).toHaveBeenCalledWith(endpoints.signin);
      });

      it('should dispatch the correct action', () => {
        expect(contextMock.dispatch).toHaveBeenCalledWith(
          'getUser',
          mockedResponse.id
        );
      });

      describe('and when the api call fails', () => {
        const error = new Error('error');

        beforeEach(async () => {
          vi.spyOn(request, 'post').mockRejectedValue(error.message);

          errorSpy = vi.spyOn(console, 'error').mockImplementation(() => ({}));

          await actions.authenticated(contextMock);
        });

        it('should throw error', () => {
          expect(errorSpy).toHaveBeenCalledWith(error.message);
        });
      });

      describe('and when there is no token', () => {
        beforeEach(async () => {
          vi.clearAllMocks();

          stateMock.token = '';

          requestSpy = vi.spyOn(request, 'post');

          await actions.authenticated(contextMock);
        });

        it('should not call the api', () => {
          expect(requestSpy).not.toHaveBeenCalled();
        });

        it('should not call the action', () => {
          expect(contextMock.dispatch).not.toHaveBeenCalled();
        });
      });
    });

    describe('and when `getRank` is called', () => {
      const mockedResponse = '🔸';

      beforeEach(async () => {
        stateMock.user = {
          id: '1',
          name: 'Paul',
          email: 'test@test.com',
          entries: 6,
          joined: '2022-03-15T15:43:43.780Z'
        };

        requestSpy = vi
          .spyOn(request, 'post')
          .mockResolvedValue({ data: mockedResponse });

        await actions.getRank(contextMock);
      });

      it('should call the api', () => {
        expect(requestSpy).toHaveBeenCalledWith(endpoints.rank, {
          entries: stateMock.user?.entries
        });
      });

      it('should commit the correct mutation', () => {
        expect(contextMock.commit).toHaveBeenCalledWith(
          'setRank',
          mockedResponse
        );
      });

      describe('when the api call fails', () => {
        const error = new Error('error');
        beforeEach(async () => {
          vi.clearAllMocks();

          vi.spyOn(request, 'post').mockRejectedValue(error.message);

          errorSpy = vi.spyOn(console, 'error').mockImplementation(() => ({}));

          await actions.getRank(contextMock);
        });

        it('should throw an error', () => {
          expect(errorSpy).toHaveBeenCalledWith(error.message);
        });
      });
    });

    describe('and when `signOut` is called', () => {
      beforeEach(() => {
        actions.signOut(contextMock);
      });

      it('should call `removeAuthTokenFromSession', () => {
        expect(mockedRemoveToken).toHaveBeenCalled();
      });

      it('should commit the correct mutation', () => {
        expect(contextMock.commit).toHaveBeenCalledWith('clearUser');
      });
    });

    describe('and when `updateUser` is called', () => {
      const mockedResponse = 'success';

      const payload = {
        name: 'Paul',
        age: 38,
        pet: 'Ruby'
      };

      stateMock.user = {
        id: '1',
        name: 'Paul',
        email: 'test@test.com',
        entries: 6,
        joined: '2022-03-15T15:43:43.780Z'
      };

      const requestURL = `${endpoints.profile}/${stateMock.user?.id}`;

      beforeEach(async () => {
        vi.clearAllMocks();

        requestSpy = vi
          .spyOn(request, 'post')
          .mockResolvedValue({ data: mockedResponse });

        await actions.updateUser(contextMock, payload);
      });

      it('should call the api', () => {
        expect(requestSpy).toHaveBeenCalledWith(requestURL, {
          formInput: payload
        });
      });

      it('should dispatch the correct action', () => {
        expect(contextMock.dispatch).toHaveBeenCalledWith(
          'getUser',
          stateMock.user?.id
        );
      });

      describe('and when the api call fails', () => {
        const error = new Error('error');

        beforeEach(async () => {
          vi.spyOn(request, 'post').mockRejectedValue(error.message);

          errorSpy = vi.spyOn(console, 'error').mockImplementation(() => ({}));

          await actions.updateUser(contextMock, payload);
        });

        it('should throw and error', () => {
          expect(errorSpy).toHaveBeenCalledWith(error.message);
        });
      });
    });

    describe('and when `deleteUser` is called', () => {
      const mockedResponse = {
        response: 'Success',
        message: 'User deleted successfully'
      };
      const requestUrl = `${endpoints.user}/1`;

      beforeEach(async () => {
        vi.clearAllMocks();

        requestSpy = vi
          .spyOn(request, 'delete')
          .mockResolvedValue({ data: mockedResponse });

        await actions.deleteUser(contextMock);
      });

      it('should call the api', () => {
        expect(requestSpy).toHaveBeenCalledWith(requestUrl);
      });

      it('should remove the token from local storage', () => {
        expect(mockedRemoveToken).toHaveBeenCalled();
      });

      it('should commit the correct mutation', () => {
        expect(contextMock.commit).toHaveBeenCalledWith('clearUser');
      });

      describe('and when the api call fails', () => {
        const error = new Error('error');

        beforeEach(async () => {
          vi.spyOn(request, 'delete').mockRejectedValue(error.message);

          errorSpy = vi.spyOn(console, 'error').mockImplementation(() => ({}));

          await actions.deleteUser(contextMock);
        });

        it('should throw and error', () => {
          expect(errorSpy).toHaveBeenCalledWith(error.message);
        });
      });
    });
  });
});

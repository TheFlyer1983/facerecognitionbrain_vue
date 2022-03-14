import { state, getters, mutations, actions } from './user';
import { UserState } from './userTypes';
import { UserMock } from '@/fixtures/users';
import { LoginInfo } from '@/types';
import { endpoints } from '@/constants';
import request from '@/functions/request';

const stateMock: UserState = {
  isSignedIn: false,
  isProfileOpen: false,
  user: null,
  token: '',
  rank: ''
};

jest.mock('@/functions/request');

describe('Given the `user` state', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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

      it('should return then correct result', () => {
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
    describe('and when login is called', () => {
      const contextMock = {
        state: stateMock,
        commit: vi.fn(),
        dispatch: vi.fn(),
        getters: {},
        rootState: {},
        rootGetters: {}
      };

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

      let requestSpy: SpyInstance;

      beforeEach(async () => {
        vi.clearAllMocks();

        requestSpy = spyOn(request, 'post').mockResolvedValue({ data: mockedResponse });

        await actions.login(contextMock, payload);
      });

      it('should call the login api', () => {
        expect(requestSpy).toHaveBeenCalledWith(requestURL, payload);
      });

      it('should commit the correct mutatiI have them ons', () => {
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
    });
  });
});

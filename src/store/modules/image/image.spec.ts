import { describe, it, expect, vi, beforeEach, SpyInstance } from 'vitest';

import { getters, mutations, actions } from './image';
import { UserState } from '../user/userTypes';
import { ImageState } from './imageTypes';
import request from '@/functions/request';
import { boxesMock } from '@/fixtures/images';
import { endpoints } from '@/constants/api-config';
import { UserMock } from '@/fixtures/users';

const stateMock: ImageState = {
  imageUrl: '',
  boxes: []
};

const contextMock = {
  state: stateMock,
  commit: vi.fn(),
  dispatch: vi.fn(),
  getters: {},
  rootState: {},
  rootGetters: {}
};

const imageUrlMock = 'http://image.url';

let requestSpy: SpyInstance;
let errorSpy: SpyInstance;

describe('Given the `image` state', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('and when getters are invoked', () => {
    describe('and when `getImageURL` is called', () => {
      const stateMock = {
        imageUrl: imageUrlMock,
        boxes: []
      };

      it('should return the correct result', () => {
        expect(getters.getImageURL(stateMock)).toBe(stateMock.imageUrl);
      });
    });

    describe('and when `getBoxes` is called', () => {
      const stateMock = {
        imageUrl: '',
        boxes: boxesMock
      };

      it('should return the correct result', () => {
        expect(getters.getBoxes(stateMock)).toBe(stateMock.boxes);
      });
    });
  });

  describe('and when mutations are invoked', () => {
    describe('and when `setImageURL` is called', () => {
      const stateMock: ImageState = {
        imageUrl: '',
        boxes: []
      };
      const payload = imageUrlMock;
      const expectedResult: ImageState = {
        imageUrl: payload,
        boxes: []
      };

      beforeEach(() => {
        mutations.setImageURL(stateMock, payload);
      });

      it('should change the state correctly', () => {
        expect(stateMock).toStrictEqual(expectedResult);
      });
    });

    describe('and when `setBoxes` is called', () => {
      const stateMock: ImageState = {
        imageUrl: '',
        boxes: []
      };
      const payload = boxesMock;
      const expectedResult: ImageState = {
        imageUrl: '',
        boxes: payload
      };

      beforeEach(() => {
        mutations.setBoxes(stateMock, payload);
      });

      it('should change the state correctly', () => {
        expect(stateMock).toStrictEqual(expectedResult);
      });
    });
  });

  describe('and when actions are invoked', () => {
    describe('and when `submitURL` is called', () => {
      beforeEach(async () => {
        vi.clearAllMocks();

        stateMock.imageUrl = imageUrlMock;

        requestSpy = vi
          .spyOn(request, 'post')
          .mockResolvedValue({ data: boxesMock });

        await actions.submitURL(contextMock);
      });

      it('should call the api', () => {
        expect(requestSpy).toHaveBeenCalledWith(endpoints.imageURL, {
          input: imageUrlMock
        });
      });

      it('should commmit the correct mutation', () => {
        expect(contextMock.commit).toHaveBeenCalledWith('setBoxes', boxesMock);
      });

      it('should dispatch the correct action', () => {
        expect(contextMock.dispatch).toHaveBeenCalledWith('increaseEntries');
      });

      describe('and when the api call fails', () => {
        const error = new Error('error');

        beforeEach(async () => {
          vi.clearAllMocks();

          vi.spyOn(request, 'post').mockRejectedValue(error.message);

          errorSpy = vi.spyOn(console, 'error').mockImplementation(() => ({}));

          await actions.submitURL(contextMock);
        });

        it('should throw an error', () => {
          expect(errorSpy).toHaveBeenCalledWith(error.message);
        });

        it('should not commit the mutations', () => {
          expect(contextMock.commit).not.toHaveBeenCalled();
        });

        it('should not dispatch the actions', () => {
          expect(contextMock.dispatch).not.toHaveBeenCalled();
        });
      });
    });

    describe('and when `increaseEntries` is called', () => {
      const mockedResponse = { entries: 1 };
      const rootGettersMock = {
        'user/getUser': UserMock as UserState['user']
      };
      beforeEach(async () => {
        vi.clearAllMocks();

        contextMock.rootGetters = rootGettersMock;

        stateMock.boxes = boxesMock;

        requestSpy = vi
          .spyOn(request, 'put')
          .mockResolvedValue({ data: mockedResponse });

        await actions.increaseEntries(contextMock);
      });

      it('should call the api', () => {
        expect(requestSpy).toHaveBeenCalledWith(endpoints.image, {
          id: rootGettersMock['user/getUser']?.id
        });
      });

      it('should commit the correct mutation', () => {
        expect(contextMock.commit).toHaveBeenCalledWith(
          'user/updateEntries',
          rootGettersMock['user/getUser']?.entries,
          { root: true }
        );
      });

      it('should dispatch the correct action', () => {
        expect(contextMock.dispatch).toHaveBeenCalledWith(
          'user/getRank',
          null,
          { root: true }
        );
      });

      describe('and when the api call fails', () => {
        const error = new Error('error');

        beforeEach(async () => {
          vi.clearAllMocks();

          vi.spyOn(request, 'put').mockRejectedValue(error.message);

          errorSpy = vi.spyOn(console, 'error').mockImplementation(() => ({}));

          await actions.increaseEntries(contextMock);
        });

        it('should throw an error', () => {
          expect(errorSpy).toHaveBeenCalledWith(error.message);
        });

        it('should not commit the mutations', () => {
          expect(contextMock.commit).not.toHaveBeenCalled();
        });

        it('should not dispatch the actions', () => {
          expect(contextMock.dispatch).not.toHaveBeenCalled();
        });
      });
    });
  });
});

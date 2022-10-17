import { SpyInstance } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useImageStore } from './image';
import { useUserStore } from '../user';
import request from '@/functions/request';
import { endpoints } from '@/constants';
import { boxesMock } from '@/fixtures/images';
import { UserMock } from '@/fixtures/users';

vi.mock('@functions/request');

const pinia = createPinia();
const mockImageStore = useImageStore(pinia);
const mockUserStore = useUserStore(pinia);

describe('Given the user store', () => {
  beforeAll(() => {
    setActivePinia(pinia);
  });

  describe('and when the actions are called', () => {
    let requestSpy: SpyInstance;
    let errorSpy: SpyInstance;
    let functionSpy: SpyInstance;
    const imageUrlMock = 'http://image.url';

    describe('and when `submitURL` is called', () => {
      beforeEach(async () => {
        mockImageStore.$patch({ imageUrl: imageUrlMock });
        requestSpy = vi
          .spyOn(request, 'post')
          .mockResolvedValue({ data: boxesMock });

        functionSpy = vi.spyOn(mockImageStore, 'increaseEntries');

        await mockImageStore.submitURL();
      });

      it('should call the api', () => {
        expect(requestSpy).toHaveBeenCalledWith(endpoints.imageURL, {
          input: imageUrlMock
        });
      });

      it('should update the state correctly', () => {
        expect(mockImageStore.boxes).toStrictEqual(boxesMock);
      });

      it('should call the next action', () => {
        expect(functionSpy).toHaveBeenCalled();
      });

      describe('and when the api call fails', () => {
        const error = new Error('error');

        beforeEach(async () => {
          mockImageStore.$reset();

          vi.spyOn(request, 'post').mockRejectedValue(error.message);

          errorSpy = vi.spyOn(console, 'error').mockImplementation(() => ({}));

          await mockImageStore.submitURL();
        });

        it('should throw an error', () => {
          expect(errorSpy).toHaveBeenCalledWith(error.message);
        });

        it('should not update the state', () => {
          expect(mockImageStore.boxes).toStrictEqual([]);
        });
      });
    });

    describe('and when `increaseEntries` is called', () => {
      const mockedResponse = { entries: 1 };
      beforeEach(async () => {
        mockImageStore.$patch({ boxes: boxesMock });
        mockUserStore.$patch({ user: { ...UserMock } });

        requestSpy = vi
          .spyOn(request, 'put')
          .mockResolvedValue({ data: mockedResponse });

        functionSpy = vi.spyOn(mockUserStore, 'getRank');

        await mockImageStore.increaseEntries();
      });

      it('should call the api', () => {
        expect(requestSpy).toHaveBeenCalledWith(endpoints.image, {
          id: mockUserStore.user?.id
        });
      });

      it('should update the state', () => {
        expect(mockUserStore.user?.entries).toStrictEqual(
          mockedResponse.entries
        );
      });

      it('should call the next action', () => {
        expect(functionSpy).toHaveBeenCalled();
      });

      describe('and when the api call fails', () => {
        const error = new Error('error');

        beforeEach(async () => {
          vi.spyOn(request, 'put').mockRejectedValue(error.message);

          errorSpy = vi.spyOn(console, 'error').mockImplementation(() => ({}));

          await mockImageStore.increaseEntries();
        });

        it('should throw an error', () => {
          expect(errorSpy).toHaveBeenCalledWith(error.message);
        });
      });
    });
  });
});

import useAvatars from './useAvatars';

describe('Given the `useAvatars` composable', () => {
  let result: ReturnType<typeof useAvatars>;

  describe('when it is called', () => {
    beforeAll(() => {
      result = useAvatars();
    });

    describe('and when the `createAvatar` function is called', () => {
      beforeEach(() => {
        result.createAvatar('Paul');
      });

      it('should return the correct value', () => {
        expect(result.avatar.value).toStrictEqual('P');
      });
    });
  });
});

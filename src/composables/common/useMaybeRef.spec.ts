import { ref } from 'vue';
import useMaybeRef from './useMaybeRef';

describe('Given the `useMaybeRef` composable', () => {
  let result: ReturnType<typeof useMaybeRef>;

  describe('when the plain value is provided', () => {
    const givenPlainValue = 'value';

    describe('when it is called', () => {
      beforeAll(() => {
        result = useMaybeRef(givenPlainValue);
      });

      it('should return the correct value from the property', () => {
        expect(result.value).toBe(givenPlainValue);
      });
    });

    describe('when the reference value is provided', () => {
      const givenPlainValue = 'given-value';
      const givenRefValue = ref('given-value');

      describe('when it is called', () => {
        beforeAll(() => {
          result = useMaybeRef(givenRefValue);
        });

        it('should return the correct value from the property', () => {
          expect(result.value).toBe(givenPlainValue);
        });
      });
    });
  });
});

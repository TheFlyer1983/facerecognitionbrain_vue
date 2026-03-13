describe('Given the useErrorTypes composable', () => {
  const { isAxiosError, isError } = useErrorTypes();

  describe('isAxiosError', () => {
    it('returns true if the error is an AxiosError', () => {
      expect(isAxiosError({ isAxiosError: true })).toBe(true);
    });

    it('returns false if the error is not an AxiosError', () => {
      expect(isAxiosError({ isAxiosError: false })).toBe(false);
      expect(isAxiosError('oops')).toBe(false);
      expect(isAxiosError({})).toBe(false);
      expect(isAxiosError({ isAxiosError: false })).toBe(false);
    });
  });

  describe('isError', () => {
    it('returns true for h3-like errors', () => {
      expect(
        isError({
          statusMessage: 'Bad Request',
          data: { message: 'Something failed' }
        })
      ).toBe(true);
    });
    it('returns false for invalid error shapes', () => {
      expect(isError(null)).toBe(false);
      expect(isError(123)).toBe(false);
      expect(isError({ statusMessage: 'Missing data' })).toBe(false);
      expect(isError({ data: { message: 'Missing statusMessage' } })).toBe(
        false
      );
    });
  });
});

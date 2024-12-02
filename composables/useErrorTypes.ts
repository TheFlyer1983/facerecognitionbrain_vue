import type { AxiosError } from 'axios';

export const useErrorTypes = () => {
  function isAxiosError(x: unknown): x is AxiosError<ApiErrors> {
    return !!(
      typeof x === 'object' &&
      x &&
      'isAxiosError' in x &&
      x.isAxiosError
    );
  }

  return { isAxiosError };
};

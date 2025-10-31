import type { AxiosError } from 'axios';
import type { H3Error } from 'h3';

type ErrorData = {
  message: string;
  error: boolean;
  url: string;
  statusCode: number;
  statusMessage: string;
}

export const useErrorTypes = () => {
  function isAxiosError(x: unknown): x is AxiosError<ApiErrors> {
    return !!(
      typeof x === 'object' &&
      x &&
      'isAxiosError' in x &&
      x.isAxiosError
    );
  }

  function isError(x: unknown): x is H3Error<ErrorData> { 
    return !!(typeof x === 'object' && x && 'statusMessage' in x && 'data' in x);
  }

  return { isAxiosError, isError };
};

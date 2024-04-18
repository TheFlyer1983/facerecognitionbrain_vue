import { AxiosError } from 'axios';

function useErrorTypes() {
  //eslint-disable-next-line
  function isAxiosError(x: any): x is AxiosError {
    return x.isAxiosError;
  }

  //eslint-disable-next-line
  function isError(x: any): x is Error {
    return !!x.message;
  }

  return { isAxiosError, isError };
}

export default useErrorTypes;

import { AxiosError } from 'axios';

function useErrorTypes() {
  //eslint-disable-next-line
  function isAxiosError(x: any): x is AxiosError {
    return x.isAxiosError;
  }

  return { isAxiosError };
}

export default useErrorTypes;

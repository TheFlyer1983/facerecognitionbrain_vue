import { getAuthTokenInSession } from '@/functions/storageFunctions';
import { NavigationGuardNext } from 'vue-router';
import { Routes } from './routes';

function useRouterGuards() {
  function authenticated(next: NavigationGuardNext) {
    const { token } = getAuthTokenInSession();

    return token ? next() : next({ name: Routes.Login });
  }

  return { authenticated };
}

export default useRouterGuards;

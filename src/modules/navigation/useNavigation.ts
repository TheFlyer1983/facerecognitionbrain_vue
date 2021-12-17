import {
  RouteLocationRaw,
  useRouter
} from 'vue-router';

function useNavigation() {
  const router = useRouter();

  function navigate(route: RouteLocationRaw) {
    router.push(route);
  }

  return { navigate };
}

export default useNavigation;

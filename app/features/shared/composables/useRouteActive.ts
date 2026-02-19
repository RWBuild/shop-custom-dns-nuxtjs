export function useRouteActive() {
  const route = useRoute();

  function isActive(path: string): boolean {
    return route.path === path;
  }

  function isActivePrefix(prefix: string): boolean {
    return route.path.startsWith(prefix);
  }

  return {
    isActive,
    isActivePrefix,
  };
}

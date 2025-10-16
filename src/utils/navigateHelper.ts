// navigateHelper.ts
type NavigateFunction = (path: string, options?: { replace?: boolean }) => void;

let navigateFunction: NavigateFunction | null = null;

export const setNavigate = (navigate: NavigateFunction) => {
  navigateFunction = navigate;
};

export const navigateTo = (path: string) => {
  if (navigateFunction) {
    navigateFunction(path, { replace: true });
  }
};

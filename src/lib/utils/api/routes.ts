const baseRoutes = {
  auth: '/auth',
  user: '/user',
};

const createAuthRoutes = (route: string) => {
  return new Proxy(
    {} as {
      [key in
        | 'login'
        | 'signup'
        | 'reset-password'
        | 'forgot-password'
        | 'verify-reset-otp'
        | 'verify-email']: {
        route: string;
        route_(id: string): string;
      };
    },
    {
      get(_, key) {
        return {
          get route() {
            return `${route}/${String(key)}`;
          },
          route_(id: string) {
            return `${route}/${String(key)}/${id}`;
          },
        };
      },
    },
  );
};

const apiRoutes = {
  get auth() {
    const route = baseRoutes.auth;
    return createAuthRoutes(route);
  },
};

export default apiRoutes;

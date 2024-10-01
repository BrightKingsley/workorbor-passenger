const baseRoutes = {
  auth: '/auth',
  user: '/user',
  users: '/users',
  order: '/order',
};

const createAuthRoutes = (route: string) => {
  return new Proxy(
    {} as {
      [key in
        | 'login'
        | 'signup'
        | 'reset-password'
        | 'forgot-password'
        | 'check-email-exist'
        | 'create-user'
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

const createUsersRoutes = (route: string) => {
  return new Proxy(
    {} as {
      [key in 'search']: {
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

const createOrderRoutes = (route: string) => {
  return new Proxy(
    {} as {
      [key in 'create' | 'orders']: {
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
  get users() {
    const route = baseRoutes.users;
    return createUsersRoutes(route);
  },
  get order() {
    const route = baseRoutes.order;
    // return {
    //   route(id: string) {
    //     if (!id) return route;
    //     return `${route}/${id}`;
    //   },
    // };
    return createOrderRoutes(route);
  },
};

export default apiRoutes;

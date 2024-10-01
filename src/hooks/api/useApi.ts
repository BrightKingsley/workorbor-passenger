import useAuthApi from './auth';
import useOrderApi from './order';
import useUsersApi from './users';

export default function useApi() {
  const auth = useAuthApi();
  const users = useUsersApi();
  const order = useOrderApi();

  return {
    auth,
    users,
    order,
  };
}

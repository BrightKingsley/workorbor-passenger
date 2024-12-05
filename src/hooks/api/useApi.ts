import useAuthApi from './auth';
import useChatApi from './chat';
import useOrderApi from './order';
import useUsersApi from './users';
import useWalletApi from './wallet';

export default function useApi() {
  const auth = useAuthApi();
  const users = useUsersApi();
  const order = useOrderApi();
  const chat = useChatApi();
  const wallet = useWalletApi();

  return {
    auth,
    chat,
    order,
    users,
    wallet,
  };
}

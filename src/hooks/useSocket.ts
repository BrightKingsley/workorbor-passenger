import sk from '#/lib/constants/socket';
import socket from '#/lib/utils/socket/socket';

import {useAppDispatch, useAppSelector} from './store';

export default function useSocket() {
  const dispatch = useAppDispatch();
  const {isAuthenticated, token, user, error, isLoading} = useAppSelector(
    state => state.auth,
  );
  const {currentAddress, currentPosition, lastPosition} = useAppSelector(
    state => state.location,
  );

  return {};
}

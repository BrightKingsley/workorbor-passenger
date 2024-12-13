import {useEffect} from 'react';

import {socket} from '$/src/lib/utils/socket';
import {EventName} from '$/src/lib/utils/socket/socket';
import {useUser} from '@clerk/clerk-expo';
import useLocationService from '$/src/hooks/useLocationService';
import {AlertSound} from '$/src/assets/audio';
import {useAppSelector} from '../store';

export function useOrderSocket() {
  const {user} = useUser();
  const {getCurrentAddress, getCurrentPosition} = useLocationService();

  // const {lastPosition} = useAppSelector(state => state.location);

  useEffect(() => {
    if (!user) return;
    if (!socket.id) return;
    socket.emit<EventName>('update_passenger_socket', {
      passengerId: user?.id,
      socketId: socket?.id,
    });
  }, [socket?.id, user]);

  // useEffect(() => {
  //   if (!user) return;
  //   const interval = setInterval(() => {
  //     (async () => {
  //       console.log('INTERVAL_RUNNING');
  //       try {
  //         const currentPosition = (await getCurrentPosition()) || {
  //           coords: {
  //             latitude: lastPosition?.coords.latitude,
  //             longitude: lastPosition?.coords.longitude,
  //           },
  //         };
  //         const currentAddress = await getCurrentAddress();
  //         if (!currentPosition) {
  //           return;
  //         }
  //         socket.emit<EventName>('update_rider_location', {
  //           uId: user?.id,
  //           location: {
  //             latitude: currentPosition.coords.latitude,
  //             longitude: currentPosition.coords.longitude,
  //             address: currentAddress,
  //           },
  //         });
  //       } catch (error) {
  //         console.error('INTERVAL_ERROR', error);
  //       }
  //     })();
  //   }, 5000);

  //   return () => clearInterval(interval);
  // }, []);

  return null;
}

import {useEffect} from 'react';

import {socket} from '$/src/lib/utils/socket';
import {EventName} from '$/src/lib/utils/socket/socket';
import {useUser} from '@clerk/clerk-expo';
import useLocationService from '$/src/hooks/useLocationService';
import {playAudio, stopAudio} from './actions';
import {AlertSound} from '$/src/assets/audio';

export function useOrderSocket() {
  const {user} = useUser();
  const {
    currentAddress,
    currentPosition,
    getCurrentAddress,
    getCurrentPosition,
  } = useLocationService();

  useEffect(() => {
    if (!user) return;

    console.log('ORDER_SOCKET');

    if (!socket.id) return;
    socket.emit<EventName>('update_rider_socket', {
      riderId: user?.id,
      socketId: socket?.id,
    });

    if (!socket.id) return;
    socket.emit<EventName>('update_passenger_socket', {
      passengerId: user?.id,
      socketId: socket?.id,
    });
  }, [socket.id, user?.id, user]);

  useEffect(() => {
    console.log({user});
    if (!user) return;
    const interval = setInterval(() => {
      (async () => {
        try {
          console.log('EMIT_ASYNC', user?.id);
          const currentPosition = (await getCurrentPosition()) || {
            coords: {latitude: 10, longitude: 10},
          };
          const currentAddress = await getCurrentAddress();

          if (!currentPosition) {
            console.log('😭😭😭');
            return;
          }
          socket.emit<EventName>('update_rider_location', {
            uId: user?.id,
            location: {
              latitude: currentPosition.coords.latitude,
              longitude: currentPosition.coords.longitude,
            },
          });
        } catch (error) {
          console.error('INTERVAL_ERROR', error);
        }
      })();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    socket.on('order_request', () => {
      console.log('PING_RECEIVED😭😭😭😭😭😭');
      (async () => {
        const audioFile = AlertSound;
        const sound = await playAudio(audioFile);
        setTimeout(() => {
          if (!sound) return;
          stopAudio(sound);
        }, 4000);
      })();
    });
  }, []);

  return null;
}

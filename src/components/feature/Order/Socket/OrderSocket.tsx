import {useEffect} from 'react';

import {socket} from '$/src/lib/utils/socket';
import {EventName} from '$/src/lib/utils/socket/socket';
import {useUser} from '@clerk/clerk-expo';
import useLocationService from '$/src/hooks/useLocationService';
import {AlertSound} from '$/src/assets/audio';
import {playAudio, stopAudio} from '$/src/lib/utils/audio';
import {updateOrderResponse} from '$/src/store/slices/order/helpers';
import {useAppDispatch, useAppSelector} from '$/src/hooks/store';
import {setOrderPhase, setRider} from '$/src/store/slices/order/slice';
import {OrderPhase, Vehicle, VehicleType} from '$/src/store/slices/order/types';
import {setChatId} from '$/src/store/slices/chat';

export default function OrderSocket() {
  const {user} = useUser();
  const dispatch = useAppDispatch();
  const {orderRequest} = useAppSelector(state => state.order);

  useEffect(() => {
    if (!user) return;

    if (!socket.id) return;
    console.log({passengerId: user?.id, socketId: socket?.id});

    socket.emit<EventName>('update_passenger_socket', {
      passengerId: user?.id,
      socketId: socket?.id,
    });
  }, [socket.id, user?.id, user]);

  useEffect(() => {
    socket.on<EventName>('available_rides', (data: any) => {
      console.log('AVAILABLE_RIDERS: ', data);
      dispatch(setOrderPhase(OrderPhase.enroute));
      dispatch(
        setRider({
          riderId: data.driverId,
          location: {
            coords: {
              latitude: data.riderLocation?.latitude,
              longitude: data.riderLocation?.longitude,
            },
            address: data.riderLocation?.address,
          },
          vehicle: {capacity: 4, type: VehicleType.car},
          photo: data.photo,
          lastName: data.lastName,
          firstName: data.firstName,
        }),
      );
      dispatch(setChatId(data.chatId));
      console.log('HANDSHAKE: ', orderRequest, orderRequest?.orderId);
      socket.emit('handshake', orderRequest?.orderId);
    });
  }, [socket.id, orderRequest]);

  return null;
}

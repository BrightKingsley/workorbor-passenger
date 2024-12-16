import {useEffect, useCallback, useMemo} from 'react';
import {socket} from '$/src/lib/utils/socket';
import {EventName} from '$/src/lib/utils/socket/socket';
import {useUser} from '@clerk/clerk-expo';
import {Alert} from 'react-native';
import {useAppDispatch, useAppSelector} from '$/src/hooks/store';
import {useModalControls} from '$/src/components/global/modals/ModalState';
import {
  clearOrderRequest,
  clearOrderResponse,
  setOrderPhase,
  setRider,
  updateRiderLocation,
} from '$/src/store/slices/order/slice';
import {clearChatId, setChatId} from '$/src/store/slices/chat';
import {
  OrderPhase,
  VehicleType,
  getDistanceFromLatLonInMeters,
} from '$/src/store/slices/order/types';
import {getDistance} from 'geolib';

export default function OrderSocket() {
  const {user} = useUser();
  const dispatch = useAppDispatch();
  const {orderRequest, orderPhase} = useAppSelector(state => state.order);
  const {currentPosition} = useAppSelector(state => state.location);
  const {closeAllModals, openModal} = useModalControls();

  // Emit passenger socket update only when socket ID or user ID changes
  useEffect(() => {
    if (user?.id && socket.id) {
      socket.emit<EventName>('update_passenger_socket', {
        passengerId: user.id,
        socketId: socket.id,
      });
    }
  }, [user?.id, socket.id]);

  // Memoize handlers to avoid unnecessary re-renders
  const handleAvailableRides = useCallback(
    (data: any) => {
      console.log('AVAILABLE_RIDE: ', data.riderLocation, data);
      dispatch(setOrderPhase(OrderPhase.accepted));
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
          phoneNumber: data.phoneNumber,
        }),
      );
      dispatch(setChatId(data.chatId));
      socket.emit('handshake', orderRequest?.orderId);
    },
    [dispatch, orderRequest?.orderId],
  );

  const handleRideStarted = useCallback(() => {
    dispatch(setOrderPhase(OrderPhase.enroute));
    Alert.alert('Ride started');
  }, [dispatch]);

  const handleRideCompleted = useCallback(() => {
    Alert.alert('Ride completed');
    dispatch(clearChatId());
    dispatch(clearOrderRequest());
    dispatch(clearOrderResponse());
    closeAllModals();
  }, [dispatch]);

  const handleRideCancelled = useCallback(() => {
    Alert.alert('Ride cancelled');
    dispatch(clearChatId());
    dispatch(clearOrderResponse());
    dispatch(clearOrderRequest());
    dispatch(setRider(null));
    dispatch(setOrderPhase(OrderPhase.nil));
    closeAllModals();
  }, [dispatch]);

  // Memoize socket event listeners
  useEffect(() => {
    socket.on<EventName>('available_rides', handleAvailableRides);
    socket.on<EventName>('ride_completed', handleRideCompleted);
    socket.on<EventName>('ride_started', handleRideStarted);
    socket.on<EventName>('ride_cancelled', handleRideCancelled);

    socket.on(
      'rider_current_location',
      (location: {latitude: number; longitude: number}) => {
        console.log('🥶🥶🥶RIDER_LIVE_LOCATION: ', location);
        dispatch(updateRiderLocation(location));

        if (
          orderRequest?.origin.latitude &&
          orderRequest?.origin?.longitude &&
          location
        ) {
          const distance = getDistance(
            {
              latitude: location.latitude,
              longitude: location.longitude,
            },
            {
              latitude: orderRequest?.origin.latitude,
              longitude: orderRequest?.origin.longitude,
            },
          );

          console.log({distance});

          if (distance <= 10 && orderPhase !== OrderPhase.enroute) {
            dispatch(setOrderPhase(OrderPhase.rideArrived));
          }
        }
      },
    );

    // Cleanup listeners on unmount or re-render to avoid memory leaks
    return () => {
      socket.off<EventName>('available_rides', handleAvailableRides);
      socket.off<EventName>('ride_completed', handleRideCompleted);
      socket.off<EventName>('ride_started', handleRideStarted);
      socket.off<EventName>('ride_cancelled', handleRideCancelled);
    };
  }, [
    handleAvailableRides,
    handleRideCompleted,
    handleRideStarted,
    handleRideCancelled,
  ]);

  return null;
}

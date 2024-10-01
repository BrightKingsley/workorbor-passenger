import {useEffect, useState} from 'react';
// import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import {useAppDispatch, useAppSelector} from './store';
import {
  setCurrentAddress,
  setCurrentPosition,
  setLastPosition,
} from '#/store/slices/location';
import axios, {AxiosResponse} from 'axios';
import {getGeocodeUrl, hasMovedSignificantly} from '#/lib/utils/location';
import {snakeToCamel} from '#/lib/utils/objects';

let geoCodeRunCount = 0;
export default function useLocationService() {
  const {currentPosition, currentAddress} = useAppSelector(
    state => state.location,
  );
  const dispatch = useAppDispatch();

  const [foregroundPermission, setForegroundPermission] =
    useState<Location.PermissionStatus | null>(null);
  const [backgroundPermission, setBackgroundPermission] =
    useState<Location.PermissionStatus | null>(null);

  const getBackgroundLocationPermission = async () => {
    let {status: foregroundPermissionStatus} =
      await Location.requestForegroundPermissionsAsync();
    if (foregroundPermissionStatus !== 'granted') {
      console.log('Foreground location permission denied');
      return;
    }

    let {status: backgroundPermissionStatus} =
      await Location.requestBackgroundPermissionsAsync();

    if (backgroundPermissionStatus !== 'granted') {
      console.log('Background location permission denied');
    }
    // Start background location tracking
    await Location.startLocationUpdatesAsync('background-location-task', {
      accuracy: Location.Accuracy.High,
      timeInterval: 1000, // Update every second
      distanceInterval: 1, // Update every meter
    });
  };

  const checkLocationPermissions = async () => {
    const {status: foregroundStatus} =
      await Location.getForegroundPermissionsAsync();
    const {status: backgroundStatus} =
      await Location.getBackgroundPermissionsAsync();

    setForegroundPermission(foregroundStatus);
    setBackgroundPermission(backgroundStatus);

    return {foregroundStatus, backgroundStatus};
  };

  const getCurrentPosition = async () => {
    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    console.log('POSITION!');
    // if (!position) {
    //   return setTimeout(() => {
    //     return getCurrentPosition();
    //   }, 5000);
    // }

    dispatch(setCurrentPosition({currentPosition: position}));
    return position;
  };

  const getLastPosition = async () => {
    const position = await Location.getLastKnownPositionAsync({});
    // if (!position) {
    //   return setTimeout(() => {
    //     getLastPosition();
    //   }, 5000);
    // }
    dispatch(setLastPosition({lastPosition: position}));
    return position;
  };

  const getCurrentAddress =
    async (): Promise<Location.LocationGeocodedAddress | null> => {
      if (
        !(
          currentPosition &&
          currentPosition.coords &&
          currentPosition.coords.latitude &&
          currentPosition.coords.longitude
        )
      ) {
        await Location.getCurrentPositionAsync({});
        return await getCurrentAddress();
      }
      // if (
      //   !hasMovedSignificantly({
      //     currLat: currentPosition?.coords.latitude,
      //     currLng: currentPosition?.coords.longitude,
      //     prevLat: currentPosition?.coords.latitude,
      //     prevLng: currentPosition?.coords.longitude,
      //   }) &&
      //   currentAddress
      // ) {
      //   console.log('HAS_NOT_MOVED_SIGNIFICANTLY');
      //   return currentAddress;
      // }
      geoCodeRunCount++;

      // let result = await Location.reverseGeocodeAsync({
      //   latitude: currentPosition?.coords?.latitude,
      //   longitude: currentPosition?.coords?.longitude,
      // });

      let response: AxiosResponse<{
        results: Location.LocationGeocodedAddress[];
      }> = await axios.get(
        getGeocodeUrl({
          lat: currentPosition?.coords?.latitude,
          lng: currentPosition?.coords?.longitude,
        }),
      );

      const result = response.data.results;

      // if (!result) return await getCurrentAddress();

      const address = snakeToCamel(result[0]);

      const _address = result[0];

      console.log({
        _address,
      });

      _address.address_components.map(component => {
        console.log({component});
        return component;
      });

      dispatch(setCurrentAddress({currentAddress: address}));

      return address;
    };

  // TaskManager.defineTask('background-location-task', ({data, error}) => {
  // if (error) {
  //   console.error(error);
  //   return;
  // }

  // if (data) {
  //   const {locations} = data as LocationTaskData;
  //   console.log('Background location:', locations);
  // }
  // });

  useEffect(() => {
    (async () => {
      await getBackgroundLocationPermission();
      await Location.getForegroundPermissionsAsync();
      getLastPosition();
      getCurrentPosition();
    })();
  }, []);

  return {
    currentAddress,
    currentPosition,
    foregroundPermission,
    backgroundPermission,
    checkPermissions: checkLocationPermissions,
    getCurrentPosition,
    getLastPosition,
    getCurrentAddress,
  };
}

// Define the structure of the expected data
interface LocationTaskData {
  locations: Location.LocationObject[];
}

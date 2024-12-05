// import axios, {AxiosResponse} from 'axios';
// import * as Location from 'expo-location';
// import {useCallback, useEffect, useState} from 'react';
// import {Alert} from 'react-native';

// import {getGeocodeUrl, hasMovedSignificantly} from '#/lib/utils/location';
// import {snakeToCamel} from '#/lib/utils/objects';
// import {
//   setCurrentAddress,
//   setCurrentPosition,
//   setLastPosition,
// } from '#/store/slices/location';

// import {useAppDispatch, useAppSelector} from './store';

// export default function useLocationService() {
//   const {currentPosition, currentAddress} = useAppSelector(
//     state => state.location,
//   );
//   const dispatch = useAppDispatch();

//   useEffect(() => {
//     console.log('LOCATION_SERVICE_RUNNING: ');
//   }, []);

//   const [foregroundPermission, setForegroundPermission] =
//     useState<Location.PermissionStatus | null>(null);
//   const [backgroundPermission, setBackgroundPermission] =
//     useState<Location.PermissionStatus | null>(null);

//   const checkLocationEnabled = useCallback(async () => {
//     const locationEnabled = await Location.hasServicesEnabledAsync();

//     if (locationEnabled) {
//       console.log('Location services are enabled');
//     } else {
//       // console.log('Location services are not enabled');
//       Alert.alert('Location services are not enabled');
//     }
//   }, []);

//   const getLocationPermissions = useCallback(async () => {
//     let {status: foregroundPermissionStatus} =
//       await Location.requestForegroundPermissionsAsync();
//     if (foregroundPermissionStatus !== 'granted') {
//       return Alert.alert(
//         'Foreground location permission is required to use the app',
//       );
//     }

//     let {status: backgroundPermissionStatus} =
//       await Location.requestBackgroundPermissionsAsync();

//     console.log('BACKGROUND_PERMISSION_STATUS: ', backgroundPermissionStatus);

//     if (backgroundPermissionStatus !== 'granted') {
//       return Alert.alert(
//         'Background location permission is required to use the app',
//       );
//     }

//     await Location.startLocationUpdatesAsync('background-location-task', {
//       accuracy: Location.Accuracy.High,
//       timeInterval: 10000, // Update every 10 seconds
//       distanceInterval: 10, // Update every 10 meters
//     });
//   }, []);

//   const checkLocationPermissions = useCallback(async () => {
//     const {status: foregroundStatus} =
//       await Location.getForegroundPermissionsAsync();
//     const {status: backgroundStatus} =
//       await Location.getBackgroundPermissionsAsync();

//     setForegroundPermission(foregroundStatus);
//     setBackgroundPermission(backgroundStatus);

//     if (foregroundStatus !== 'granted') {
//       Alert.alert('Foreground location permission is not granted');
//     }

//     if (backgroundStatus !== 'granted') {
//       Alert.alert('Background location permission is not granted');
//     }

//     return {foregroundStatus, backgroundStatus};
//   }, []);

//   const getCurrentPosition = useCallback(async () => {
//     try {
//       const position = await Location.getCurrentPositionAsync({
//         accuracy: Location.Accuracy.Highest,
//       });
//       console.log('CURRENT_POSITION: ', position);
//       dispatch(setCurrentPosition({currentPosition: position}));
//       return position;
//     } catch (error) {
//       console.error('CURRENT_POSITION: ', error);
//       return null;
//     }
//   }, [dispatch]);

//   const getLastPosition = useCallback(async () => {
//     try {
//       let position = await Location.getLastKnownPositionAsync({});
//       if (!position) {
//         position = {
//           coords: {
//             latitude: 6.3156,
//             longitude: -10.8074,
//             altitude: 0,
//             accuracy: 0,
//             altitudeAccuracy: 0,
//             heading: 0,
//             speed: 0,
//           },
//           timestamp: Date.now(),
//           mocked: false,
//         };
//       }
//       console.log('LAST_POSITION: ', position);
//       dispatch(setLastPosition({lastPosition: position}));
//       dispatch(setCurrentPosition({currentPosition: position}));
//       return position;
//     } catch (error) {
//       console.error('LAST_POSITION: ', error);
//       return null;
//     }
//   }, [dispatch]);

//   const getCurrentAddress = useCallback(
//     async (coords?: Partial<Location.LocationObjectCoords>) => {
//       try {
//         if (
//           !coords ||
//           !currentPosition ||
//           !currentPosition.coords.latitude ||
//           !currentPosition.coords.longitude
//         ) {
//           // console.log('Fetching current position...', currentPosition);
//           // const position = await getCurrentPosition();
//           // if (!position) {
//           //   console.error('Failed to fetch current position');
//           //   return null;
//           // }
//           return;
//         }

//         let response: AxiosResponse<{
//           results: Location.LocationGeocodedAddress[];
//         }> = await axios.get(
//           getGeocodeUrl({
//             lat: coords.latitude || currentPosition?.coords?.latitude,
//             lng: coords.latitude || currentPosition?.coords?.longitude,
//           }),
//         );

//         const result = response.data.results;
//         const address = snakeToCamel(result[0]);

//         console.log('📍ADDRESS:useLocationService.tsx ', address);

//         dispatch(setCurrentAddress({currentAddress: address}));

//         return address;
//       } catch (error) {
//         console.error('📍CURRENT_ADDRESS: ', error);
//       }
//     },
//     [currentPosition, dispatch],
//   );

//   return {
//     currentAddress,
//     currentPosition,
//     foregroundPermission,
//     backgroundPermission,
//     checkLocationPermissions,
//     getCurrentPosition,
//     getLastPosition,
//     getCurrentAddress,
//     checkLocationEnabled,
//     getLocationPermissions,
//   };
// }

// // Define the structure of the expected data
// interface LocationTaskData {
//   locations: Location.LocationObject[];
// }

import {useEffect, useState} from 'react';
import * as Location from 'expo-location';
import {
  setCurrentAddress,
  setCurrentPosition,
  setLastPosition,
} from '#/store/slices/location';
import axios, {AxiosResponse} from 'axios';
import {getGeocodeUrl, hasMovedSignificantly} from '#/lib/utils/location';
import {snakeToCamel} from '#/lib/utils/objects';
import {useAppDispatch, useAppSelector} from './store';

export default function useLocationService() {
  const {currentPosition, currentAddress} = useAppSelector(
    state => state.location,
  );
  const dispatch = useAppDispatch();

  const [foregroundPermission, setForegroundPermission] =
    useState<Location.PermissionStatus | null>(null);
  const [backgroundPermission, setBackgroundPermission] =
    useState<Location.PermissionStatus | null>(null);

  const requestPermissions = async () => {
    try {
      const {status: fgStatus} =
        await Location.requestForegroundPermissionsAsync();
      setForegroundPermission(fgStatus);

      if (fgStatus === 'granted') {
        const {status: bgStatus} =
          await Location.requestBackgroundPermissionsAsync();
        setBackgroundPermission(bgStatus);
      }
    } catch (error) {
      console.error('Permission request error:', error);
    }
  };

  const getCurrentPosition = async () => {
    try {
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      dispatch(setCurrentPosition({currentPosition: position}));
      return position;
    } catch (error) {
      console.error('Error fetching current position:', error);
    }
  };

  const getLastPosition = async () => {
    try {
      const position = await Location.getLastKnownPositionAsync({});
      if (position) {
        dispatch(setLastPosition({lastPosition: position}));
      }
      return position;
    } catch (error) {
      console.error('Error fetching last position:', error);
    }
  };

  const getCurrentAddress =
    async (): Promise<Location.LocationGeocodedAddress | null> => {
      try {
        if (
          !currentPosition?.coords?.latitude ||
          !currentPosition?.coords?.longitude
        ) {
          const position = await getCurrentPosition();
          if (!position) return null;
        }

        const {latitude, longitude} = currentPosition.coords;
        const response: AxiosResponse<{
          results: Location.LocationGeocodedAddress[];
        }> = await axios.get(getGeocodeUrl({lat: latitude, lng: longitude}));

        const result = response.data.results;
        if (result && result.length > 0) {
          const address = snakeToCamel(result[0]);
          dispatch(setCurrentAddress({currentAddress: address}));
          return address;
        }
      } catch (error) {
        console.error('Error fetching address:', error);
      }
      return null;
    };

  const startLocationUpdates = async () => {
    try {
      await Location.startLocationUpdatesAsync('background-location-task', {
        accuracy: Location.Accuracy.High,
        timeInterval: 1000,
        distanceInterval: 1,
      });
    } catch (error) {
      console.error('Error starting location updates:', error);
    }
  };

  const stopLocationUpdates = async () => {
    try {
      await Location.stopLocationUpdatesAsync('background-location-task');
    } catch (error) {
      console.error('Error stopping location updates:', error);
    }
  };

  useEffect(() => {
    (async () => {
      await requestPermissions();
      await getLastPosition();
      await getCurrentPosition();
      await startLocationUpdates();
    })();

    return () => {
      stopLocationUpdates();
    };
  }, []);

  return {
    currentAddress,
    currentPosition,
    foregroundPermission,
    backgroundPermission,
    requestPermissions,
    getCurrentPosition,
    getLastPosition,
    getCurrentAddress,
    stopLocationUpdates,
  };
}

import {useEffect, useState} from 'react';
import {AppState, AppStateStatus} from 'react-native';

import {handleError} from '$/src/lib/utils/errors';
import useLocationService from '$/src/hooks/useLocationService';

const runOnce = 1;

export default function LocationUpdater() {
  const {
    requestPermissions,
    startLocationUpdates,
    stopLocationUpdates,
    getCurrentPosition,
    getLastPosition,
    getCurrentAddress,
  } = useLocationService();

  const [locationCache, setLocationCache] = useState<Record<string, any>>({});

  const fetchAddressFromCache = async (latitude: number, longitude: number) => {
    const cacheKey = `${latitude},${longitude}`;
    return locationCache[cacheKey];
  };

  const cacheAddress = (latitude: number, longitude: number, address: any) => {
    const cacheKey = `${latitude},${longitude}`;
    setLocationCache(prevCache => ({
      ...prevCache,
      [cacheKey]: address,
    }));
  };

  useEffect(() => {
    console.log('THIS IS RUN ONCE');
    let isMounted = true; // Track component mounted state
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState !== 'active') {
        console.log(
          'App moved to background or inactive, stopping location updates',
        );
        stopLocationUpdates();
      }
    };

    (async () => {
      try {
        await requestPermissions();
        if (isMounted) {
          console.log('Starting location updates...');
          await startLocationUpdates();
          //   const position = await getCurrentPosition();
          //   if (!position) await getLastPosition();
          const position = await getCurrentPosition();
          if (!position) {
            await getLastPosition();
          } else {
            const cachedAddress = await fetchAddressFromCache(
              position.coords.latitude,
              position.coords.longitude,
            );
            if (!cachedAddress) {
              const address = await getCurrentAddress();
              cacheAddress(
                position.coords.latitude,
                position.coords.longitude,
                address,
              );
            }
          }
        }
      } catch (error) {
        const errorMessage = handleError(error);
        console.error('Error in location updates:', error);
      }
    })();

    // Add AppState listener
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      isMounted = false;
      console.log('Cleaning up location updates...');
      stopLocationUpdates();
      subscription.remove();
    };
  }, [runOnce]);

  return null;
}

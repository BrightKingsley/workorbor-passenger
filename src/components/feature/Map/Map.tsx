import {useUser} from '@clerk/clerk-expo';
import React, {
  ComponentProps,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {ActivityIndicator, Image, ImageStyle} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

// import LottieView from 'lottie-react-native';
import {useAppDispatch, useAppSelector} from '#/hooks/store';
import {GOOGLE_MAPS_API_KEY} from '#/lib/constants';
import {a} from '#/lib/style/atoms';
import {colors} from '#/lib/theme/palette';
import {
  setCurrentAddress,
  setCurrentPosition,
} from '$/src/store/slices/location';

import {Column} from '../../global';
import {Text} from '../../global/Themed';
import {customMapStyle} from './style';
import {DirectionsProps, MapProps, MarkerProps} from './types';

const DELTAS = {
  latitudeDelta: 1,
  longitudeDelta: 1,
};

export default function Map({
  onMapReady,
  initialRegion,
  style = {},
  children,
  ...mapProps
}: MapProps) {
  const mapRef = useRef<MapView>(null);

  const {user} = useUser();
  const {currentPosition, lastPosition, currentAddress} = useAppSelector(
    state => state.location,
  );
  const {orderRequest, riderInfo} = useAppSelector(state => state.order);

  const [directions, setDirections] = useState<DirectionsProps | null>(null);
  const [markers, setMarkers] = useState<MarkerProps[]>([]);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (orderRequest?.origin && orderRequest?.destination) {
      setDirections({
        origin: {
          latitude: orderRequest?.origin?.latitude!,
          longitude: orderRequest?.origin?.longitude!,
        },
        destination: {
          latitude: orderRequest?.destination?.latitude!,
          longitude: orderRequest?.destination?.longitude!,
        },
        strokeWidth: 2,
        strokeColor: colors.primary,
        // onReady: result => {
        //   console.log('ON_MAP_READY: ', result);
        // },
      });
    } else setDirections(null);
  }, [orderRequest]);

  useEffect(() => {
    setMarkers(
      [
        currentPosition || lastPosition
          ? {
              coords: (currentPosition || lastPosition)?.coords!,
              description: 'you are here',
              identifier: 'current',
              alt: (
                <Image
                  source={{uri: user?.imageUrl}}
                  style={[a.w_full, a.h_full] as ImageStyle}
                />
              ),
            }
          : undefined,
        orderRequest?.origin
          ? {
              coords: {
                latitude: orderRequest?.origin?.latitude || 0,
                longitude: orderRequest?.origin?.longitude || 0,
              },
              identifier: 'origin',
            }
          : undefined,
        orderRequest?.destination
          ? {
              coords: {
                latitude: orderRequest?.destination?.latitude || 0,
                longitude: orderRequest?.destination?.longitude || 0,
              },
              identifier: 'destination',
            }
          : undefined,
        riderInfo?.location?.coords
          ? {
              coords: {
                latitude: riderInfo?.location?.coords?.latitude || 0,
                longitude: riderInfo?.location?.coords?.longitude || 0,
              },
              identifier: 'rider',
            }
          : undefined,
      ].filter(Boolean) as MarkerProps[],
    );
  }, [currentPosition, lastPosition, orderRequest, riderInfo, user]);

  const initRegion = useMemo(
    () => ({
      ...DELTAS,
      // latitude: (currentPosition || lastPosition)?.coords?.latitude! ?? 6.3156,
      latitude: (currentPosition || lastPosition)?.coords?.latitude!,
      longitude:
        // (currentPosition || lastPosition)?.coords?.longitude! ?? -10.8074,
        (currentPosition || lastPosition)?.coords?.longitude!,
    }),
    [currentPosition, lastPosition],
  );

  const initializeMapItems = useCallback(() => {
    console.log('MAP_ITEMS_INITIALIZED');
    if (mapRef.current) {
      console.log('MAP_CURRENT', currentAddress);
      (async () => {
        if (currentAddress) return;
        console.log('NO_CURRENT_ADDRESS:', currentAddress);
        const address = await mapRef.current?.addressForCoordinate({
          latitude: initRegion.latitude,
          longitude: initRegion.longitude,
        });
        console.log('ADDRESS FROM MAP: ', address);

        if (address) {
          console.log('COUNTRY_CODE: ', address.countryCode);
          dispatch(setCurrentAddress({currentAddress: address}));
        }
      })();
    }
  }, [initRegion, currentAddress, dispatch]);

  const fitToCoordinates = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.fitToCoordinates(
        [
          {
            latitude: orderRequest?.origin?.latitude || 0,
            longitude: orderRequest?.origin?.longitude || 0,
          },
          {
            latitude: orderRequest?.destination?.latitude || 0,
            longitude: orderRequest?.destination?.longitude || 0,
          },
        ],
        {
          edgePadding: {top: 50, right: 150, bottom: 150, left: 150},
          animated: true,
        },
      );
    }
  }, [orderRequest]);

  const animateToRegion = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: orderRequest
          ? orderRequest?.origin?.latitude || 0
          : initRegion?.latitude,
        longitude: orderRequest
          ? orderRequest?.origin?.longitude || 0
          : initRegion?.longitude,
        latitudeDelta: orderRequest
          ? orderRequest?.origin?.latitude || 0
          : initRegion?.latitude,
        longitudeDelta: orderRequest
          ? orderRequest?.origin?.longitude || 0
          : initRegion?.longitude,
      });
    }
  }, [orderRequest, initRegion]);

  const animateCamera = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.animateCamera({
        center: {
          latitude: orderRequest
            ? orderRequest?.origin?.latitude || 0
            : initRegion?.latitude,
          longitude: orderRequest
            ? orderRequest?.origin?.longitude || 0
            : initRegion?.longitude,
        },
        zoom: 14,
      });
    }
  }, [orderRequest, initRegion]);

  useEffect(() => {
    initializeMapItems();
  }, [initializeMapItems]);

  useEffect(() => {
    fitToCoordinates();
  }, [fitToCoordinates]);

  useEffect(() => {
    animateToRegion();
  }, [animateToRegion]);

  useEffect(() => {
    animateCamera();
  }, [animateCamera]);

  useEffect(() => {
    if (riderInfo?.location?.coords) {
      const interval = setInterval(() => {
        mapRef.current?.animateCamera({
          center: {
            latitude: riderInfo.location.coords.latitude,
            longitude: riderInfo.location.coords.longitude,
          },
          zoom: 14,
        });
      }, 5000); // Update every 5 seconds

      return () => clearInterval(interval);
    }
  }, [riderInfo]);

  if (!(initRegion.latitude && initRegion.longitude))
    return (
      <Column style={[a.align_center, a.justify_center, a.h_full]}>
        <ActivityIndicator size={50} color={colors.primarydarker} />
        <Text style={[a.mt_2xl]}>Getting current position</Text>
      </Column>
    );

  return (
    <MapView
      customMapStyle={customMapStyle}
      userInterfaceStyle="dark"
      ref={mapRef}
      // onMapReady={initializeMapItems}
      initialRegion={{
        ...initRegion,
        ...DELTAS,
      }}
      onMapLoaded={initializeMapItems}
      provider={PROVIDER_GOOGLE}
      style={[a.top_(0), a.right_(0), a.w_full, a.h_full, style]}
      {...mapProps}>
      {markers.map((marker, i) =>
        marker?.coords?.latitude && marker?.coords?.longitude ? (
          <CustomMarker
            key={i}
            index={i}
            coordinate={marker.coords}
            description={marker.description || 'nil'}
            identifier={marker.identifier || 'nil'}
          />
        ) : null,
      )}
      {directions && (
        <MapViewDirections
          origin={directions.origin}
          destination={directions.destination}
          apikey={GOOGLE_MAPS_API_KEY}
          strokeWidth={directions.strokeWidth || 4}
          strokeColor={directions.strokeColor || colors.primary}
          resetOnChange
          onReady={result => directions.onReady?.(result)}
        />
      )}

      {directions && riderInfo?.location?.coords && (
        <MapViewDirections
          origin={directions.origin}
          destination={{
            latitude: riderInfo.location.coords.latitude,
            longitude: riderInfo.location.coords.longitude,
          }}
          apikey={GOOGLE_MAPS_API_KEY}
          strokeWidth={directions.strokeWidth || 4}
          strokeColor={'orange'}
          resetOnChange
          onReady={result => directions.onReady?.(result)}
        />
      )}
      {children}
    </MapView>
  );
}

const CustomMarker = memo(
  ({
    // index,
    ...markerProps
  }: ComponentProps<typeof Marker> & {index: number}) => {
    return (
      <Marker
        tracksInfoWindowChanges
        style={[a.overflow_visible, a.w_(100), a.h_(100)]}
        {...markerProps}>
        {/* {markerProps.children || (
        <View style={[a.relative, a.align_center, a.justify_center]}>
          {showLabel && label && <Popup label={label} />}
          <LottieView
            source={MarkerYellow}
            style={[a.w_(100), a.h_(100)]}
            autoPlay
            duration={2000 + (index + 2) * 50}
            loop={true}
          />
        </View>
      )} */}
        {/* <BalloonMarker>{markerProps.children}</BalloonMarker> */}
        {/* {markerProps.identifier === 'current' && (
        <PingAnimation coreSize={30} color={colors.yellow_2} pingSize={300} />
      )} */}
      </Marker>
    );
  },
);

// const Popup = memo(({label}: {label: string}) => {
//   return (
//     <View
//       style={[
//         a.rounded_sm,
//         a.p_sm,
//         a.absolute,
//         a.z_10,
//         a.bg_('white'),
//         a.bottom_(-40),
//         {
//           shadowColor: '#000',
//           shadowOffset: {width: 0, height: 2},
//           shadowOpacity: 0.5,
//           shadowRadius: 2,
//           elevation: 2,
//         },
//       ]}>
//       <Text style={[a.text_center]}>{label}</Text>
//     </View>
//   );
// });

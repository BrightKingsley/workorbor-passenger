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
import {useAppSelector} from '#/hooks/store';
import {GOOGLE_MAPS_API_KEY} from '#/lib/constants';
import {a} from '#/lib/style/atoms';
import {colors} from '#/lib/theme/palette';

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
  const {currentPosition, lastPosition} = useAppSelector(
    state => state.location,
  );
  const {orderRequest} = useAppSelector(state => state.order);

  const [directions, setDirections] = useState<DirectionsProps | null>(null);

  // const markers: MarkerProps[] = [
  //   {
  //     coords: {
  //       latitude: orderRequest?.origin?.latitude!,
  //       longitude: orderRequest?.origin?.longitude!,
  //     },
  //     description: 'pick up',
  //     identifier: 'origin',
  //   },
  //   {
  //     coords: {
  //       latitude: orderRequest?.destination?.latitude!,
  //       longitude: orderRequest?.destination?.longitude!,
  //     },
  //     description: 'destination',
  //     identifier: 'destination',
  //   },
  // ];

  // const originLocation = markers.find(
  //   marker =>
  //     marker.identifier === 'origin' && marker.coords.latitude !== undefined,
  // );

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

  const markers = useMemo(
    () => [
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
        : // : {
          //     coords: {
          //       latitude: 6.3156,
          //       longitude: -10.8074,
          //     },
          //     description: 'you are here',
          //     identifier: 'current',
          //     alt: (
          //       <Image
          //         source={{uri: user?.imageUrl}}
          //         style={[a.w_full, a.h_full] as ImageStyle}
          //       />
          //     ),
          //   },
          undefined,
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
    ],
    [currentPosition, lastPosition, orderRequest, , user],
  );

  const initRegion = useMemo(
    () => ({
      ...DELTAS,
      latitude: (currentPosition || lastPosition)?.coords.latitude! ?? 6.3156,
      longitude:
        (currentPosition || lastPosition)?.coords.longitude! ?? -10.8074,
    }),
    [currentPosition, lastPosition],
  );

  const initializeMapItems = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.fitToSuppliedMarkers(['destination', 'origin'], {
        edgePadding: {top: 50, right: 50, bottom: 50, left: 50},
        animated: true,
      });
      mapRef.current.animateToRegion(initRegion);
      mapRef.current.animateCamera({
        center: {
          latitude: initRegion.latitude,
          longitude: initRegion.longitude,
        },
        zoom: 16,
      });
    }
  }, [initRegion]);

  useEffect(() => {
    initializeMapItems();
  }, [initializeMapItems]);

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
      onMapReady={onMapReady}
      initialRegion={{
        ...(initialRegion || initRegion),
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

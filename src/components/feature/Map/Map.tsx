import useLocationService from '#/hooks/useLocationService';
import {BOTTOM_TAB_HEIGHT, GOOGLE_MAPS_API_KEY} from '#/lib/constants';
import {a} from '#/lib/style/atoms';
import {colors} from '#/lib/theme/palette';
import React, {
  ComponentProps,
  LegacyRef,
  PropsWithChildren,
  RefAttributes,
  useEffect,
  useRef,
  useState,
} from 'react';
import MapView, {
  LatLng,
  Marker,
  PROVIDER_GOOGLE,
  Region,
  Polyline,
  PROVIDER_DEFAULT,
} from 'react-native-maps';
import MapViewDirections, {
  MapDirectionsResponse,
  MapViewDirectionsDestination,
} from 'react-native-maps-directions';
import {
  ActivityIndicator,
  Image,
  ImageStyle,
  Platform,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import {color} from '#/lib/ui/tokens';
import Animated, {interpolate, useAnimatedStyle} from 'react-native-reanimated';
// import LottieView from 'lottie-react-native';
import MarkerYellow from '#/assets/animation/marker-aqua.json';
import {useAppSelector} from '#/hooks/store';
import {customMapStyle} from './style';
import {DirectionsProps, MapProps, MarkerProps} from './types';
import {Text, View} from '../../global/Themed';
import {Column} from '../../global';
import BalloonMarker from './Markers/Marker';
import {useUser} from '@clerk/clerk-expo';
import PingAnimation from '../../global/PingAnimation';

const DELTAS = {
  latitudeDelta: 1,
  longitudeDelta: 1,
};

export default function Map({
  minZoomLevel = 10,
  onMapReady,
  initialRegion,
  style = {},
  children,
  ...mapProps
}: MapProps) {
  const mapRef = useRef<MapView>();

  const {user} = useUser();

  const {currentPosition, lastPosition} = useAppSelector(
    state => state.location,
  );
  const {orderRequest} = useAppSelector(state => state.order);

  const [directions, setDirections] = useState<DirectionsProps | null>(null);

  const markers: MarkerProps[] = [
    {
      coords: {
        latitude: orderRequest?.origin?.latitude!,
        longitude: orderRequest?.origin?.longitude!,
      },
      description: 'pick up',
      identifier: 'origin',
    },
    {
      coords: {
        latitude: orderRequest?.destination?.latitude!,
        longitude: orderRequest?.destination?.longitude!,
      },
      description: 'destination',
      identifier: 'destination',
    },
  ];

  const originLocation = markers.find(
    marker =>
      marker.identifier === 'origin' && marker.coords.latitude !== undefined,
  );

  useEffect(() => {
    if (orderRequest?.origin && orderRequest?.destination) {
      setDirections({
        origin: {
          latitude: orderRequest?.origin?.latitude!,
          longitude: orderRequest?.origin?.longitude!,
        },
        // origin: {latitude: 10.3121757, longitude: 10.3121757},
        destination: {
          latitude: orderRequest?.destination?.latitude!,
          longitude: orderRequest?.destination?.longitude!,
        },
        // destination: {latitude: 10.2650001, longitude: 10.2650001},
        strokeWidth: 2,
        strokeColor: colors.primary,
        onReady: result => {},
      });
    } else setDirections(null);
  }, [orderRequest]);

  const _markers: (MarkerProps | undefined)[] = [
    !originLocation
      ? {
          coords: currentPosition?.coords!,
          description: 'your are here',
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
  ];

  const initRegion: Region = {
    ...DELTAS,
    latitude:
      originLocation && originLocation?.coords.latitude
        ? originLocation?.coords.latitude
        : (currentPosition || lastPosition)?.coords.latitude!,
    longitude:
      originLocation && originLocation?.coords.longitude
        ? originLocation?.coords.longitude
        : (currentPosition || lastPosition)?.coords.longitude!,
  };

  const initializeMapItems = () => {
    mapRef?.current?.fitToSuppliedMarkers(['destination', 'origin'], {
      edgePadding: {top: 50, right: 50, bottom: 50, left: 50},
      animated: true,
    });
    mapRef?.current?.animateToRegion(initRegion);
    mapRef?.current?.animateCamera({
      center: {latitude: initRegion.latitude, longitude: initRegion.longitude},
      zoom: 16,
    });
  };

  useEffect(() => {
    initializeMapItems();
  }, [originLocation]);

  if (!(initRegion.latitude && initRegion.longitude))
    return (
      <Column style={[a.align_center, a.justify_center, a.h_full]}>
        <ActivityIndicator size={50} color={colors.primary} />
        <Text style={[a.mt_2xl]}>Getting current position</Text>
      </Column>
    );

  return (
    <MapView
      customMapStyle={customMapStyle}
      userInterfaceStyle="dark"
      ref={mapRef as LegacyRef<MapView>}
      // minZoomLevel={10}
      onMapReady={onMapReady}
      initialRegion={{
        ...(initialRegion || initRegion),
        ...DELTAS,
      }}
      onMapLoaded={() => {
        initializeMapItems();
      }}
      provider={PROVIDER_GOOGLE}
      style={[a.top_(0), a.right_(0), a.w_full, a.h_full, style]}
      {...mapProps}>
      {_markers?.map((marker, i) =>
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
          strokeColor={directions.strokeColor || colors.primarydarker}
          resetOnChange
          onReady={result => directions.onReady?.(result)}
        />
        // <></>
      )}
      {children}
    </MapView>
  );
}

const CustomMarker = ({
  index,
  ...markerProps
}: ComponentProps<typeof Marker> & {index: number}) => {
  const [showLabel, setShowLabel] = useState(true);
  const label = markerProps.description;

  return (
    <Marker
      tracksInfoWindowChanges
      style={[a.overflow_visible, a.w_(100), a.h_(100)]}
      onPress={() => {
        setShowLabel(prev => !prev);
      }}
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
        // <View style={[a.w_(300), a.h_(300)]}>
        <PingAnimation coreSize={30} color={colors.primary} pingSize={300} />
        // </View>
      )} */}
    </Marker>
  );
};

const Popup = React.memo(({label}: {label: string}) => {
  return (
    <View
      style={[
        a.rounded_sm,
        a.p_sm,
        a.absolute,
        a.z_10,
        a.bg_('white'),
        a.bottom_(-40),
        {
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.5,
          shadowRadius: 2,
          elevation: 2,
        },
      ]}>
      <Text style={[a.text_center]}>{label}</Text>
    </View>
  );
});

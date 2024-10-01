import {ComponentProps, PropsWithChildren} from 'react';
import MapView, {LatLng, Region} from 'react-native-maps';
import {MapDirectionsResponse} from 'react-native-maps-directions';

export interface MarkerProps {
  coords: LatLng;
  description?: string;
  identifier?: 'current' | 'destination' | 'origin';
  alt?: React.ReactNode;
}

export interface DirectionsProps {
  origin: LatLng;
  destination: LatLng;
  strokeWidth?: number;
  strokeColor?: string;
  onReady?: (result: MapDirectionsResponse) => void;
}

export interface MapProps
  extends PropsWithChildren<ComponentProps<typeof MapView>> {
  mapRef?: React.Ref<MapView>;
  minZoomLevel?: number;
  onMapReady?: () => void;
  initialRegion?: Region;
  markers?: MarkerProps[];
  directions?: DirectionsProps | null;
  style?: object;
}

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

export interface MapStyle {
  featureType?: FeatureType;
  elementType?: ElementType;
  stylers: Styler[];
}

type FeatureType =
  | 'all'
  | 'administrative'
  | 'administrative.country'
  | 'administrative.land_parcel'
  | 'administrative.locality'
  | 'administrative.neighborhood'
  | 'administrative.province'
  | 'landscape'
  | 'landscape.man_made'
  | 'landscape.natural'
  | 'poi'
  | 'poi.attraction'
  | 'poi.business'
  | 'poi.government'
  | 'poi.medical'
  | 'poi.park'
  | 'poi.place_of_worship'
  | 'poi.school'
  | 'poi.sports_complex'
  | 'road'
  | 'road.arterial'
  | 'road.highway'
  | 'road.local'
  | 'transit'
  | 'transit.line'
  | 'transit.station'
  | 'water';

type ElementType =
  | 'all'
  | 'geometry'
  | 'geometry.fill'
  | 'geometry.stroke'
  | 'labels'
  | 'labels.icon'
  | 'labels.text'
  | 'labels.text.fill'
  | 'labels.text.stroke';

interface Styler {
  color?: string; // Hex color or named color
  visibility?: 'on' | 'off' | 'simplified'; // Whether the feature is visible
  weight?: number; // Line weight in pixels (for geometry.stroke)
  lightness?: number; // Value between -100 and 100 to adjust brightness
  saturation?: number; // Value between -100 and 100 to adjust color intensity
  gamma?: number; // Adjusts contrast (1.0 is normal)
  hue?: string; // Base color tone (e.g., "#ff0000")
}

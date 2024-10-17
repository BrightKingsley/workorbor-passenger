import {
  View,
  Pressable,
  ActivityIndicator,
  Image,
  ImageStyle,
} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {a} from '#/lib/style/atoms';
import useLocationService from '#/hooks/useLocationService';
import {useAppDispatch, useAppSelector} from '#/hooks/store';
import {colors} from '#/lib/theme/palette';
import {hexWithOpacity} from '#/lib/ui/helpers';
import {ScrollView} from 'react-native-gesture-handler';
import {useModalControls} from '../../global/modals/ModalState';
import {Button, Column, ListTile, Row, Separator} from '../../global';
import {Text} from '../../global/Themed';
import {Container} from '../../utils';
import Orders from '$/app/(app)/(tabs)/orders/(tabs)';
import SelectDestination from './SelectDestination';
import {Fragment, useCallback, useEffect, useState} from 'react';

import axios from 'axios';
import {GOOGLE_MAPS_API_KEY} from '$/src/lib/constants';
import {updateOrderRequest} from '$/src/store/slices/order/helpers';
import PingAnimation from '../../global/PingAnimation';

interface Geometry {
  location: {
    lat: number;
    lng: number;
  };
  viewport: {
    northeast: {
      lat: number;
      lng: number;
    };
    southwest: {
      lat: number;
      lng: number;
    };
  };
}

interface OpeningHours {
  open_now: boolean;
}

interface Photo {
  height: number;
  html_attributions: string[];
  width: number;
}

interface PlusCode {
  compound_code: string;
  global_code: string;
}

interface Place {
  business_status: string;
  geometry: Geometry;
  icon: string;
  icon_background_color: string;
  icon_mask_base_uri: string;
  name: string;
  place_id: string;
  rating: number;
  reference: string;
  scope: string;
  types: string[];
  user_ratings_total: number;
  vicinity: string;
  opening_hours?: OpeningHours;
  photos?: Photo[];
  price_level?: number;
  plus_code?: PlusCode;
}

interface DisplayName {
  text: string;
  languageCode: string;
}

interface Location {
  latitude: number;
  longitude: number;
}

interface LocationRestriction {
  center: Location;
  radius: number;
}

interface NearbySearchRequest {
  includedTypes: string[];
  maxResultCount: number;
  locationRestriction: {
    circle: LocationRestriction;
  };
}

const BASE_URL = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';

// Function to fetch nearby restaurants
async function fetchNearbyRestaurants({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) {
  // Define the request body
  const requestBody: NearbySearchRequest = {
    includedTypes: ['school', 'church', 'hospital'],
    maxResultCount: 10,
    locationRestriction: {
      circle: {
        center: {
          latitude,
          longitude,
        },
        radius: 500.0, // 500 meters
      },
    },
  };

  try {
    // Make the POST request
    // const response = await axios.post(BASE_URL, requestBody, {
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY,
    //     'X-Goog-FieldMask': 'places.displayName',
    //   },
    // });

    const response = await axios.get(
      `${BASE_URL}?key=${GOOGLE_MAPS_API_KEY}&location=${requestBody.locationRestriction.circle.center.latitude},${requestBody.locationRestriction.circle.center.longitude}&radius=${requestBody.locationRestriction.circle.radius}&type=restaurant&fields=formatted_address,name,types,website`,
    );

    const data = response.data;
    return data;
  } catch (error) {
    console.error('Error fetching nearby restaurants:', error);
  }
}

export const snapPoints = [`40%`];

export const enablePanDownToClose = false;
export const backdropComponent = null;

export default function WhereTo() {
  const [loading, setLoading] = useState(false);
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [nearbyPlaces, setNearbyPlaces] = useState<{
    list: Place[];
    loading: boolean;
  }>({list: [], loading: true});
  const {currentAddress, currentPosition} = useAppSelector(
    state => state.location,
  );
  const [originInput, setOriginInput] = useState('');
  const [destinationInput, setDestinationInput] = useState('');
  const {orderRequest} = useAppSelector(state => state.order);

  const {getCurrentAddress} = useLocationService();
  const dispatch = useAppDispatch();
  const {openModal, closeModal} = useModalControls();

  const handleWhereToPress = useCallback(async () => {
    // await new Promise(resolve => {
    //   resolve(closeModal());
    // });
    // setTimeout(() => {
    openModal('select-destination');
    // }, 500);
  }, [orderRequest]);

  useEffect(() => {
    (async () => {
      if (currentAddress) return;
      setLoading(true);
      const ADDRESS = await getCurrentAddress();
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!currentPosition) return;
      const data = await fetchNearbyRestaurants({
        latitude: currentPosition?.coords.latitude,
        longitude: currentPosition?.coords.longitude,
      });
      if (data) setNearbyPlaces({list: data.results, loading: false});
    })();
  }, [currentPosition]);

  return (
    <Container safeArea={false}>
      <View style={[a.w_full, a.h_full]}>
        <View style={[a.overflow_hidden, a.rounded_md]}>
          <Button
            style={[
              a.rounded_md,
              a.bg_(hexWithOpacity(colors.lightgrey, 0.5)),
              a.p_lg,
            ]}
            onPress={handleWhereToPress}>
            <Row style={[a.align_center]}>
              <View
                style={[
                  a.bg_(hexWithOpacity(colors.darkgray, 0.5)),
                  a.align_center,
                  a.justify_center,
                  a.w_(30),
                  a.h_(30),
                  a.rounded_full,
                ]}>
                <View
                  style={[a.rounded_full, a.w_50, a.h_50, a.bg_(colors.light)]}
                />
              </View>

              <Text family="Bold" style={[a.ml_2xl, a.text_(colors.darkgray)]}>
                Where To?
              </Text>
            </Row>
          </Button>
        </View>
        <ScrollView
          contentContainerStyle={[a.pb_2xl]}
          showsVerticalScrollIndicator={false}
          style={[a.mt_md]}>
          {nearbyPlaces.loading ? (
            <View>
              <ActivityIndicator color={colors.lightgrey} />
            </View>
          ) : (
            nearbyPlaces.list?.map((place, i) => (
              <Fragment key={i}>
                <ListTile
                  ripple={true}
                  rippleColor={hexWithOpacity(colors.lightgrey, 0.5)}
                  style={[a.py_xs, a.mb_xs, a.align_center]}
                  action={() => {
                    updateOrderRequest(dispatch, {
                      destination: {
                        address: place?.vicinity,
                        latitude: place?.geometry.location.lat,
                        longitude: place?.geometry.location.lng,
                      },
                    });
                    openModal('select-destination');
                  }}
                  leading={
                    <View
                      style={[
                        a.bg_(hexWithOpacity(colors.lightgrey, 0.3)),
                        a.rounded_sm,
                        a.w_(40),
                        a.h_(40),
                        a.align_center,
                        a.justify_center,
                      ]}>
                      {/* <Image
                        source={{uri: place.icon}}
                        style={[a.w_(20), a.h_(20)] as ImageStyle}
                      /> */}
                      <MaterialCommunityIcons
                        name="map-marker-outline"
                        size={20}
                        color={hexWithOpacity(colors.darkgray, 0.8)}
                      />
                    </View>
                  }
                  content={
                    <Column style={[a.ml_xl]}>
                      <Text style={[a.text_md]}>{place.name}</Text>
                      <Text
                        numberOfLines={1}
                        style={[a.text_sm, a.text_(colors.lightgrey), a.mt_xs]}>
                        {place.vicinity}
                      </Text>
                    </Column>
                  }
                />
              </Fragment>
            ))
          )}
        </ScrollView>
      </View>
    </Container>
  );
}

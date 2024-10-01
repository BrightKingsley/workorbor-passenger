import * as React from 'react';
import {
  View,
  Dimensions,
  StatusBar,
  TextInputProps,
  ActivityIndicator,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {a} from '#/lib/style/atoms';
import useLocationService from '#/hooks/useLocationService';
import {useAppDispatch, useAppSelector} from '#/hooks/store';
import {colors} from '#/lib/theme/palette';
import {BOTTOM_TAB_HEIGHT, GOOGLE_MAPS_API_KEY} from '#/lib/constants';
import {updateOrderRequest} from '#/store/slices/order/helpers';
import {hexWithOpacity} from '#/lib/ui/helpers';
import {useModalControls} from '../../global/modals/ModalState';
import {Button, Column, Row, Separator} from '../../global';
import {ButtonText} from '../../global/Button';
import ToggleButton from '../../global/ToggleButton';
import {Text} from '../../global/Themed';
import PlacesAutoComplete from './PlacesAutoComplete/PlacesAutoComplete';
import KeyboardAvoidingComponent from '../../global/KeyboardAvoidingComponent';
import ViewHeader from '../../global/ViewHeader';
import {Container} from '../../utils';
import {useAnimatedKeyboard} from 'react-native-reanimated';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';

const {height: HEIGHT} = Dimensions.get('window');
// NOTE: snapPoints holds the default height point for modal
const snapPointValue = ((HEIGHT - StatusBar.currentHeight!) / HEIGHT) * 100;
// export const snapPoints = [`${snapPointValue}%`];
export const snapPoints = ['95%'];
export const enablePanDownToClose = false;
// export const snapPoints = [`80%`];

let KEYBOARD_HEIGHT: number | undefined = undefined;
export default function SelectDestination() {
  const [loading, setLoading] = React.useState(false);
  const [useCurrentLocation, setUseCurrentLocation] = React.useState(false);
  const {currentAddress, currentPosition} = useAppSelector(
    state => state.location,
  );
  const [originInput, setOriginInput] = React.useState('');
  const [destinationInput, setDestinationInput] = React.useState('');
  const {orderRequest} = useAppSelector(state => state.order);

  const {getCurrentAddress} = useLocationService();
  const dispatch = useAppDispatch();
  const {closeModal, openModal} = useModalControls();

  const keyboard = useAnimatedKeyboard();

  if (!KEYBOARD_HEIGHT) {
    KEYBOARD_HEIGHT = keyboard.height.value;
  }

  const bottomTabBarHeight = useBottomTabBarHeight();

  const barHeight = React.useMemo(() => bottomTabBarHeight, []);

  const createOrder = React.useCallback(() => {
    if (orderRequest?.origin && orderRequest.destination) {
      openModal('order-details', {});
    }
  }, [orderRequest]);

  const handleGetOriginDetails = React.useCallback(
    (data: any, details: any | null) => {
      // (data: GooglePlaceData, details: GooglePlaceDetail | null) => {
      updateOrderRequest(dispatch, {
        origin: {
          address: details?.formatted_address,
          latitude: details?.geometry.location.lat,
          longitude: details?.geometry.location.lng,
        },
      });
      // createOrder();
    },

    [],
  );

  const handleGetDestinationDetails = React.useCallback(
    (data: any, details: any | null) => {
      // (data: GooglePlaceData, details: GooglePlaceDetail | null) => {
      if (useCurrentLocation) {
        updateOrderRequest(dispatch, {
          origin: {
            address: currentAddress?.formattedAddress!,
            latitude: currentPosition?.coords.latitude,
            longitude: currentPosition?.coords.longitude,
          },
        });
      }
      updateOrderRequest(dispatch, {
        destination: {
          address: details?.formatted_address,
          latitude: details?.geometry.location.lat,
          longitude: details?.geometry.location.lng,
        },
      });
      // createOrder();
    },

    [],
  );

  React.useEffect(() => {
    (async () => {
      if (currentAddress) return;
      setLoading(true);
      const ADDRESS = await getCurrentAddress();
      setLoading(false);
    })();
  }, []);

  // React.useEffect(() => {
  //   if (orderRequest?.origin && orderRequest.destination) {
  //     closeModal();
  //     setTimeout(() => {
  //       openModal({
  //         name: 'create-order',
  //       });
  //     }, 200);
  //   }
  // }, [orderRequest, openModal, closeModal]);

  const onCloseModal = React.useCallback(async () => {
    await new Promise(resolve => {
      resolve(closeModal());
    });

    // if (!(orderRequest?.origin && orderRequest.destination))
    setTimeout(() => {
      openModal('where-to', {
        children: <></>,
        onClose() {
          setTimeout(() => {
            console.log('RUNNING');
            openModal('where-to', {});
          }, 2000);
        },
      });
    }, 1000);
  }, [orderRequest]);

  return (
    <>
      <Container>
        <ViewHeader
          canGoBack={true}
          backPressHandler={closeModal}
          title="Select Destination"
        />
      </Container>
      <KeyboardAvoidingComponent style={[a.mt_xl]}>
        <>
          <Row
            style={[
              a.self_end,
              a.px_xl,
              a.w_full,
              a.justify_between,
              a.align_center,
            ]}>
            <Text style={[a.text_md]}>Use Current Location?</Text>
            <View style={[a.ml_(4)]}>
              <ToggleButton
                accessibilityLabel={'PinButton'}
                isActive={useCurrentLocation}
                switchActive={() => setUseCurrentLocation(prev => !prev)}
                style={[a.h_(32), a.w_(50), a.bg_(colors.darkgray)]}
                circleSize={30}
              />
            </View>
          </Row>
          <Column style={[a.my_2xl, a.rounded_md, a.flex_1]}>
            <Column style={[a.mt_(-10)]}>
              <View style={[a.px_md, a.z_30]}>
                {useCurrentLocation ? (
                  <Pressable onPress={() => setUseCurrentLocation(false)}>
                    <Row
                      style={[
                        a.align_center,
                        a.w_full,
                        a.rounded_sm,
                        a.px_lg,
                        a.h_(50),
                        a.border,
                        a.border_tint(colors.lightgrey),
                        a.bg_(colors.light),
                      ]}>
                      {loading ? (
                        <Row style={[a.align_center]}>
                          <ActivityIndicator color={colors.primarylighter} />
                          <Text style={[a.ml_sm]}>Getting location...</Text>
                        </Row>
                      ) : (
                        <>
                          <View
                            style={[
                              a.w_(25),
                              a.h_(25),
                              a.rounded_full,
                              a.align_center,
                              a.justify_center,
                              a.bg_(hexWithOpacity(colors.primarydarker, 0.3)),
                            ]}>
                            <View
                              style={[
                                a.w_60,
                                a.h_60,
                                a.rounded_full,
                                a.border_(2),
                                a.border_tint(colors.lightgrey),
                                a.bg_(colors.primarydarker),
                              ]}
                            />
                          </View>
                          <View style={[a.flex_1, a.ml_lg]}>
                            <Text style={[a.text_md]}>
                              {currentAddress?.formattedAddress}
                            </Text>
                          </View>
                        </>
                      )}
                    </Row>
                  </Pressable>
                ) : (
                  <PlacesAutoComplete
                    placeholder="Pick-up"
                    autoFocus={!useCurrentLocation}
                    listViewStyles={[a.top_(120)]}
                    getDetails={handleGetOriginDetails}
                    value={originInput}
                    onChangeText={text => setOriginInput(text)}
                  />
                )}
              </View>
              <Separator height={2} />
              <Row
                style={[
                  {
                    shadowColor: '#000000',
                    shadowOffset: {
                      width: 0,
                      height: 1,
                    },
                    shadowOpacity: 0.16,
                    shadowRadius: 1.51,
                    elevation: 2,
                  },
                  a.h_(70),
                  a.top_(-8),
                  a.align_center,
                  a.z_20,
                  // a.bg_(colors.lightgrey),
                ]}>
                <PlacesAutoComplete
                  inputContainerStyles={[a.mx_md]}
                  listViewStyles={[a.mt_(70), {zIndex: -1}]}
                  autoFocus={true}
                  placeholder="Destination"
                  getDetails={handleGetDestinationDetails}
                  value={destinationInput}
                  onChangeText={text => setDestinationInput(text)}
                />
              </Row>
              {orderRequest?.origin && orderRequest.destination && (
                <View style={[a.mx_md, a.mt_xl]}>
                  <Button
                    variant="solid"
                    color="primary"
                    shape="round"
                    onPress={createOrder}>
                    <ButtonText>Continue</ButtonText>
                  </Button>
                </View>
              )}
            </Column>
          </Column>
        </>
      </KeyboardAvoidingComponent>
    </>
  );
}

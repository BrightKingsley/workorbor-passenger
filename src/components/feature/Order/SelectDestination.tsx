import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  StatusBar,
  View,
} from 'react-native';
import {
  GooglePlaceData,
  GooglePlaceDetail,
} from 'react-native-google-places-autocomplete';
import {SafeAreaView} from 'react-native-safe-area-context';

import {useAppDispatch, useAppSelector} from '#/hooks/store';
import useLocationService from '#/hooks/useLocationService';
import {a} from '#/lib/style/atoms';
import {colors} from '#/lib/theme/palette';
import {hexWithOpacity} from '#/lib/ui/helpers';
import {updateOrderRequest} from '$/src/store/slices/order/helpers';
import {setOrderPhase} from '$/src/store/slices/order/slice';
import {OrderPhase} from '$/src/store/slices/order/types';

import {Button, Column, Row, Separator} from '../../global';
import {ButtonText} from '../../global/Button';
import {useModalControls} from '../../global/modals/ModalState';
import {Text} from '../../global/Themed';
import ToggleButton from '../../global/ToggleButton';
import ViewHeader from '../../global/ViewHeader';
import {Container} from '../../utils';
import PlacesAutoComplete from './PlacesAutoComplete/PlacesAutoComplete';

export const snapPoints = ['95%'];
export const enablePanDownToClose = false;

export default function SelectDestination() {
  const {currentAddress, currentPosition} = useAppSelector(
    state => state.location,
  );

  const {orderRequest} = useAppSelector(state => state.order);
  const {getCurrentAddress} = useLocationService();
  const {closeModal, openModal} = useModalControls();

  const [currentLocationUsed, setCurrentLocationUsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [originInput, setOriginInput] = useState('');
  const [destinationInput, setDestinationInput] = useState(
    orderRequest?.destination ? orderRequest.destination?.address : '',
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setOrderPhase(OrderPhase.creation));
    if (orderRequest) {
      setDestinationInput(orderRequest.destination?.address);
    }
  }, [orderRequest, dispatch]);

  const handleGetOriginDetails = useCallback(
    (data: GooglePlaceData, details: GooglePlaceDetail | null) => {
      if (details) {
        updateOrderRequest(dispatch, {
          origin: {
            address: details?.formatted_address,
            latitude: details?.geometry.location.lat,
            longitude: details?.geometry.location.lng,
          },
        });
      }
    },
    [dispatch],
  );

  const handleGetDestinationDetails = useCallback(
    (data: GooglePlaceData, details: GooglePlaceDetail | null) => {
      if (currentLocationUsed && currentAddress && currentPosition) {
        // COMEBACK: Check if this is actually needed
        updateOrderRequest(dispatch, {
          origin: {
            address: currentAddress
              ? currentAddress?.['formattedAddress'] ||
                `${currentAddress?.['name']}, ${currentAddress?.['locality']}, ${currentAddress?.subAdministrativeArea}`
              : '',
            latitude: currentPosition.coords.latitude,
            longitude: currentPosition.coords.longitude,
          },
        });
      }
      if (details) {
        updateOrderRequest(dispatch, {
          destination: {
            address: details?.formatted_address,
            latitude: details?.geometry.location.lat,
            longitude: details?.geometry.location.lng,
          },
        });
      }
    },
    [currentLocationUsed, currentAddress, currentPosition, dispatch],
  );

  const handleUseCurrentLocation = useCallback(async () => {
    setCurrentLocationUsed(prev => !prev);
    console.log(
      '✅✅✅',
      currentAddress,
      currentAddress
        ? currentAddress?.['formattedAddress'] || currentAddress?.['name']
        : '',
    );
    updateOrderRequest(dispatch, {
      origin: {
        address: currentAddress
          ? currentAddress?.['formattedAddress'] ||
            `${currentAddress?.['name']}, ${currentAddress?.['locality']}, ${currentAddress?.subAdministrativeArea}`
          : '',
        latitude: currentPosition?.coords.latitude,
        longitude: currentPosition?.coords.longitude,
      },
    });
    if (!currentAddress) {
      setLoading(true);
      await getCurrentAddress();
      setLoading(false);
    }
  }, [currentAddress, dispatch]);

  const createOrder = useCallback(() => {
    if (orderRequest?.origin && orderRequest?.destination) {
      openModal('order-details');
    }
  }, [orderRequest, openModal]);

  // useEffect(() => {
  //   return () => {
  //     openModal('where-to');
  //   };
  // }, []);

  const originComponent = useMemo(
    () =>
      currentLocationUsed ? (
        <Pressable onPress={() => setCurrentLocationUsed(false)}>
          <Row
            style={[
              a.align_center,
              a.w_full,
              a.rounded_sm,
              a.px_lg,
              a.h_(50),
              a.border,
              a.border_tint(colors.lightgrey),
              a.bg_(colors.lightgrey),
            ]}>
            {loading ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <>
                <View
                  style={[
                    a.w_(25),
                    a.h_(25),
                    a.rounded_full,
                    a.align_center,
                    a.justify_center,
                    a.bg_(hexWithOpacity(colors.darkgray, 0.3)),
                  ]}>
                  <View
                    style={[
                      a.w_60,
                      a.h_60,
                      a.rounded_full,
                      a.border_(2),
                      a.border_tint(colors.light),
                      a.bg_(colors.darkgray),
                    ]}
                  />
                </View>
                <View style={[a.flex_1, a.ml_lg]}>
                  <Text style={[a.text_md]}>
                    {currentAddress?.['formattedAddress'] ||
                      `${currentAddress?.['name']}, ${currentAddress?.['locality']}, ${currentAddress?.subAdministrativeArea}`}
                  </Text>
                </View>
              </>
            )}
          </Row>
        </Pressable>
      ) : (
        <PlacesAutoComplete
          placeholder="Pick-up"
          // autoFocus={!currentLocationUsed}
          listViewStyles={[a.top_(120)]}
          getDetails={handleGetOriginDetails}
          value={originInput}
          onChangeText={text => setOriginInput(text)}
        />
      ),
    [
      currentLocationUsed,
      loading,
      currentAddress,
      originInput,
      handleGetOriginDetails,
    ],
  );

  return (
    <View style={[a.w_full, a.h_full]}>
      <Container>
        <ViewHeader
          title="Select Destination"
          canGoBack
          backPressHandler={closeModal}
        />
      </Container>
      <Row
        style={[
          a.self_end,
          a.px_xl,
          a.w_full,
          a.justify_between,
          a.align_center,
        ]}>
        <Text style={[a.text_md]}>Use Current Location?</Text>
        <ToggleButton
          accessibilityLabel="PinButton"
          isActive={currentLocationUsed}
          switchActive={handleUseCurrentLocation}
          style={[a.h_(32), a.w_(50), a.bg_(colors.lightgrey)]}
          circleSize={30}
        />
      </Row>
      <Column style={[a.my_2xl, a.rounded_md, a.flex_1]}>
        <Column style={[a.mt_(-10)]}>
          <View style={[a.px_md, a.z_30, a.bg_(colors.light)]}>
            {originComponent}
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
              a.px_md,
              a.bg_(colors.light),
            ]}>
            <PlacesAutoComplete
              placeholder="Destination"
              listViewStyles={[a.mt_(70), {zIndex: -1}]}
              getDetails={handleGetDestinationDetails}
              value={destinationInput}
              onChangeText={text => text && setDestinationInput(text)}
              iconTransitionDirection="up"
            />
          </Row>
          {orderRequest?.origin && orderRequest?.destination && (
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
    </View>
  );
}

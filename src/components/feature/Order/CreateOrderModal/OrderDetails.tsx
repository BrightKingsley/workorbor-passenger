import {Ionicons} from '@expo/vector-icons';
import React, {Fragment, useCallback, useEffect, useState} from 'react';
import {Pressable} from 'react-native';

import {useAppDispatch, useAppSelector} from '#/hooks/store';
import {a} from '#/lib/style/atoms';
import {colors} from '#/lib/theme/palette';
import {clearOrderRequest} from '#/store/slices/order/slice';
import {VehicleType} from '#/store/slices/order/types';
import {Button, Column, Row, Separator} from '$/src/components/global';
import {ButtonText} from '$/src/components/global/Button';
import {useModalControls} from '$/src/components/global/modals/ModalState';
import {Text, View} from '$/src/components/global/Themed';
import {Container, FadeScreenWrapper} from '$/src/components/utils';
import ViewHeader from '$/src/components/global/ViewHeader';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {HITSLOP_20} from '$/src/lib/constants';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import ResponseTile, {
  ResponseTileLoader,
} from './AwaitingResponse/ResponseTile';
import {hexWithOpacity} from '$/src/lib/ui/helpers';
import useApi from '$/src/hooks/api/useApi';
import PingAnimation from '$/src/components/global/PingAnimation';

export const snapPoints = [250];

export const enablePanDownToClose = false;

export default function OrderDetails() {
  const dispatch = useAppDispatch();
  const {closeModal, openModal} = useModalControls();
  const {createOrder} = useApi().order;

  const {orderResponse, riderInfo} = useAppSelector(state => state.order);

  const [vehicleType, setVehicleType] = useState<VehicleType>(VehicleType.car);
  const [showInfo, setShowInfo] = useState(false);
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleSelectRide = useCallback(() => {
    openModal('confirm-order');
  }, []);

  const toggleShowInfo = useCallback(() => {
    setShowInfo(prev => !prev);
  }, []);

  useEffect(() => {
    if (orderResponse?.availableRiders.length) setLoading(false);
  }, [orderResponse?.availableRiders]);

  return (
    <>
      <Container>
        <ViewHeader
          canGoBack={true}
          backPressHandler={closeModal}
          rightComponent={
            <Button
              onPress={toggleShowInfo}
              variant="ghost"
              shape="round"
              hitSlop={HITSLOP_20}
              style={[a.py_0]}>
              <Ionicons name="information-circle-outline" size={30} />
            </Button>
          }
          title="Select Ride"
        />
      </Container>
      <BottomSheetScrollView
        showsVerticalScrollIndicator={false}
        style={[a.mt_xl]}>
        {showInfo ? (
          <RideInfo />
        ) : (
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            {/* <Container>
              {loading || !riderInfo ? (
                <Fragment>
                  <ResponseTileLoader />
                  <Separator height={10} />
                </Fragment>
              ) : (
                )}
                </Container> */}
            <Fragment>
              <ResponseTile />
              <Separator height={10} />
            </Fragment>
            <Separator
              height={1}
              backgroundColor={hexWithOpacity(colors.lightgrey, 0.3)}
              style={[a.mb_lg]}
            />
            <Container>
              <Row style={[a.align_center, a.mb_xs]}>
                <Ionicons name="cash" color={'green'} />
                <Text style={[a.ml_sm, a.text_md, a.font_bold]}>
                  Pay In Cash
                </Text>
              </Row>
              <Button
                label={'Clear Order Request'}
                variant="solid"
                shape="round"
                color="primary"
                style={[a.w_full]}
                onPress={handleSelectRide}>
                <ButtonText>Select ride</ButtonText>
              </Button>
            </Container>
          </Animated.View>
        )}
      </BottomSheetScrollView>
    </>
  );
}

function RideInfo() {
  const {orderRequest} = useAppSelector(state => state.order);

  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      style={[a.mt_2xl, a.top_0, a.pb_(20)]}>
      <View
        style={[
          a.absolute,
          a.h_65,
          a.left_(4),
          a.border_l,
          a.mt_2xl,
          a.border_l_tint(colors.primarylighter),
          {borderStyle: 'dashed'},
        ]}
      />
      <Row style={[]}>
        <View
          style={[
            a.relative,
            a.w_(10),
            a.h_(10),
            a.mt_2xl,
            a.rounded_full,
            a.align_center,
            a.justify_center,
            // a.bg_(colors.primarylighter),
            a.overflow_visible,
          ]}>
          <Ionicons
            name="location"
            color={colors.primarylighter}
            size={24}
            style={[
              // a.absolute,
              a.self_center,
              a.top_(-10),
              a.left_(-2),
              a.z_20,
              a.w_(20),
              a.h_(30),
            ]}
          />
        </View>
        <Text style={[a.ml_lg, a.text_sm]}>{orderRequest?.origin.address}</Text>
      </Row>
      <Row style={[a.mt_5xl]}>
        <View style={[a.mt_2xl]}>
          <PingAnimation pingSize={30} />
        </View>
        <Text style={[a.ml_lg, a.text_sm]}>
          {orderRequest?.destination.address}
        </Text>
      </Row>
    </Animated.View>
  );
}

import {Ionicons} from '@expo/vector-icons';
import React, {useCallback, useState} from 'react';
import {Pressable} from 'react-native';

import {useAppDispatch} from '#/hooks/store';
import {a} from '#/lib/style/atoms';
import {colors} from '#/lib/theme/palette';
import {clearOrderRequest} from '#/store/slices/order/slice';
import {VehicleType} from '#/store/slices/order/types';
import {Button, Column, Row, Separator} from '$/src/components/global';
import {ButtonText} from '$/src/components/global/Button';
import {useModalControls} from '$/src/components/global/modals/ModalState';
import {Text, View} from '$/src/components/global/Themed';
import {Container} from '$/src/components/utils';
import ViewHeader from '$/src/components/global/ViewHeader';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';

export const snapPoints = [`50%`];

export const enablePanDownToClose = false;

export default function OrderDetails() {
  const dispatch = useAppDispatch();
  const {closeModal, openModal} = useModalControls();

  const [vehicleType, setVehicleType] = useState<VehicleType>(VehicleType.car);

  const handleSelectRide = useCallback(() => {
    openModal('confirm-order', {});
  }, []);

  return (
    <>
      <Container>
        <ViewHeader
          canGoBack={true}
          backPressHandler={closeModal}
          title="Select Ride"
        />
      </Container>
      <BottomSheetScrollView style={[a.mt_xl]}>
        <Container>
          {/* <Row style={[a.self_center]}>
            {vehicleTypes.map((type, index) => {
              const selected = vehicleType === type;
              return (
                <React.Fragment key={index}>
                  <Pressable
                    onPress={() => {
                      setVehicleType(type);
                    }}
                    android_ripple={{
                      color: '#ffffff94',
                      foreground: true,
                    }}
                    style={[a.flex_1]}>
                    <Column
                      style={[
                        a.py_5xl,
                        a.align_center,
                        selected
                          ? [
                              a.bg_(colors.primary),
                              a.border_(2),
                              a.border_tint(colors.primarylighter),
                            ]
                          : [a.bg_(colors.lightgrey)],
                        a.rounded_md,
                      ]}>
                      <View
                        style={[
                          a.rounded_full,
                          a.align_center,
                          a.justify_center,
                          a.p_md,
                          a.w_(60),
                          a.h_(60),
                          selected
                            ? [a.border, a.border_tint(colors.primarylighter)]
                            : a.bg_(colors.lightgrey),
                        ]}>
                        {type === VehicleType.car ? (
                          selected ? (
                            <Ionicons name="car" />
                          ) : (
                            <Ionicons name="bicycle" />
                          )
                        ) : selected ? (
                          <Ionicons name="paper-plane" />
                        ) : (
                          <Ionicons name="car" />
                        )}
                      </View>
                      <Text
                        style={[
                          a.mt_xs,
                          selected
                            ? a.text_(colors.primarylighter)
                            : [a.text_('white')],
                          a.capitalize,
                        ]}>
                        {type}
                      </Text>
                    </Column>
                  </Pressable>
                  {index < vehicleTypes.length - 1 && <Separator width={5} />}
                </React.Fragment>
              );
            })}
          </Row> */}

          <Column style={[a.mt_2xl]}>
            <Row style={[a.justify_between, a.align_center]}>
              <Text style={[a.text_md, a.font_semi_bold]}>Journey Time</Text>
              <Text style={[a.text_xl]}>5min - 10min</Text>
            </Row>
            <Row style={[a.mt_md, a.justify_between, a.align_center]}>
              <Text style={[a.text_md, a.font_semi_bold]}>Capacity</Text>
              <Text style={[a.text_xl]}>1 - 4</Text>
            </Row>
          </Column>

          <Separator
            height={1}
            backgroundColor={colors.lightgrey}
            style={[a.my_xl]}
          />
          <Row style={[a.align_center]}>
            <Ionicons name="cash" color={'green'} />
            <Text style={[a.ml_sm, a.text_md, a.font_bold]}>Pay In Cash</Text>
          </Row>
          <Button
            label={'Clear Order Request'}
            variant="solid"
            shape="round"
            color="primary"
            style={[a.mt_2xl, a.w_full]}
            onPress={handleSelectRide}>
            <ButtonText>Select ride</ButtonText>
          </Button>
          <Button
            label={'Clear Order Request'}
            variant="outline"
            shape="round"
            color="error"
            style={[a.mt_2xl, a.w_full]}
            onPress={() => {
              dispatch(clearOrderRequest());
              closeModal();
            }}>
            <ButtonText>Cancel Order</ButtonText>
          </Button>
        </Container>
      </BottomSheetScrollView>
    </>
  );
}

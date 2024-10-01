import * as React from 'react';
import {View, Pressable} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import {a} from '#/lib/style/atoms';
import useLocationService from '#/hooks/useLocationService';
import {useAppDispatch, useAppSelector} from '#/hooks/store';
import {colors} from '#/lib/theme/palette';
import {hexWithOpacity} from '#/lib/ui/helpers';
import {ScrollView} from 'react-native-gesture-handler';
import {useModalControls} from '../../global/modals/ModalState';
import {Column, ListTile, Row, Separator} from '../../global';
import {Text} from '../../global/Themed';
import {Container} from '../../utils';
import Orders from '$/app/(app)/(tabs)/orders';
import SelectDestination from './SelectDestination';

export const snapPoints = [`40%`];

export const enablePanDownToClose = false;
export const backdropComponent = null;

export default function WhereTo() {
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
  const {openModal, closeModal} = useModalControls();

  const handleWhereToPress = React.useCallback(async () => {
    // await new Promise(resolve => {
    //   resolve(closeModal());
    // });
    // setTimeout(() => {
    openModal('select-destination', {});
    // }, 500);
  }, [orderRequest]);

  React.useEffect(() => {
    (async () => {
      if (currentAddress) return;
      setLoading(true);
      const ADDRESS = await getCurrentAddress();
      setLoading(false);
    })();
  }, []);

  return (
    <Container safeArea={false}>
      <View style={[a.w_full, a.h_full]}>
        <View style={[a.overflow_hidden, a.rounded_md]}>
          <Pressable
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

              <Text style={[a.ml_2xl, a.text_(colors.darkgray)]}>
                Where To?
              </Text>
            </Row>
          </Pressable>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} style={[a.mt_md]}>
          {Array.from({length: 4}, () => null).map((_, i) => (
            <React.Fragment key={i}>
              <ListTile
                ripple={true}
                rippleColor={hexWithOpacity(colors.lightgrey, 0.5)}
                style={[a.rounded_md, a.py_xs, a.px_2xl]}
                action={() => {}}
                leading={
                  <View
                    style={[
                      a.bg_(colors.lightgrey),
                      a.mt_md,
                      a.rounded_full,
                      a.w_(20),
                      a.h_(20),
                    ]}
                  />
                }
                content={
                  <Column style={[a.ml_5xl]}>
                    <Text style={[a.text_md]}>Shoprite Ikeja City Mall</Text>
                    <Text style={[a.text_sm, a.text_(colors.lightgrey)]}>
                      Lagos
                    </Text>
                  </Column>
                }
              />
              <Separator height={1} backgroundColor={colors.lightgrey} />
            </React.Fragment>
          ))}
        </ScrollView>
      </View>
    </Container>
  );
}

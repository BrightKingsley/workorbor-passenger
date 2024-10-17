import {useFocusEffect, useRouter} from 'expo-router';
import {useCallback, useEffect} from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';

import Map from '$/src/components/feature/Map';
import {Button} from '$/src/components/global';
import {ButtonText} from '$/src/components/global/Button';
import {
  useModalControls,
  useModals,
} from '$/src/components/global/modals/ModalState';
import {Text, View} from '$/src/components/global/Themed';
import useApi from '$/src/hooks/api/useApi';
import {a} from '$/src/lib/style/atoms';
import {Image, ImageStyle, Platform} from 'react-native';
import {useAppSelector} from '$/src/hooks/store';
import PingAnimation from '$/src/components/global/PingAnimation';
import {useUser} from '@clerk/clerk-expo';
import {colors} from '$/src/lib/theme/palette';
import {OrderPhase} from '$/src/store/slices/order/types';

export default function Home() {
  const {openModal} = useModalControls();
  const {activeModals} = useModals();

  const {createOrder} = useApi().order;

  const {riderInfo, orderPhase, orderRequest} = useAppSelector(
    state => state.order,
  );
  const {user} = useUser();

  const toggleModal = useCallback(() => {
    openModal(activeModals[activeModals.length - 1] || 'where-to');
  }, [activeModals]);

  useFocusEffect(
    useCallback(() => {
      // if (true) {
      if (!orderRequest) {
        toggleModal();
      }
    }, [orderRequest]),
  );

  useEffect(() => {
    if (riderInfo) {
      openModal('enroute');
    }
  }, [riderInfo]);

  return (
    <>
      <Map />
      {orderPhase === OrderPhase.awaitingRide && (
        <View
          style={[
            a.absolute,
            a.w_full,
            a.h_full,
            a.align_center,
            a.justify_center,
            a.z_50,
          ]}>
          <PingAnimation pingSize={200}>
            <Image
              source={{uri: user?.imageUrl}}
              style={
                [
                  a.w_(50),
                  a.h_(50),
                  a.rounded_full,
                  a.bg_(colors.primary),
                ] as ImageStyle
              }
            />
          </PingAnimation>
          <Text style={[a.mx_auto, a.mt_2xl]}>Finding Available Riders...</Text>
        </View>
      )}
    </>
  );
}

import {useFocusEffect, useRouter} from 'expo-router';
import {useCallback, useEffect} from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';

import Ionicons from '@expo/vector-icons/Ionicons';

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
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export default function Home() {
  const {openModal} = useModalControls();
  const {activeModals} = useModals();

  const {createOrder} = useApi().order;

  const {riderInfo, orderPhase, orderRequest} = useAppSelector(
    state => state.order,
  );

  const {user} = useUser();

  const router = useRouter();
  const safeInsets = useSafeAreaInsets();

  const toggleModal = useCallback(() => {
    openModal(activeModals[activeModals.length - 1] || 'where-to');
  }, [activeModals]);

  const handleWalletPress = useCallback(() => {
    Platform.OS === 'android'
      ? openModal('wallet')
      : router.push('/(app)/wallet');
  }, []);

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
      <View
        style={[
          a.absolute,
          a.z_50,
          a.top_(10),
          a.right_(20),
          a.mt_(safeInsets.top),
        ]}>
        <Button
          onPress={handleWalletPress}
          variant="ghost"
          shape="round"
          style={[
            a.bg_(colors.light),
            a.py_0,
            a.p_sm,
            a.w_(50),
            a.h_(50),
            a.align_center,
            a.justify_center,
            {
              shadowColor: colors.darkgray,
              shadowOpacity: 0.3,
              shadowOffset: {height: 2, width: 1},
              elevation: 3,
            },
          ]}>
          <Ionicons name="wallet-outline" size={30} color={colors.darkgray} />
        </Button>
      </View>
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

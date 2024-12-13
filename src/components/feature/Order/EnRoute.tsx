import {View, Image, Platform, Linking} from 'react-native';
// import {useModalControls} from '#/state/modals';
// import {NigeriaIcon, UnitedKingdomIcon} from '#/lib/icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import {a} from '#/lib/style/atoms';
import {colors} from '#/lib/theme/palette';
import {useAppSelector} from '#/hooks/store';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {useModalControls} from '../../global/modals/ModalState';
import useApi from '$/src/hooks/api/useApi';
import {CarAwaiting} from '$/src/assets/images';
import {Text} from '../../global/Themed';
import {Button, Column, IconButton, Row, Separator} from '../../global';
import {ButtonText} from '../../global/Button';
import ViewHeader from '../../global/ViewHeader';
import {useUser} from '@clerk/clerk-expo';
import {ComponentProps, useCallback, useState} from 'react';
import {useRouter} from 'expo-router';
import Animated, {
  FadeIn,
  FadeOut,
  ZoomIn,
  ZoomOut,
} from 'react-native-reanimated';
import {OrderPhase} from '$/src/store/slices/order/types';
import {Container} from '../../utils';

// NOTE: snapPoints holds the default height point for modal

const AnimatedIonIcon = Animated.createAnimatedComponent(Ionicons);

let SNAP_POINTS = '35%';

export const snapPoints = ['50%'];

export const enablePanDownToClose = false;

export default function EnRoute() {
  const {openModal, closeAllModals, closeModal} = useModalControls();
  const {riderInfo, orderPhase} = useAppSelector(state => state.order);

  const {cancelRide} = useApi().order;
  const router = useRouter();
  const {user} = useUser();
  const [loading, setLoading] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const handleCallPress = () => {
    const phoneNumber = `tel:${riderInfo?.phoneNumber}`;

    Linking.openURL(phoneNumber).catch(err =>
      console.error('An error occurred while opening the phone app:', err),
    );
  };

  const handleProfilePress = useCallback(() => {
    openModal('rider-details');
  }, []);

  const handleChatPress = useCallback(() => {
    Platform.OS === 'android'
      ? openModal('chat')
      : router.push('/(app)/chats/4');
  }, []);

  const handleCancelPress = useCallback(() => {
    cancelRide();
    closeModal();
  }, []);

  return (
    <View style={[a.px_md, a.h_(400)]}>
      <BottomSheetScrollView
        showsVerticalScrollIndicator={false}
        style={[]}
        contentContainerStyle={[a.flex_1]}>
        <Container>
          <ViewHeader canGoBack backPressHandler={closeAllModals} />
        </Container>
        <Button
          onPress={handleProfilePress}
          variant="ghost"
          style={[a.mt_sm, a.w_(130), a.mx_auto, a.px_2xl, a.relative]}>
          <View style={[a.relative]}>
            <Image
              style={
                [
                  a.w_(80),
                  a.h_(80),
                  a.mx_auto,
                  a.rounded_full,
                  a.bg_(colors.primary),
                ] as ComponentProps<typeof Image>['style']
              }
              source={{uri: riderInfo?.photo || user?.imageUrl}}
            />
            <View
              style={[
                a.absolute,
                a.bottom_0,
                a.right_0,
                a.bg_(colors.light),
                a.rounded_full,
              ]}>
              <AnimatedIonIcon name={'information-circle-outline'} size={30} />
            </View>
          </View>
          <Text style={[a.font_bold, a.text_md, a.text_center, a.mt_sm]}>
            {riderInfo?.firstName || 'John'}
            {'  '}
            {riderInfo?.lastName || 'Doe'}
          </Text>
        </Button>

        <Row style={[a.justify_around, a.mt_lg]}>
          {riderInfo?.phoneNumber && (
            <Column style={[a.align_center]}>
              <Button
                shape="round"
                variant="outline"
                onPress={handleCallPress}
                style={[
                  a.w_(50),
                  a.h_(50),
                  a.align_center,
                  a.justify_center,
                  a.py_0,
                  a.px_0,
                  a.border_tint(colors.darkgray),
                ]}>
                <AnimatedIonIcon
                  entering={ZoomIn}
                  color={colors.darkgray}
                  name="call-outline"
                  size={30}
                />
              </Button>
              <Text style={[a.text_xs, a.text_(colors.darkgray), a.mt_xs]}>
                Call Driver
              </Text>
            </Column>
          )}

          <Column style={[a.align_center]}>
            <Button
              shape="round"
              variant="outline"
              onPress={handleChatPress}
              style={[
                a.w_(50),
                a.h_(50),
                a.align_center,
                a.justify_center,
                a.py_0,
                a.px_0,
                a.border_tint(colors.darkgray),
              ]}>
              <AnimatedIonIcon
                entering={ZoomIn}
                color={colors.darkgray}
                name="chatbox-outline"
                size={30}
              />
            </Button>
            <Text style={[a.text_xs, a.text_(colors.darkgray), a.mt_xs]}>
              Chat
            </Text>
          </Column>

          <Column style={[a.align_center]}>
            <Button
              onPress={() => handleCancelPress()}
              shape="round"
              variant="outline"
              style={[
                a.w_(50),
                a.h_(50),
                a.align_center,
                a.justify_center,
                a.py_0,
                a.px_0,
                a.border_tint(colors.darkgray),
              ]}>
              <AnimatedIonIcon
                entering={ZoomIn}
                color={colors.darkgray}
                name="close-outline"
                size={30}
              />
            </Button>
            <Text style={[a.text_xs, a.text_(colors.darkgray), a.mt_xs]}>
              Cancel Ride
            </Text>
          </Column>
        </Row>
        <Container style={[a.mx_auto]}>
          <Row style={[a.mt_3xl]}>
            <Text style={[a.text_center]}>
              {orderPhase !== OrderPhase.enroute
                ? 'Waiting for Driver to start the trip...'
                : 'Trip started. Your driver will be at your location soon...'}
            </Text>
          </Row>
        </Container>
        {showProfile && (
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            <Column style={[{gap: 10}]}>
              <InfoRow label="Fare" value="$1300" />
              <InfoRow label="Wait Time" value="$10/Min" />
              <InfoRow label="Booking Fee" value="2%" />
              <InfoRow label="Discount" value="15%" />
              <InfoRow label="Seats" value="4" />
            </Column>
            <View style={[a.mt_2xl]}>
              <Text style={[a.text_(colors.primarylighter)]}>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vel,
                provident quo impedit possimus accusantium id. Sequi quisquam
                tempore atque tempora?
              </Text>
            </View>
          </Animated.View>
        )}
      </BottomSheetScrollView>
    </View>
  );
}

function InfoRow({
  label = 'Fare',
  value = '$1300',
}: {
  label: string;
  value: string;
}) {
  return (
    <Row>
      <Text style={[a.font_semi_bold, a.text_md]}>{label}</Text>
      <Separator
        style={[
          a.flex_1,
          a.mx_(5),
          a.border_b,
          a.border_b_tint(colors.lightgrey),
          a.h_85,
        ]}
      />
      <Text style={[a.font_semi_bold, a.text_md]}>{value}</Text>
    </Row>
  );
}

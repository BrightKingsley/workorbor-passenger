import {View, ScrollView, Image, Alert, Platform} from 'react-native';
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
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';

// NOTE: snapPoints holds the default height point for modal

let SNAP_POINTS = '50%';

export const snapPoints = [SNAP_POINTS];

export const enablePanDownToClose = false;

export default function EnRoute() {
  const {openModal} = useModalControls();
  const {riderInfo} = useAppSelector(state => state.order);
  const {createOrder} = useApi().order;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const handleProfilePress = useCallback(() => {
    SNAP_POINTS = '90%';
    setShowProfile(prev => !prev);
  }, []);

  const handlePressChat = useCallback(() => {
    Platform.OS === 'android'
      ? openModal('chat')
      : router.push('/(app)/chats/4');
  }, []);

  return (
    <View style={[a.px_md, a.flex_1]}>
      <BottomSheetScrollView showsVerticalScrollIndicator={false} style={[]}>
        <View style={[a.mt_5xl]}>
          <Image
            style={
              [
                a.w_(150),
                a.h_(150),
                a.mx_auto,
                a.rounded_full,
                a.bg_(colors.primary),
              ] as ComponentProps<typeof Image>['style']
            }
            source={{uri: riderInfo?.photo}}
          />
          <Text style={[a.font_bold, a.text_md, a.text_center, a.mt_2xl]}>
            {riderInfo?.firstName}
            {'  '}
            {riderInfo?.lastName}
          </Text>
        </View>

        <Row style={[a.justify_around, a.mt_2xl]}>
          <Button
            shape="round"
            variant="outline"
            onPress={handleProfilePress}
            style={[
              a.w_(50),
              a.h_(50),
              a.align_center,
              a.justify_center,
              a.py_0,
              a.px_0,
              a.border_tint(colors.primary),
            ]}>
            <Ionicons color={colors.primary} name="person-outline" size={30} />
          </Button>

          <Button
            shape="round"
            variant="outline"
            onPress={handlePressChat}
            style={[
              a.w_(50),
              a.h_(50),
              a.align_center,
              a.justify_center,
              a.py_0,
              a.px_0,
              a.border_tint(colors.primary),
            ]}>
            <Ionicons color={colors.primary} name="chatbox-outline" size={30} />
          </Button>

          <Button
            shape="round"
            variant="outline"
            style={[
              a.w_(50),
              a.h_(50),
              a.align_center,
              a.justify_center,
              a.py_0,
              a.px_0,
              a.border_tint(colors.primary),
            ]}>
            <Ionicons color={colors.primary} name="close-outline" size={30} />
          </Button>
        </Row>
        {showProfile && (
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            <Column style={[{gap: 10}]}>
              <InfoRow label="Fare" value="₦1300" />
              <InfoRow label="Wait Time" value="₦10/Min" />
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
  value = '₦1300',
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

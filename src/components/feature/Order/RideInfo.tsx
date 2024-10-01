import * as React from 'react';
import {View, ScrollView, Image, Alert} from 'react-native';
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
import {Button, Column, Row, Separator} from '../../global';
import {ButtonText} from '../../global/Button';
import ViewHeader from '../../global/ViewHeader';

// NOTE: snapPoints holds the default height point for modal
export const snapPoints = ['70%'];

export const enablePanDownToClose = true;

export default function RideInfo() {
  const {closeModal} = useModalControls();
  const {orderRequest} = useAppSelector(state => state.order);
  const {createOrder} = useApi().order;

  const [loading, setLoading] = React.useState(false);

  const handleSelectRide = React.useCallback(async () => {
    createOrder();
  }, []);

  return (
    <View style={[a.px_md]}>
      <ViewHeader canGoBack backPressHandler={closeModal} />
      <ScrollView showsVerticalScrollIndicator={false} style={[]}>
        <View style={[]}>
          <Image
            style={
              [a.w_(150), a.h_(80), a.mx_auto] as React.ComponentProps<
                typeof Image
              >['style']
            }
            source={CarAwaiting}
          />
          <Text style={[a.font_bold, a.text_md, a.text_center, a.mt_2xl]}>
            Workorbor
          </Text>
        </View>
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
        <Button
          loading={loading}
          onPress={handleSelectRide}
          variant="solid"
          shape="round"
          color="primary"
          style={[a.mt_3xl]}>
          <ButtonText>Select Ride</ButtonText>
        </Button>
      </ScrollView>
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

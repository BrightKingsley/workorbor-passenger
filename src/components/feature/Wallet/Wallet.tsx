import {useUser} from '@clerk/clerk-expo';
import Ionicons from '@expo/vector-icons/Ionicons';
import BottomSheet from '@gorhom/bottom-sheet';
import {useCallback, useState} from 'react';
import {Platform, StatusBar, useWindowDimensions, View} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';

import {useAppSelector} from '$/src/hooks/store';
import {a} from '$/src/lib/style/atoms';
import {colors} from '$/src/lib/theme/palette';

import {Button} from '../../global';
import {ButtonText} from '../../global/Button';
import {createCustomBackdrop} from '../../global/modals/ModalBackdrop';
import {useModalControls} from '../../global/modals/ModalState';
import {Text} from '../../global/Themed';
import ViewHeader from '../../global/ViewHeader';
import {Container} from '../../utils';
import TopUp from './TopUp';

export const snapPoints = ['95%'];
export const enablePanDownToClose = false;

export default function Wallet() {
  const {height: SCREEN_HEIGHT} = useWindowDimensions();
  const {openModal, closeModal} = useModalControls();
  const {balance} = useAppSelector(state => state.wallet);
  const {user} = useUser();

  const [showTopUp, setShowTopUp] = useState(false);

  const hideTopUp = useCallback(() => {
    setShowTopUp(false);
  }, []);

  return (
    <>
      <SafeAreaView
        style={
          {
            // paddingTop: StatusBar.currentHeight,
          }
        }>
        {Platform.OS !== 'ios' && (
          <Container style={[a.mb_xs]}>
            <ViewHeader
              titleComponent={
                <Text style={[a.ml_xl, {fontSize: 30}]}>
                  Hello, {user?.firstName}...
                </Text>
              }
              canGoBack
              backPressHandler={closeModal}
            />
          </Container>
        )}
        <ScrollView style={[a.self_center, a.w_95]}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            {Platform.OS === 'ios' && (
              <Text style={{fontSize: 30}}>Hello, {user?.firstName}...</Text>
            )}
          </View>
          <View
            style={{
              backgroundColor: colors.primary,
              width: '100%',
              borderRadius: 20,
              // height: SCREEN_HEIGHT * 0.3,
              paddingVertical: 15,
              marginTop: 20,
            }}>
            <View style={{width: '90%', alignSelf: 'center'}}>
              <View>
                <Text style={[a.text_xs, a.text_(colors.light)]}>balance:</Text>
                <Text
                  family="Bold"
                  style={[
                    {
                      fontSize: 24,
                      fontWeight: 'bold',
                    },
                    a.text_(colors.light),
                  ]}>
                  L${balance?.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>

          <View style={[a.mt_2xl]}>
            <Button
              variant="solid"
              shape="round"
              color="primary"
              style={[a.py_lg]}
              onPress={() => {
                // openModal('top-up');
                setShowTopUp(true);
              }}>
              <ButtonText style={[a.text_lg]}>Top up</ButtonText>
            </Button>
          </View>
        </ScrollView>
      </SafeAreaView>
      {showTopUp && (
        <BottomSheet
          ref={null}
          snapPoints={Platform.OS === 'ios' ? ['35%'] : ['50%', '80%']}
          handleHeight={24}
          enablePanDownToClose={true}
          android_keyboardInputMode="adjustResize"
          keyboardBlurBehavior="restore"
          backdropComponent={createCustomBackdrop(hideTopUp)}
          handleIndicatorStyle={[a.bg_(colors.darkgray)]}
          // onClose={onClose}
          handleStyle={[
            {
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            },
          ]}>
          <TopUp close={hideTopUp} />
        </BottomSheet>
      )}
    </>
  );
}

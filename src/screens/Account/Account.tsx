import {useAuth, useUser} from '@clerk/clerk-expo';
import {useHeaderHeight} from '@react-navigation/elements';
import {Stack, useLocalSearchParams, useRouter} from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import {Image, ImageStyle, View} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';

import {a} from '$/src/lib/style/atoms';
import {colors} from '$/src/lib/theme/palette';

import {Row} from '../../components/global';
import Button, {ButtonText} from '../../components/global/Button';
import {AnimatedText, Text} from '../../components/global/Themed';
import {Container} from '../../components/utils';
import {useCallback, useState} from 'react';
import Animated, {ZoomIn, ZoomOut} from 'react-native-reanimated';
import {createCustomBackdrop} from '$/src/components/global/modals/ModalBackdrop';
import {
  useModalControls,
  useModals,
} from '$/src/components/global/modals/ModalState';
import {socket} from '$/src/lib/utils/socket';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {clearTasks} from '$/src/lib/utils/tasks';
const AnimatedIcon = Animated.createAnimatedComponent(Ionicons);

// Run in Node.js environments at build time to generate a list of
// pages that should be statically generated.
export function generateStaticParams() {
  // return users.map(({user}) => ({account: user}));
  return [];
}

export default function Account() {
  const {account} = useLocalSearchParams<{account: string}>();
  return <AccountScreen account={account} />;
}

export function AccountScreen({account}: {account: string}) {
  const {user} = useUser();
  const {signOut} = useAuth();
  const {openModal, closeModalAnimated} = useModalControls();
  const {activeModals} = useModals();
  const safeInsets = useSafeAreaInsets();

  const isModalActive = activeModals.includes('edit');
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handleEditPress = useCallback(() => {
    isModalActive
      ? closeModalAnimated()
      : openModal('edit', {
          enablePanDownToClose: true,
          backdropComponent: createCustomBackdrop(closeModalAnimated),
        });
  }, [isModalActive]);

  const logOut = useCallback(async () => {
    try {
      setLoading(true);
      await signOut();
      router.replace('/sign-in');
    } catch (error) {
      console.error('LOGOUT', error);
    } finally {
      setLoading(false);
      clearTasks();
    }
  }, []);
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Account',
          headerShown: true,
          headerShadowVisible: false,
          headerTitleAlign: 'center',
          header: ({navigation, options, route, back}) => (
            <Container
              style={[
                a.h_(120),
                a.justify_end,
                a.bg_(colors.light),
                a.py_md,
                a.pt_(safeInsets.top),
              ]}>
              <Row style={[a.justify_between]}>
                <Text family="Bold" style={[a.text_4xl]}>
                  Account
                </Text>
                <TouchableOpacity
                  onPress={handleEditPress}
                  style={[
                    a.relative,
                    a.w_(30),
                    a.h_(30),
                    a.align_center,
                    a.justify_center,
                  ]}>
                  {isModalActive ? (
                    <AnimatedIcon
                      entering={ZoomIn}
                      exiting={ZoomOut}
                      name="close-outline"
                      size={34}
                      color={colors.primary}
                      style={[a.absolute]}
                    />
                  ) : (
                    <AnimatedText
                      entering={ZoomIn}
                      exiting={ZoomOut}
                      style={[a.text_(colors.primary), a.absolute]}>
                      Edit
                    </AnimatedText>
                  )}
                </TouchableOpacity>
              </Row>
            </Container>
          ),
        }}
      />
      <Container style={[a.flex_1, a.bg_(colors.light)]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="automatic">
          <Image
            source={{uri: user?.imageUrl}}
            alt="user"
            style={
              [
                a.w_(100),
                a.h_(100),
                a.rounded_full,
                // a.mx_auto,
                // a.ml_3xl,
                a.mt_4xl,
              ] as ImageStyle
            }
          />
          <View
            style={[
              a.pt_(20),
              a.pb_(20),
              a.pr_(10),
              a.pl_(10),
              a.mt_4xl,
              a.w_full,
              a.flex_col,
            ]}>
            <View
              style={[
                a.flex_row,
                a.mb_(40),
                a.align_center,
                a.justify_between,
                a.w_full,
              ]}>
              <Text>{'First name & Last name'}</Text>

              <Text>
                {user?.firstName} {user?.lastName}
              </Text>
            </View>
            <Row
              style={[a.mb_(40), a.align_center, a.justify_between, a.w_full]}>
              <Text>{'Email Address'}</Text>

              <Text>{user?.emailAddresses[0].emailAddress}</Text>
            </Row>

            {user?.phoneNumbers[0] && (
              <Row
                style={[
                  a.mb_(40),
                  a.align_center,
                  a.justify_between,
                  a.w_full,
                ]}>
                <Text>{'Phone No'}</Text>

                <Text>{user?.phoneNumbers[0]?.phoneNumber}</Text>
              </Row>
            )}

            {__DEV__ && (
              <>
                <Row
                  style={[
                    a.mb_(40),
                    a.align_center,
                    a.justify_between,
                    a.w_full,
                  ]}>
                  <Text>{'User ID'}</Text>

                  <Text>{user?.id}</Text>
                </Row>

                <Row
                  style={[
                    a.mb_(40),
                    a.align_center,
                    a.justify_between,
                    a.w_full,
                  ]}>
                  <Text>{'Socket ID'}</Text>

                  <Text>{socket?.id}</Text>
                </Row>
              </>
            )}
            <Button
              loading={loading}
              onPress={logOut}
              variant="ghost"
              shape="round"
              color="error">
              <ButtonText style={[a.text_center]}>Log Out</ButtonText>
            </Button>
          </View>
        </ScrollView>
      </Container>
    </>
  );
}

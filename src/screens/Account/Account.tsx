import {useAuth, useUser} from '@clerk/clerk-expo';
import {useHeaderHeight} from '@react-navigation/elements';
import {Link, Stack, router, useLocalSearchParams} from 'expo-router';
import Head from 'expo-router/head';
import {Image, ImageStyle, Platform, Pressable, View} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';

import {a} from '$/src/lib/style/atoms';
import {colors} from '$/src/lib/theme/palette';

import {Row} from '../../components/global';
import Button, {ButtonText} from '../../components/global/Button';
import {Text} from '../../components/global/Themed';
import ViewHeader from '../../components/global/ViewHeader';
// import {Feed} from '@/components/feed';
import {Container} from '../../components/utils';
import {useCallback} from 'react';
import {useModalControls} from '../../components/global/modals/ModalState';
import {ModalContainer} from '../../components/global/modals/Modal';
import Animated, {FadeIn} from 'react-native-reanimated';
import {createCustomBackdrop} from '$/src/components/global/modals/ModalBackdrop';

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
  const headerHeight = useHeaderHeight();
  const {signOut, isSignedIn} = useAuth();
  const {openModal, closeModal} = useModalControls();

  const handleEditPress = useCallback(() => {
    openModal('where-to', {
      enablePanDownToClose: true,
      backdropComponent: createCustomBackdrop(closeModal),
    });
  }, []);

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Account',
          headerStyle: {backgroundColor: colors.light},
          headerShown: true,
          headerShadowVisible: false,
          headerTitleAlign: 'center',
          headerRight: () => (
            <TouchableOpacity onPress={handleEditPress} style={[]}>
              <Text style={[a.text_(colors.primary)]}>Edit</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Container style={[a.flex_1, a.bg_(colors.light)]}>
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          <Image
            source={{uri: user?.imageUrl}}
            alt="user"
            style={
              [
                a.w_(80),
                a.h_(80),
                a.rounded_full,
                a.mx_auto,
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

            <Row
              style={[a.mb_(40), a.align_center, a.justify_between, a.w_full]}>
              <Text>{'User ID'}</Text>

              <Text>{user?.id}</Text>
            </Row>

            <Button
              onPress={signOut}
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

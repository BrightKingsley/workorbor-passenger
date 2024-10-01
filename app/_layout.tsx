import {ClerkProvider, useAuth} from '@clerk/clerk-expo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import {
  Slot,
  Stack,
  useRootNavigationState,
  useRouter,
  useSegments,
} from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import {StatusBar} from 'expo-status-bar';
import {reloadAsync} from 'expo-updates';
import React, {useEffect, useState} from 'react';
import {
  Button,
  I18nManager,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {RootSiblingParent} from 'react-native-root-siblings';
// @ts-expect-error
import {setRTLTextPlugin} from 'react-native-rtl-layout';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {Text} from '$/src/components/global/Themed';
import useLoadedFonts from '#/hooks/useLoadedFonts';
import {a} from '#/lib/style/atoms';
import {ReduxProviders} from '#/store/provider';

import i18n, {IS_RTL, setLanguage} from '../locales';
import {LocalizationProvider} from '../locales/localizationContext';
import t from '../locales/translate';
import {Row} from '../src/components/global';
import {colors} from '../src/lib/theme/palette';
import {hexWithOpacity} from '../src/lib/ui/helpers';
import {RouteTracker, SocketContainer} from '$/src/components/utils';
import {ModalProvider} from '$/src/components/global/modals/ModalState';
import useLocationService from '$/src/hooks/useLocationService';

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

console.log({CLERK_PUBLISHABLE_KEY});

const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

function RootLayoutInner() {
  useLoadedFonts();
  useLocationService();

  const [isReady, setIsReady] = React.useState(false);
  const {isLoaded, isSignedIn} = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsReady(true);
    }, 6000);

    return () => clearTimeout(timeout);
  });

  useEffect(() => {
    if (!isLoaded) return;

    const inTabsGroup = segments[0] === '(app)';

    console.info('SIGNED_IN: ', {
      isSignedIn,
      inTabsGroup,
      segs: segments[0],
      ok: '',
      segments,
    });

    console.log({isSignedIn, inTabsGroup, MENTS: segments});

    if (!isSignedIn) {
      router.replace('/(auth)/sign-in');
      return;
    }

    if (!inTabsGroup) router.replace('/(app)/(tabs)/');
  }, [isSignedIn]);

  return <Slot />;
}

export default function RootLayout() {
  // return (
  //   <SafeAreaProvider style={[a.flex_1, a.w_full]}>
  //     {/* <Splash isReady={isReady}> */}
  //     <RootSiblingParent>
  //       <React.Fragment>
  //         <GestureHandlerRootView style={a.h_full}>
  //           <Stack screenOptions={{headerShown: false}} />
  //         </GestureHandlerRootView>
  //       </React.Fragment>
  //     </RootSiblingParent>
  //     {/* </Splash> */}
  //   </SafeAreaProvider>
  // );

  return (
    <ReduxProviders>
      <ClerkProvider
        publishableKey={CLERK_PUBLISHABLE_KEY}
        tokenCache={tokenCache}>
        <LocalizationProvider>
          <SafeAreaProvider style={[a.flex_1, a.w_full]}>
            <StatusBar animated={true} translucent={true} />
            <GestureHandlerRootView style={a.h_full}>
              <RootLayoutInner />
              <RouteTracker />
              <SocketContainer />
            </GestureHandlerRootView>
          </SafeAreaProvider>
        </LocalizationProvider>
      </ClerkProvider>
    </ReduxProviders>
  );
}

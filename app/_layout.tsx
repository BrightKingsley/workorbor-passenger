<script src="http://192.168.0.197:8097"></script>;
import {LogBox} from 'react-native';
// LogBox.ignoreLogs(['Warning: ...', 'Error: ...']); // Ignore log notification by message
// LogBox.ignoreAllLogs();

import {ClerkProvider, useAuth, useUser} from '@clerk/clerk-expo';
import {Stack, useRouter, useSegments} from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import {StatusBar} from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import useLoadedFonts from '#/hooks/useLoadedFonts';
import {a} from '#/lib/style/atoms';
import {ReduxProviders} from '#/store/provider';

import {LocalizationProvider} from '../locales/localizationContext';
import {Splash} from '../src/components/global';
import {colors} from '../src/lib/theme/palette';
import {hexWithOpacity} from '../src/lib/ui/helpers';
import {
  LocationUpdater,
  RouteTracker,
  SocketContainer,
} from '$/src/components/utils';
import {getItemFromAsyncStore} from '$/src/lib/utils/helpers/async-store';
import useApi from '$/src/hooks/api';
import debounce from 'lodash.debounce';
import axios from 'axios';
import {handleError} from '$/src/lib/utils/errors';
import {useAppDispatch, useAppSelector} from '$/src/hooks/store';

const CLERK_PUBLISHABLE_KEY =
  'pk_test_cmVuZXdpbmctd2Vhc2VsLTQ1LmNsZXJrLmFjY291bnRzLmRldiQ';

// Debounced function for saving token
const saveTokenDebounced = debounce(async (key: string, value: string) => {
  try {
    await SecureStore.setItemAsync(key, value);
    console.log(`Token saved successfully: ${key}`);
  } catch (error) {
    console.error('Error saving token:', error);
  }
}, 1000); // 1000ms delay to debounce writes

const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      console.error('Error retrieving token:', err);
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    saveTokenDebounced(key, value);
  },
};

function RootLayoutInner() {
  useLoadedFonts();

  const [isReady, setIsReady] = useState(false);
  const [didRun, setDidRun] = useState(false);
  const {isLoaded, isSignedIn} = useAuth();
  const {user: reduxUser, isLoading} = useAppSelector(state => state.auth);
  const segments = useSegments();
  const {user} = useUser();
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log('REDUX_USER✡️✡️✡️: ', reduxUser);
  }, [reduxUser]);

  useEffect(() => {
    if (!isLoaded) return;

    const inTabsGroup = segments[0] === '(app)';

    if (!didRun) {
      setDidRun(true);

      // if (!isSignedIn || !user) {
      //   router.replace('/(auth)/sign-in');
      // } else if (inTabsGroup) {
      //   router.replace('/(app)/(tabs)/');
      // }

      if (!isSignedIn || !user) {
        router.replace('/(auth)/sign-in');
        return;
      }
      if (!inTabsGroup) router.replace('/(app)/(tabs)/');
    }
  }, [isSignedIn, user]);

  return (
    <>
      {isLoading && (
        <Splash
          backgroundColor={hexWithOpacity(colors.primarylighter, 0.5)}
          spinnerColor={colors.primary}
          isReady={isLoaded}
        />
      )}
      <LocationUpdater />
      <Stack screenOptions={{headerShown: false}} />
    </>
  );
}

export default function RootLayout() {
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

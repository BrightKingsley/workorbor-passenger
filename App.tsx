import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
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

import {Text} from '#/components/Themed';
import useLoadedFonts from '#/hooks/useLoadedFonts';
import {a} from '#/lib/style/atoms';
import RouteContainer, {Navigator} from '#/navigation/Navigation';
import {ReduxProviders} from '#/store/provider';
import {Splash} from '$/src/components/Splash';

import i18n, {IS_RTL, setLanguage} from './locales';
import {LocalizationProvider} from './locales/localizationContext';
import t from './locales/translate';
import {Row} from './src/components';
import {colors} from './src/lib/theme/palette';
import {hexWithOpacity} from './src/lib/ui/helpers';

function Root() {
  const [isReady, setIsReady] = React.useState(false);
  useLoadedFonts();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsReady(true);
    }, 3000);

    return () => clearTimeout(timeout);
  });

  return (
    <SafeAreaProvider style={[a.flex_1, a.w_full]}>
      <Splash isReady={isReady}>
        <RootSiblingParent>
          <React.Fragment>
            <GestureHandlerRootView style={a.h_full}>
              <Navigator />
            </GestureHandlerRootView>
          </React.Fragment>
        </RootSiblingParent>
      </Splash>
    </SafeAreaProvider>
  );
}

export default function App() {
  const switchLanguage = async (lang: string) => {
    await setLanguage(lang);
    reloadAsync();
  };

  return (
    <ReduxProviders>
      <LocalizationProvider>
        <View style={[styles.container]}>
          <StatusBar animated={true} translucent={true} />
          <RouteContainer>
            <Root />
          </RouteContainer>
        </View>
        {/* <View
          style={[
            a.absolute,
            a.rounded_md,
            a.overflow_hidden,
            a.bottom_(4),
            a.left_(6),
          ]}>
          <TouchableOpacity
            style={[a.p_md, a.rounded_md]}
            onPress={() => {
              console.log();est
              switchLanguage(i18n.locale === 'he' ? 'en' : 'he');
            }}>
            <Text>Change to {i18n.locale === 'he' ? 'en' : 'he'}</Text>
          </TouchableOpacity>
        </View> */}
      </LocalizationProvider>
    </ReduxProviders>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

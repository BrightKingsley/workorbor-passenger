import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import {StatusBar} from 'expo-status-bar';
import {reloadAsync} from 'expo-updates';
import React, {useEffect, useState} from 'react';
import {Button, I18nManager, Pressable, StyleSheet, View} from 'react-native';
import {} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {RootSiblingParent} from 'react-native-root-siblings';
// @ts-expect-error
import {setRTLTextPlugin} from 'react-native-rtl-layout';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {Text} from '#/components/Themed';
import useLoadedFonts from '#/hooks/useLoadedFonts';
import {a} from '#/lib/style/atoms';
import {Splash} from '#/lib/utils/Splash';
import RouteContainer, {Navigator} from '#/navigation/Navigation';
import {ReduxProviders} from '#/store/provider';

import i18n, {getStoredLanguage, setLanguage} from './locales';
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
  useEffect(() => {
    console.log('LOCALE: ', i18n.locale);
    // const [{textDirection, languageTag}] = Localization.getLocales();
    // console.log({textDirection, languageTag});
    // const isRTL = textDirection === 'rtl';
    // I18nManager.forceRTL(isRTL);
    // (async () => {
    //   await setLanguage(languageTag);
    // })();
    getStoredLanguage();
  }, []);

  const switchLanguage = async (lang: string) => {
    i18n.locale = lang;
    const isRTL = lang === 'he';
    I18nManager.allowRTL(isRTL);
    I18nManager.forceRTL(isRTL);
    await setLanguage(lang);
    await AsyncStorage.setItem('appLanguage', lang);
    reloadAsync(); // Reload the app to apply changes
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
        <View
          style={[
            a.absolute,
            a.rounded_md,
            a.overflow_hidden,
            a.bottom_(4),
            a.left_(6),
          ]}>
          <Pressable
            android_ripple={{
              color: hexWithOpacity(colors.darkgray, 0.4),
            }}
            style={[a.p_md, a.rounded_md]}
            onPress={() => {
              console.log();
              switchLanguage(i18n.locale == 'he' ? 'en-US' : 'he');
            }}>
            <Text>Change to {i18n.locale == 'he' ? 'en-US' : 'he'}</Text>
          </Pressable>
        </View>
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

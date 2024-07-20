import * as Localization from 'expo-localization';
import {StatusBar} from 'expo-status-bar';
import i18n from 'i18n-js';
import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {I18nManager} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {RootSiblingParent} from 'react-native-root-siblings';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {useAppSelector} from '#/hooks/store';
import useLoadedFonts from '#/hooks/useLoadedFonts';
import {a} from '#/lib/style/atoms';
import {Splash} from '#/lib/utils/Splash';
import RouteContainer, {Navigator} from '#/navigation/Navigation';
import {ReduxProviders} from '#/store/provider';

// const [{languageTag}] = Localization.getLocales();

// // Set the locale
// if (i18n) i18n.locale = languageTag;

// console.log({languageTag});

// // Enable RTL if the language is Hebrew
// if (languageTag === 'he') {
//   I18nManager.forceRTL(true);
// } else {
//   I18nManager.forceRTL(false);
// }

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
  return (
    <ReduxProviders>
      <View style={[styles.container]}>
        <StatusBar animated={true} translucent={true} />
        <RouteContainer>
          <Root />
        </RouteContainer>
      </View>
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

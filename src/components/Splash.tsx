import * as SplashScreen from 'expo-splash-screen';
import React, {useEffect} from 'react';
import {Animated, useAnimatedValue, View} from 'react-native';
import {
  Easing,
  runOnJS,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import {a} from '../lib/style/atoms';
import {colors} from '../lib/theme/palette';
type Props = {
  isReady: boolean;
};
export function Splash(props: React.PropsWithChildren<Props>) {
  const interp = useAnimatedValue(1);
  const scale = useAnimatedValue(0);
  const intro = useSharedValue(0);
  const outroLogo = useSharedValue(0);
  const outroApp = useSharedValue(0);
  const outroAppOpacity = useSharedValue(0);
  const [isAnimationComplete, setIsAnimationComplete] = React.useState(false);
  const [isLayoutReady, setIsLayoutReady] = React.useState(false);
  useEffect(() => {
    Animated.timing(interp, {
      toValue: 1,
      delay: 500,
      duration: 1000,
      useNativeDriver: true,
      isInteraction: false,
    }).start();
  }, [interp]);

  useEffect(() => {
    Animated.timing(scale, {
      toValue: 1,
      delay: 1000,
      duration: 500,
      useNativeDriver: true,
      isInteraction: false,
    }).start();
  }, [scale]);
  const isReady = props.isReady && isLayoutReady;
  const onFinish = React.useCallback(() => setIsAnimationComplete(true), []);
  const onLayout = React.useCallback(() => setIsLayoutReady(true), []);
  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync()
        .then(() => {
          intro.value = withTiming(
            1,
            {
              duration: 400,
              easing: Easing.out(Easing.cubic),
            },
            async () => {
              outroLogo.value = withTiming(
                1,
                {duration: 1200, easing: Easing.in(Easing.cubic)},
                () => {
                  runOnJS(onFinish)();
                },
              );
              outroApp.value = withTiming(1, {
                duration: 1200,
                easing: Easing.in(Easing.cubic),
              });
              outroAppOpacity.value = withTiming(1, {
                duration: 1200,
                easing: Easing.in(Easing.cubic),
              });
            },
          );
        })
        .catch(() => {});
    }
  }, [intro, isReady, onFinish, outroApp, outroAppOpacity, outroLogo]);
  return (
    <View testID="onboardingView" style={[a.flex_1]} onLayout={onLayout}>
      {!isAnimationComplete && (
        <View
          style={[
            a.flex_1,
            a.flex,
            a.align_center,
            a.justify_center,
            a.bg_(colors.beige),
          ]}>
          <Animated.View
            style={{opacity: interp}}
            testID="splashZebraLogo"></Animated.View>
        </View>
      )}
      {isReady && (
        <>
          <Animated.View style={{opacity: interp}}>
            {props.children}
          </Animated.View>
        </>
      )}
    </View>
  );
}

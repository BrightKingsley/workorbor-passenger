import React from 'react';
import {StyleSheet} from 'react-native';
import Animated from 'react-native-reanimated';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {ViewProps} from 'react-native-svg/lib/typescript/fabric/utils';

interface ContainerProps extends ViewProps {
  horizontalPadding?: boolean;
  safeArea?: boolean;
}

const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeAreaView);

export default function Container({
  children,
  horizontalPadding = true,
  safeArea = false,
  ...props
}: ContainerProps) {
  const safeAreaInsets = useSafeAreaInsets();
  const {style: styleProp, ...otherProps} = props;

  const style = StyleSheet.create({
    layout: {
      paddingHorizontal: horizontalPadding ? (safeAreaInsets.left, 16) : 0,
      // paddingBottom: BOTTOM_TAB_HEIGHT + 10,
    },
  });
  return safeArea ? (
    <AnimatedSafeAreaView style={[style.layout, styleProp]} {...otherProps}>
      {children}
    </AnimatedSafeAreaView>
  ) : (
    <Animated.View style={[style.layout, styleProp]} {...otherProps}>
      {children}
    </Animated.View>
  );
}

export function useContainerPadding() {}

import * as React from 'react';
import {
  DimensionValue,
  Insets,
  Pressable,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {useAnimatedStyle, withSpring} from 'react-native-reanimated';

import {a} from '#/lib/style/atoms';
import {colors} from '#/lib/theme/palette';

type ToggleButtonProp = {
  accessibilityLabel: string;
  isActive: boolean;
  hitslop?: Insets | number | null;
  switchActive: () => void;
  style?: StyleProp<ViewStyle>;
  circleSize?: DimensionValue | number;
};
export default function ToggleButton({
  accessibilityLabel,
  isActive,
  switchActive,
  style,
  circleSize,
  hitslop,
}: ToggleButtonProp) {
  return (
    <View>
      <Pressable hitSlop={hitslop}>
        <AnimatedCircle
          isActive={isActive}
          switchActive={switchActive}
          accessibilityLabel={accessibilityLabel}
          style={style}
          circleSize={circleSize}
        />
      </Pressable>
    </View>
  );
}

function AnimatedCircle({
  accessibilityLabel,
  isActive,
  switchActive,
  circleSize,
  style,
  hitslop,
}: {
  accessibilityLabel: string;
  isActive: boolean;
  switchActive: () => void;
  hitslop?: Insets | number | null;
  circleSize?: DimensionValue | number;
  style?: StyleProp<ViewStyle>;
}) {
  // Translate switch to X depending on switchValue state
  const switchStyle = useAnimatedStyle(() => {
    const translateX = isActive
      ? withSpring((circleSize as number) * 0.6 || 20)
      : withSpring(0);

    return {
      transform: [{translateX}],
    };
  });

  return (
    <TouchableOpacity
      testID="toggleBtn"
      accessibilityHint="Tap to toggle active state"
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      onPress={switchActive}
      hitSlop={hitslop}
      style={[
        styles.switchContainer,
        a.rounded_full,
        a.relative,
        a.justify_center,
        style,
        a.w_((circleSize as number) * 2),
        a.h_((circleSize as number) * 1.3),
        a.px_((circleSize as number) * 0.2),
      ]}>
      <Animated.View
        style={[
          styles.switchInner,
          a.rounded_full,
          // a.absolute,
          switchStyle,
          a.h_(circleSize as DimensionValue),
          a.w_(circleSize as DimensionValue),
        ]}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  switchContainer: {
    width: 50,
    height: 25,
  },
  switchInner: {
    width: 15,
    height: 15,
    backgroundColor: colors.beige,
    // left: 0,
  },
});

import React, {PropsWithChildren, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Svg, {
  Circle,
  Defs,
  Line,
  Path,
  RadialGradient,
  Stop,
} from 'react-native-svg';

import {a} from '$/src/lib/style/atoms';
import {colors} from '$/src/lib/theme/palette';
import {hexWithOpacity} from '$/src/lib/ui/helpers';

const AnimatedSvg = Animated.createAnimatedComponent(Svg);
const BalloonMarker = ({children}: PropsWithChildren) => {
  const translateY = useSharedValue(0);
  const translateCircle = useSharedValue(0);
  const shadowScale = useSharedValue(1);
  const shadowOpacity = useSharedValue(1);

  useEffect(() => {
    translateY.value = withRepeat(
      withSpring(-10, {
        duration: 1000,
      }),
      -1,
      true,
    );
    translateCircle.value = withRepeat(
      withSpring(-25, {
        duration: 1000,
      }),
      -1,
      true,
    );

    shadowScale.value = withRepeat(
      withSpring(2, {
        duration: 1000,
      }),
      -1,
      true,
    );
    shadowOpacity.value = withRepeat(
      withSpring(0.2, {
        duration: 1000,
      }),
      -1,
      true,
    );
  }, [translateY]);

  const animatedLineStyle = useAnimatedStyle(() => ({
    transform: [{translateY: translateY.value}],
  }));

  const animatedCircleStyle = useAnimatedStyle(() => ({
    transform: [{translateY: translateCircle.value}],
  }));

  const animatedShadowStyle = useAnimatedStyle(() => ({
    transform: [{scale: shadowScale.value}],
    opacity: shadowOpacity.value,
  }));

  return (
    <>
      <View
        style={[
          a.w_(5),
          a.bottom_(10),
          a.self_center,
          a.rounded_full,
          a.absolute,
        ]}>
        {/* The animated balloon and string */}
        <View
          style={[
            a.w_(5),
            a.h_(55),
            a.relative,
            a.rounded_full,
            a.overflow_hidden,
            a.self_center,
          ]}>
          <Animated.View
            style={[
              a.absolute,
              a.bottom_(0),
              a.top_(0),
              a.self_center,
              a.w_(5),
              a.rounded_full,
              a.bg_(colors.primary),
              a.overflow_visible,
              animatedLineStyle,
            ]}></Animated.View>
        </View>
        <Animated.View
          style={[
            a.absolute,
            a.bottom_(0),
            a.top_(0),
            a.self_center,
            a.w_(10),
            a.rounded_full,
            a.overflow_visible,
            animatedCircleStyle,
          ]}>
          <View
            style={[
              a.w_full,
              a.h_full,
              a.rounded_full,
              a.self_center,
              a.top_(-10),
              a.relative,
            ]}>
            <View
              style={[
                a.bg_(hexWithOpacity(colors.primarylighter, 1)),
                a.w_(50),
                a.h_(50),
                a.rounded_full,
                a.self_center,
                a.top_(-10),
                a.absolute,
                a.p_xl,
                a.align_center,
                a.justify_center,
              ]}>
              <View
                style={[
                  a.w_(40),
                  a.h_(40),
                  a.bg_(colors.primary),
                  a.rounded_full,
                  a.self_center,
                  a.overflow_hidden,
                ]}>
                {children}
              </View>
            </View>
          </View>
        </Animated.View>
      </View>

      <AnimatedSvg
        style={[
          a.h_(20),
          a.absolute,
          a.bottom_(-10),
          a.self_center,
          a.align_center,
          a.justify_center,
          animatedShadowStyle,
        ]}>
        {/* Adjusted the Path to maintain proportionality with a width of 15 */}
        <Path
          d="M 7.5 0 C 11.6421 0 15 2.23858 15 5 C 15 7.76142 11.6421 10 7.5 10 C 3.35786 10 0 7.76142 0 5 C 0 2.23858 3.35786 0 7.5 0 Z"
          fill="url(#grad)"
        />
        <Defs>
          <RadialGradient
            id="grad"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse">
            <Stop stopColor={hexWithOpacity(colors.light, 1)} offset={1} />
            <Stop
              stopColor={hexWithOpacity(colors.lightgrey, 0.2)}
              offset={1}
            />
            <Stop stopColor={hexWithOpacity(colors.darkgray, 0.3)} />
          </RadialGradient>
        </Defs>
      </AnimatedSvg>

      {/* <Animated.View
        style={[
          a.w_(15),
          a.h_(6),
          a.bg_(hexWithOpacity(colors.darkgray, 0.1)),
          a.absolute,
          a.bottom_(10),
          a.self_center,
          a.rounded_full,
          a.align_center,
          a.justify_center,
          animatedShadowStyle,
        ]}>
        <View style={[a.w_full, a.h_full, a.relative]}>
          <Animated.View
            style={[
              a.w_50,
              a.h_50,
              a.bg_(hexWithOpacity(colors.darkgray, 0.3)),
              a.absolute,
              a.self_center,
              a.rounded_full,
              animatedShadowStyle,
            ]}
          />
        </View>
      </Animated.View> */}
    </>
  );
};

export default BalloonMarker;

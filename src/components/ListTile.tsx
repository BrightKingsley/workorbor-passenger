import AntDesign from '@expo/vector-icons/AntDesign';
import React from 'react';
import {
  GestureResponderEvent,
  Pressable,
  StyleProp,
  View,
  ViewProps,
} from 'react-native';
import {ViewStyle} from 'react-native';

import {a} from '#/lib/style/atoms';
import {NavigationProps} from '#/navigation/types';

import Row from './Row';
import {Text} from './Themed';
import ToggleButton from './ToggleButton';

export type ListTileType = {
  leading?: React.ReactNode;
  content: string | React.ReactNode;
  trailing?: React.ReactNode;
  action?(payload?: NavigationProps | GestureResponderEvent): void;
  pointerEvents?: ViewProps['pointerEvents'];
};

export function AccordionRight() {
  return <AntDesign name="right" size={20} style={[a.text_('gray')]} />;
}

export default function ListTile({
  action,
  leading,
  content,
  trailing,
  style,
  ripple = false,
  rippleColor,
  pointerEvents,
}: ListTileType & {
  style?: StyleProp<ViewStyle>;
  ripple?: boolean;
  rippleColor?: string;
}) {
  return (
    <View pointerEvents={pointerEvents}>
      <Pressable
        style={[a.rounded_sm, a.overflow_hidden, style]}
        android_ripple={
          ripple
            ? {
                color: rippleColor || '#ffffff94',
                foreground: true,
              }
            : null
        }
        onPress={e => {
          console.log('THis PRESSED');
          action?.(e);
        }}>
        <Row style={[a.align_center]}>
          {leading}
          {typeof content === 'string' ? (
            <View style={[a.ml_xs]}>
              <Text>{content}</Text>
            </View>
          ) : (
            content
          )}
          <View style={[a.ml_auto]}>{trailing}</View>
        </Row>
      </Pressable>
    </View>
  );
}

export function ToggleBtn() {
  const [isActive, setIsActive] = React.useState(false);
  return (
    <ToggleButton
      accessibilityLabel={'PinButton'}
      isActive={isActive}
      switchActive={() => setIsActive(prev => !prev)}
      style={[a.h_(38), a.w_(70)]}
      circleSize={30}
    />
  );
}

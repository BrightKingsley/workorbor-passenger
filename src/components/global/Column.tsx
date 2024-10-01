import React, {PropsWithChildren} from 'react';
import {ViewProps} from 'react-native';

import {a} from '#/lib/style/atoms';

import {View} from './Themed';

interface ColumProps extends ViewProps {
  reverse?: boolean;
}

export default function Column({
  children,
  reverse = false,
  style,
  ...rest
}: PropsWithChildren<ColumProps>) {
  return (
    <View style={[a.flex_col, reverse && a.flex_row_reverse, style]} {...rest}>
      {children}
    </View>
  );
}

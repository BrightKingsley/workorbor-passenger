import React from 'react';
import {PropsWithChildren} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {isAndroid} from '#/platform';

import {BOTTOM_TAB_HEIGHT} from '../constants';
import {a} from '../style/atoms';
import {colors} from '../theme/palette';

export default function Layout({children}: PropsWithChildren) {
  const safeAreaInsets = useSafeAreaInsets();

  const style = StyleSheet.create({
    layout: {
      paddingHorizontal: (safeAreaInsets.left, 16),
      paddingTop: isAndroid
        ? StatusBar.currentHeight!
        : (safeAreaInsets.top, 10),
      paddingBottom: BOTTOM_TAB_HEIGHT + 10,
    },
  });
  return <View style={[style.layout, a.bg_(colors.light)]}>{children}</View>;
}

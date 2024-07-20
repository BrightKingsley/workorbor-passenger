import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StatusBar} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {IconButton, Row} from '#/components';
import {Text, View} from '#/components/Themed';
import {BOTTOM_TAB_HEIGHT} from '#/lib/constants';
import {a} from '#/lib/style/atoms';
import {colors} from '#/lib/theme/palette';
import {NavigationProps} from '#/navigation/types';
import {isAndroid} from '#/platform';

export default function Home() {
  const navigation = useNavigation<NavigationProps>();
  const safeAreaInsets = useSafeAreaInsets();
  const padSides = {
    paddingHorizontal: (safeAreaInsets.left, 16),
  };

  return (
    <View
      style={[
        a.bg_(colors.light),
        a.pb_(BOTTOM_TAB_HEIGHT + 10),
        a.pt_(isAndroid ? StatusBar.currentHeight! : (safeAreaInsets.top, 10)),
        a.flex_1,
      ]}>
      <Row
        style={[a.justify_between, a.w_full, a.self_center, a.mt_md, padSides]}>
        <View style={[a.align_center, a.justify_center]}>
          <Text>Home</Text>
        </View>
        <IconButton
          onPress={() => {
            navigation.navigate('Profile');
          }}
          title="profile"
          testID="UserProfile"></IconButton>
      </Row>
      <View style={[a.mt_3xl, padSides]}>
        <Text style={[a.text_xl]}>Hello, Jon Doe.</Text>
      </View>
    </View>
  );
}

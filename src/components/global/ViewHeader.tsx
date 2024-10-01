import FontAwesome from '@expo/vector-icons/FontAwesome';
import {useRouter} from 'expo-router';
import * as React from 'react';
import {TouchableOpacity, View} from 'react-native';

import {HITSLOP_30} from '#/lib/constants';
import {a} from '#/lib/style/atoms';

import Row from './Row';
import {Text} from './Themed';

export interface ViewHeaderProps {
  title?: string;
  description?: string;
  canGoBack?: boolean;
  rightComponent?: React.ReactNode;
  titleComponent?: React.ReactNode;
  backPressHandler?(): void;
}

export default function ViewHeader({
  title,
  canGoBack,
  rightComponent = null,
  titleComponent = null,
  description,
  backPressHandler,
}: ViewHeaderProps) {
  const router = useRouter();

  const onPressBack = React.useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.navigate('/(app)/(tabs)/');
    }
  }, [router]);

  return (
    <Row style={[a.align_center]}>
      {canGoBack ? (
        <TouchableOpacity
          testID="viewHeaderDrawerBtn"
          onPress={() => backPressHandler?.() || onPressBack()}
          hitSlop={HITSLOP_30}
          style={[a.align_center, a.justify_center, a.rounded_full]}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Back"
          accessibilityHint={'Access navigation links and settings'}>
          <FontAwesome name="angle-left" size={30} />
        </TouchableOpacity>
      ) : null}
      {titleComponent || (
          <View style={[a.mx_auto, a.w_80]}>
            <Text
              family="Bold"
              style={[a.text_center, a.font_bold, a.text_2xl]}>
              {title}
            </Text>
            {description && (
              <Text style={[a.text_center, a.mt_xs]}>{description}</Text>
            )}
          </View>
        ) ||
        null}
      {rightComponent}
    </Row>
  );
}

// function Container({
//   hideOnScroll,
//   children,
// }: {
//   hideOnScroll: boolean;
//   children: React.ReactNode;
// }) {
//   const pal = usePalette('default');
//   const interp = useSharedValue(0);

//   // useAnimatedStyle hook to handle animations
//   const animatedStyle = useAnimatedStyle(() => {
//     return {
//       transform: [{translateY: interp.value * -100}],
//     };
//   });

//   // React.useEffect(() => {
//   //   if (store.shell.minimalShellMode) {
//   //     interp.value = withTiming(1, { duration: 100 });
//   //   } else {
//   //     interp.value = withTiming(0, { duration: 100 });
//   //   }
//   // }, [interp, store.shell.minimalShellMode]);

//   if (!hideOnScroll) {
//     return (
//       <View style={[styles.header]} testID="viewHeader_no_scroll">
//         {children}
//       </View>
//     );
//   } else {
//     return (
//       <View
//         style={[pal.view, styles.header, styles.headerFloating, animatedStyle]}
//         testID="viewHeaderOnscroll">
//         {children}
//       </View>
//     );
//   }
// }

import FontAwesome from '@expo/vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import * as React from 'react';
import {
  Animated,
  StyleSheet,
  TouchableOpacity,
  useAnimatedValue,
  View,
} from 'react-native';

import {HITSLOP_30} from '#/lib/constants';
import {a} from '#/lib/style/atoms';
import {usePalette} from '#/lib/theme/usePalette';
import {NavigationProps} from '#/navigation/types';

import {Text} from './Themed';

export interface ViewHeaderProps {
  title?: string;
  description?: string;
  hasDescription?: boolean;
  canGoBack?: boolean;
  showBackButton?: boolean;
  hasRightComponent?: boolean;
  rightComponent?: React.ReactNode;
  isTitleComponent?: boolean;
  titleComponent?: React.ReactNode;
}

export default function ViewHeader({
  title,
  canGoBack,
  showBackButton = true,
  hasRightComponent,
  rightComponent,
  isTitleComponent = false,
  titleComponent,
  hasDescription = false,
  description,
}: ViewHeaderProps) {
  const navigation = useNavigation<NavigationProps>();

  const onPressBack = React.useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Home');
    }
  }, [navigation]);

  return (
    <Container hideOnScroll={false}>
      {showBackButton ? (
        <TouchableOpacity
          testID="viewHeaderDrawerBtn"
          onPress={onPressBack}
          hitSlop={HITSLOP_30}
          style={[a.absolute]}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Back"
          accessibilityHint={
            canGoBack ? '' : 'Access navigation links and settings'
          }>
          {canGoBack ? (
            <FontAwesome
              name="angle-left"
              size={30}
              style={[a.bg_('white'), a.ml_(10)]}
            />
          ) : null}
        </TouchableOpacity>
      ) : null}
      {!isTitleComponent ? (
        <View style={[a.mx_auto, a.w_80]}>
          <Text style={[a.text_center, a.mb_xs, a.font_bold, a.text_2xl]}>
            {title}
          </Text>
          {hasDescription && (
            <Text style={[a.text_center, a.mt_xs]}>{description}</Text>
          )}
        </View>
      ) : (
        titleComponent
      )}
      {hasRightComponent && (
        <View style={[a.absolute, a.right_0]}>{rightComponent}</View>
      )}
    </Container>
  );
}

function Container({
  hideOnScroll,
  children,
}: {
  hideOnScroll: boolean;
  children: React.ReactNode;
}) {
  const pal = usePalette('default');
  const interp = useAnimatedValue(0);

  // React.useEffect(() => {
  //   if (store.shell.minimalShellMode) {
  //     Animated.timing(interp, {
  //       toValue: 1,
  //       duration: 100,
  //       useNativeDriver: true,
  //       isInteraction: false,
  //     }).start();
  //   } else {
  //     Animated.timing(interp, {
  //       toValue: 0,
  //       duration: 100,
  //       useNativeDriver: true,
  //       isInteraction: false,
  //     }).start();
  //   }
  // }, [interp, store.shell.minimalShellMode]);

  const transform = {
    transform: [{translateY: Animated.multiply(interp, -100)}],
  };
  if (!hideOnScroll) {
    return (
      <Animated.View style={[styles.header]} testID="viewHeaderNoscroll">
        {children}
      </Animated.View>
    );
  } else {
    return (
      <Animated.View
        style={[pal.view, styles.header, styles.headerFloating, transform]}
        testID="viewHeaderOnscroll">
        {children}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    position: 'relative',
  },
  headerFloating: {
    position: 'absolute',
    top: 0,
    width: '100%',
  },
  headerFixed: {
    maxWidth: 600,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
});

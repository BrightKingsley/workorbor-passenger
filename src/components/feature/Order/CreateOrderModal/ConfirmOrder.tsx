import {a} from '#/lib/style/atoms';
import {colors} from '#/lib/theme/palette';
import {hexWithOpacity} from '#/lib/ui/helpers';
import React, {useCallback} from 'react';
import {StyleSheet} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import {FontAwesome, Ionicons} from '@expo/vector-icons';
import {Text, View} from '$/src/components/global/Themed';
import {Row} from '$/src/components/global';
import Button, {ButtonText} from '$/src/components/global/Button';
import {useModalControls} from '$/src/components/global/modals/ModalState';
import {Container} from '$/src/components/utils';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import ViewHeader from '$/src/components/global/ViewHeader';

export const snapPoints = [`40%`];

export const enablePanDownToClose = false;

export default function ConfirmOrder() {
  const {closeModal, openModal} = useModalControls();

  const handleConfirmOrder = useCallback(() => {
    openModal('awaiting-response', {});
  }, []);

  return (
    <>
      <Container>
        <ViewHeader
          canGoBack
          backPressHandler={closeModal}
          title="Confirm Order"
        />
      </Container>
      <BottomSheetScrollView style={[a.mt_xl]}>
        <Container>
          <View style={[a.mt_2xl]}>
            <View
              style={[
                a.absolute,
                a.h_65,
                a.left_(4),
                a.border_l,
                a.mt_2xl,
                a.border_l_tint(colors.primarylighter),
                {borderStyle: 'dashed'},
              ]}
            />
            <Row style={[]}>
              <View
                style={[
                  a.relative,
                  a.w_(10),
                  a.h_(10),
                  a.mt_2xl,
                  a.rounded_full,
                  a.align_center,
                  a.justify_center,
                  // a.bg_(colors.primarylighter),
                  a.overflow_visible,
                ]}>
                <Ionicons
                  name="location"
                  color={colors.primarylighter}
                  size={24}
                  style={[
                    // a.absolute,
                    a.self_center,
                    a.top_(-10),
                    a.left_(-2),
                    a.z_20,
                    a.w_(20),
                    a.h_(30),
                  ]}
                />
              </View>
              <Text style={[a.ml_lg, a.text_sm]}>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Reiciendis, repellat!
              </Text>
            </Row>
            <Row style={[a.mt_5xl]}>
              <View style={[a.mt_2xl]}>
                <PingAnimation pingSize={30} />
              </View>
              <Text style={[a.ml_lg, a.text_sm]}>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Reiciendis, repellat!
              </Text>
            </Row>
          </View>
          <View style={[a.mt_4xl]}>
            <Button
              onPress={handleConfirmOrder}
              label={'confirm'}
              color="primary"
              variant="solid"
              shape="round">
              <ButtonText>Confirm</ButtonText>
            </Button>
          </View>
        </Container>
      </BottomSheetScrollView>
    </>
  );
}

export const PingAnimation = ({
  coreSize = 10,
  pingSize = 20,
  color = colors.primarylighter,
}: {
  pingSize?: number;
  coreSize?: number;
  color?: string;
}) => {
  const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    ping: {
      width: pingSize,
      height: pingSize,
      borderRadius: pingSize / 2,
      backgroundColor: hexWithOpacity(color, 0.5),
      position: 'absolute',
    },
    core: {
      width: coreSize,
      height: coreSize,
      borderRadius: coreSize / 2,
      backgroundColor: color,
    },
  });

  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  React.useEffect(() => {
    scale.value = withRepeat(
      withTiming(2, {duration: 1000, easing: Easing.out(Easing.ease)}),
      -1,
      true,
    );

    opacity.value = withRepeat(
      withTiming(0, {duration: 1000, easing: Easing.out(Easing.ease)}),
      -1,
      true,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: scale.value}],
      opacity: opacity.value,
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.ping, animatedStyle]} />
      <View style={styles.core} />
    </View>
  );
};

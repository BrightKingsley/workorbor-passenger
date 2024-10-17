import {MotiView} from 'moti';
import React from 'react';
import {SectionList} from 'react-native';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';

import {
  Button,
  Column,
  ListTile,
  Row,
  Separator,
} from '$/src/components/global';
import Skeleton from '$/src/components/global/Skeleton';
import {View} from '$/src/components/global/Themed';
import {Container} from '$/src/components/utils';
import {a} from '$/src/lib/style/atoms';
import {colors} from '$/src/lib/theme/palette';
import {hexWithOpacity} from '$/src/lib/ui/helpers';
const AnimatedSectionList = Animated.createAnimatedComponent(SectionList);

export default function OrdersLoader() {
  const data = Array.from({length: 5}, (_, i) => ({
    title: i,
    data: Array.from({length: 5}, (_, i) => ({id: i})),
  })); // Create data array with 20 items

  const renderItem = () => {
    return (
      <Container>
        <OrderLoading />
      </Container>
    );
  };

  const renderSectionHeader = () => (
    <View
      style={[
        a.bg_(colors.light),
        {
          shadowColor: colors.darkgray,
          shadowOffset: {height: 10, width: 0},
          shadowRadius: 5,
          shadowOpacity: 0,
          // elevation: 10,
        },
        a.h_(25),
        a.w_(120),
        a.rounded_xl,
        a.px_sm,
        a.py_xs,
        a.justify_center,
        a.ml_(10),
        a.border,
        a.border_tint(hexWithOpacity(colors.lightgrey, 0.5)),
      ]}>
      <Skeleton width={40} height={10} radius={'round'} />
    </View>
  );

  return (
    <MotiView
      transition={{
        type: 'timing',
      }}
      animate={{backgroundColor: '#ffffff'}}
      style={[a.flex_1, a.justify_between, a.py_3xl, a.pt_(80)]}>
      <AnimatedSectionList
        entering={FadeIn}
        exiting={FadeOut}
        sections={data}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        stickySectionHeadersEnabled={true}
        ItemSeparatorComponent={() => (
          <Separator height={1} backgroundColor={colors.lightgrey} />
        )}
        SectionSeparatorComponent={() => <Separator height={15} />}
        renderSectionHeader={renderSectionHeader}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        style={[a.pt_xl]}
      />
    </MotiView>
  );
}

export function OrderLoading() {
  return (
    <ListTile
      action={() => null}
      ripple
      style={[a.py_md, a.h_(80)]}
      leading={
        <View style={[a.p_md]}>
          <Skeleton width={50} height={50} radius={'round'} />
        </View>
      }
      content={
        <Column style={[a.ml_xl]}>
          <Skeleton width={120} height={15} radius={'round'} />
          <Row style={[a.mt_sm, a.gap_sm]}>
            <Skeleton width={50} height={10} radius={'round'} />
            <Skeleton width={40} height={10} radius={'round'} />
          </Row>
        </Column>
      }
      trailing={
        <Button
          style={[
            a.bg_('transparent'),
            a.px_lg,
            a.py_md,
            a.border,
            a.border_tint(hexWithOpacity(colors.lightgrey, 0.4)),
          ]}
          variant="solid"
          shape="round">
          <Row style={[a.align_center]}>
            <Skeleton width={18} height={18} radius={'round'} />
            <View style={[a.ml_xs]}>
              <Skeleton width={40} height={10} radius={'round'} />
            </View>
          </Row>
        </Button>
      }
    />
  );
}

export function OrdersHeaderLoading() {
  return (
    <View
      style={[
        a.bg_(colors.light),
        {
          shadowColor: colors.darkgray,
          shadowOffset: {height: 10, width: 0},
          shadowRadius: 5,
          shadowOpacity: 0,
          // elevation: 10,
        },
        a.h_(25),
        a.w_(120),
        a.rounded_xl,
        a.px_sm,
        a.py_xs,
        a.justify_center,
        a.ml_(10),
        a.border,
        a.border_tint(hexWithOpacity(colors.lightgrey, 0.5)),
      ]}>
      <Skeleton width={40} height={10} radius={'round'} />
    </View>
  );
}

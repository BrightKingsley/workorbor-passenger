import {Ionicons} from '@expo/vector-icons';
import {Stack, useLocalSearchParams} from 'expo-router';
import React, {useCallback, useEffect, useState} from 'react';
import {RefreshControl, ScrollView} from 'react-native-gesture-handler';

import Map from '$/src/components/feature/Map';
import {Button, Column, Row, Separator} from '$/src/components/global';
import {ButtonText} from '$/src/components/global/Button';
import {Text, View} from '$/src/components/global/Themed';
import {Container} from '$/src/components/utils';
import {a} from '$/src/lib/style/atoms';
import {colors} from '$/src/lib/theme/palette';
import {hexWithOpacity} from '$/src/lib/ui/helpers';
import useApi from '$/src/hooks/api/useApi';
import {Order as OrderType, formatDate} from './Orders';
import {PingAnimation} from '$/src/components/feature/Order/CreateOrderModal/ConfirmOrder';

export default function Order() {
  const {order: orderId} = useLocalSearchParams();
  const {getOrder} = useApi().order;

  const [order, setOrder] = useState<OrderType>();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  useEffect(() => {
    (async () => {
      const responseData = await getOrder(orderId as string);
      console.log('ORDER: ', responseData);
      if (!responseData) return;
      setOrder(responseData.order);
    })();
  }, []);

  if (!order) return null;

  return (
    <>
      <Stack.Screen options={{title: '', headerShadowVisible: false}} />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        style={[a.bg_(colors.light)]}
        contentContainerStyle={[a.bg_(hexWithOpacity(colors.lightgrey, 0.3))]}>
        <View style={[a.bg_(colors.light), a.rounded_b_lg, a.py_2xl]}>
          <Container>
            <Column style={[a.bg_(colors.light)]}>
              <Column>
                <Text family="Bold" style={[a.text_2xl]}>
                  {'Trip with Kingsley'}
                </Text>
                <Text style={[a.text_sm, a.text_(colors.grayblue)]}>
                  {formatDate(order?.orderTime)}
                </Text>
              </Column>
              <View
                style={[a.h_(150), a.w_full, a.mt_xl, a.bg_(colors.lightgrey)]}>
                <Map />
              </View>
              <Column style={[a.my_5xl, a.mx_sm]}>
                <View
                  style={[
                    a.absolute,
                    a.h_40,
                    a.left_(4),
                    a.border_l,
                    a.mt_2xl,
                    a.border_l_tint(colors.primarylighter),
                    {borderStyle: 'dashed'},
                  ]}
                />
                <Row style={[a.align_start]}>
                  <View
                    style={[
                      a.relative,
                      a.w_(10),
                      a.h_(10),
                      a.mt_lg,
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
                  <Text style={[a.ml_3xl, a.text_sm]}>
                    {order.pickupLocation.address}
                  </Text>
                </Row>
                <Row style={[a.mt_sm]}>
                  <View style={[a.mt_sm]}>
                    <PingAnimation pingSize={30} color={colors.primary} />
                  </View>
                  <Text style={[a.ml_3xl, a.text_sm]}>
                    {order.dropOffLocation.address}
                  </Text>
                </Row>
              </Column>
              <Column>
                <Button
                  style={[a.bg_(colors.lightgrey)]}
                  shape="round"
                  variant="solid">
                  <ButtonText family="Bold" style={[a.text_(colors.darkgray)]}>
                    Get help with trip
                  </ButtonText>
                </Button>
                <Button
                  style={[a.bg_(colors.lightgrey), a.mt_xl]}
                  shape="round"
                  variant="solid">
                  <ButtonText family="Bold" style={[a.text_(colors.darkgray)]}>
                    Rebook
                  </ButtonText>
                </Button>
              </Column>
            </Column>
          </Container>
        </View>

        <View style={[a.bg_(colors.light), a.rounded_t_lg, a.mt_sm, a.py_2xl]}>
          <Container>
            <Column style={[a.bg_(colors.light)]}>
              <Text family="Bold" style={[a.text_2xl]}>
                Payment
              </Text>
              <Column>
                <Row style={[a.align_center, a.justify_between, a.mt_2xl]}>
                  <Text>From . Bolt</Text>
                  <Text>{order.fare || '₦2000'}</Text>
                </Row>
                <Row style={[a.mt_md, a.align_center, a.justify_between]}>
                  <Text>Booking fee</Text>
                  <Text>{'₦50'}</Text>
                </Row>
                <Row style={[a.mt_md, a.align_center, a.justify_between]}>
                  <Text style={[a.text_(colors.primary)]}>Discount</Text>
                  <Text style={[a.text_(colors.primary)]}>{'-₦300'}</Text>
                </Row>
              </Column>
              <Separator
                style={[a.my_xl]}
                height={1}
                backgroundColor={hexWithOpacity(colors.lightgrey, 0.4)}
              />
              <Column>
                <Row style={[a.align_center, a.justify_between]}>
                  <Text family="Bold" style={[a.text_2xl]}>
                    Total
                  </Text>
                  <Text family="Bold" style={[a.text_2xl]}>
                    {'₦2300'}
                  </Text>
                </Row>

                <Row style={[a.mt_md, a.align_center, a.justify_between]}>
                  <Row style={[a.align_center]}>
                    <Ionicons name="cash" color={'green'} />
                    <Text style={[a.text_(colors.darkgray), a.ml_xs]}>
                      Cash
                    </Text>
                  </Row>
                  <Text style={[a.text_(colors.darkgray)]}>{'-₦300'}</Text>
                </Row>
                <Button
                  style={[a.bg_(colors.lightgrey), a.mt_xl]}
                  shape="round"
                  variant="solid">
                  <ButtonText style={[a.text_(colors.darkgray)]}>
                    Get Receipt
                  </ButtonText>
                </Button>
              </Column>
            </Column>
          </Container>
        </View>
      </ScrollView>
    </>
  );
}

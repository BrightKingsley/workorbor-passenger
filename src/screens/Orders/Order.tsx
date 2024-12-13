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
import PingAnimation from '$/src/components/global/PingAnimation';
import {MotiView} from 'moti';
import Skeleton from '$/src/components/global/Skeleton';

import {getReceiptTemplate} from '$/src/templates/receipt';
import axios from 'axios';

const apiKey = 'ps_b4c49ba64a7fcc7da4638fae22e8b309';

async function generatePdf() {
  try {
    const response = await axios.post(
      'https://api.pdfstore.dev/generate',
      {
        projectId: '61',
        templateUrl: 'https://chwee.vercel.app',
      },
      {
        headers: {
          authorization: `Bearer ${apiKey}`,
        },
      },
    );
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}
export default function Order() {
  const {order: orderId} = useLocalSearchParams();
  const {getOrder} = useApi().order;

  const [order, setOrder] = useState<OrderType>();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const responseData = await getOrder(orderId as string);
      if (!responseData) return;
      setOrder(responseData.order);
    } catch (error) {
      console.error('GET_ORDERS: ', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchOrder();
  }, []);

  useEffect(() => {
    fetchOrder();
  }, []);

  useEffect(() => {
    console.log('ORDER: ', order);
  }, [order]);

  return (
    <View style={[a.flex_1]}>
      {loading ? (
        <OrderLoading refreshing={refreshing} />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={[a.bg_(colors.light), a.flex_1]}
          contentContainerStyle={[
            a.bg_(hexWithOpacity(colors.lightgrey, 0.3)),
          ]}>
          <View style={[a.bg_(colors.light), a.rounded_b_lg, a.py_2xl]}>
            <Container>
              <Column style={[a.bg_(colors.light)]}>
                <Column>
                  <Text family="Bold" style={[a.text_2xl]}>
                    {order?.status === 'pending'
                      ? 'Trip Pending'
                      : `Trip with ${order?.rider?.firstName}`}
                  </Text>
                  <Text style={[a.text_sm, a.text_(colors.grayblue)]}>
                    {formatDate(order?.orderTime)}
                  </Text>
                </Column>
                <View
                  style={[
                    a.h_(150),
                    a.w_full,
                    a.mt_xl,
                    a.bg_(colors.lightgrey),
                  ]}>
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
                      {order?.pickupLocation.address}
                    </Text>
                  </Row>
                  <Row style={[a.mt_sm]}>
                    <View style={[a.mt_sm]}>
                      <PingAnimation pingSize={30} color={colors.primary} />
                    </View>
                    <Text style={[a.ml_3xl, a.text_sm]}>
                      {order?.dropOffLocation.address}
                    </Text>
                  </Row>
                </Column>
                <Column>
                  <Button
                    style={[a.bg_(colors.lightgrey)]}
                    shape="round"
                    variant="solid">
                    <ButtonText
                      family="Bold"
                      style={[a.text_(colors.darkgray)]}>
                      Get help with trip
                    </ButtonText>
                  </Button>
                  <Button
                    style={[a.bg_(colors.lightgrey), a.mt_xl]}
                    shape="round"
                    variant="solid">
                    <ButtonText
                      family="Bold"
                      style={[a.text_(colors.darkgray)]}>
                      Rebook
                    </ButtonText>
                  </Button>
                </Column>
              </Column>
            </Container>
          </View>

          <View
            style={[a.bg_(colors.light), a.rounded_t_lg, a.mt_sm, a.py_2xl]}>
            <Container>
              <Column style={[a.bg_(colors.light)]}>
                <Text family="Bold" style={[a.text_2xl]}>
                  Payment
                </Text>
                <Column>
                  <Row style={[a.align_center, a.justify_between, a.mt_2xl]}>
                    <Text>From . Workorbor</Text>
                    <Text>
                      ${parseFloat(order?.fare?.toString()) || '$400'}
                    </Text>
                  </Row>
                  {/* <Row style={[a.mt_md, a.align_center, a.justify_between]}>
                    <Text>Booking fee</Text>
                    <Text>{'$50'}</Text>
                  </Row> */}
                  {/* <Row style={[a.mt_md, a.align_center, a.justify_between]}>
                    <Text style={[a.text_(colors.primary)]}>Discount</Text>
                    <Text style={[a.text_(colors.primary)]}>{'-$300'}</Text>
                  </Row> */}
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
                      {order?.fare || '$2300'}
                    </Text>
                  </Row>

                  <Row style={[a.mt_md, a.align_center, a.justify_between]}>
                    <Row style={[a.align_center]}>
                      <Ionicons name="cash" color={'green'} />
                      <Text style={[a.text_(colors.darkgray), a.ml_xs]}>
                        Cash
                      </Text>
                    </Row>
                    <Text style={[a.text_(colors.darkgray)]}>
                      ${order?.fare}
                    </Text>
                  </Row>
                  {/*{ order?.status ==="completed" && (
                    <Button
                      onPress={() => generatePdf()}
                      style={[a.bg_(colors.lightgrey), a.mt_xl]}
                      shape="round"
                      variant="solid">
                      <ButtonText style={[a.text_(colors.darkgray)]}>
                        {order?.status} Get Receipt
                      </ButtonText>
                    </Button>
                  )} */}
                </Column>
              </Column>
            </Container>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

function OrderLoading({refreshing}: {refreshing: boolean}) {
  return (
    <MotiView
      transition={{
        type: 'timing',
      }}
      animate={{backgroundColor: '#ffffff'}}
      style={[a.flex_1, a.justify_between]}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => {}} />
        }
        showsVerticalScrollIndicator={false}
        style={[a.bg_(colors.light)]}
        contentContainerStyle={[a.bg_(hexWithOpacity(colors.lightgrey, 0.3))]}>
        <View style={[a.bg_(colors.light), a.rounded_b_lg, a.py_2xl]}>
          <Container>
            <Column style={[a.bg_(colors.light)]}>
              <Column>
                <Skeleton width={200} height={40} />
                <View style={[a.mt_sm]}>
                  <Skeleton width={300} height={20} />
                </View>
              </Column>

              {/* <View
                style={[a.h_(150), a.w_full, a.mt_xl, a.bg_(colors.lightgrey)]}>
                <Map />
              </View> */}
              <View style={[a.mt_xl]}>
                <Skeleton width={'100%'} height={150} radius={'square'} />
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
                      a.overflow_visible,
                    ]}>
                    <Ionicons
                      name="location"
                      color={colors.lightgrey}
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

                  {/* <Text style={[a.ml_3xl, a.text_sm]}>
                    {order?.pickupLocation.address}
                  </Text> */}
                  <View style={[a.ml_lg]}>
                    <Skeleton width={200} height={15} />
                  </View>
                </Row>
                <Row style={[a.mt_sm, a.align_center]}>
                  <View style={[a.mt_sm]}>
                    <PingAnimation pingSize={30} color={colors.lightgrey} />
                  </View>

                  {/* <Text style={[a.ml_3xl, a.text_sm]}>
                    {order?.dropOffLocation.address}
                  </Text> */}
                  <View style={[a.ml_lg, a.mt_sm]}>
                    <Skeleton width={200} height={15} />
                  </View>
                </Row>
              </Column>
              <Column>
                <Button
                  style={[
                    a.bg_('transparent'),
                    a.px_lg,
                    a.border,
                    a.py_xl,
                    a.justify_center,
                    a.align_center,
                    a.border_tint(hexWithOpacity(colors.lightgrey, 0.4)),
                  ]}
                  shape="round"
                  variant="solid">
                  <ButtonText family="Bold" style={[a.text_(colors.darkgray)]}>
                    {/* <Skeleton width={100} height={20} /> */}
                  </ButtonText>
                </Button>
                <Button
                  style={[
                    a.bg_('transparent'),
                    a.px_lg,
                    a.py_xl,
                    a.border,
                    a.mt_xl,
                    a.justify_center,
                    a.align_center,
                    a.border_tint(hexWithOpacity(colors.lightgrey, 0.4)),
                  ]}
                  shape="round"
                  variant="solid">
                  <ButtonText family="Bold" style={[a.text_(colors.darkgray)]}>
                    {/* <Skeleton width={100} height={20} /> */}
                  </ButtonText>
                </Button>
              </Column>
            </Column>
          </Container>
        </View>

        <View style={[a.bg_(colors.light), a.rounded_t_lg, a.mt_sm, a.py_2xl]}>
          <Container>
            <Column style={[a.bg_(colors.light)]}>
              {/* <Text family="Bold" style={[a.text_2xl]}>
                Payment
              </Text> */}
              <Skeleton width={100} height={30} />
              <Column>
                <Row style={[a.align_center, a.justify_between, a.mt_2xl]}>
                  <Skeleton width={70} height={10} />
                  <Skeleton width={50} height={10} />
                </Row>
                <Row style={[a.mt_md, a.align_center, a.justify_between]}>
                  <Skeleton width={80} height={10} />
                  <Skeleton width={30} height={10} />
                </Row>
                <Row style={[a.mt_md, a.align_center, a.justify_between]}>
                  <Skeleton width={65} height={10} />
                  <Skeleton width={45} height={10} />
                </Row>
              </Column>
              <Separator
                style={[a.my_xl]}
                height={1}
                backgroundColor={hexWithOpacity(colors.lightgrey, 0.4)}
              />
              <Column>
                <Row style={[a.align_center, a.justify_between]}>
                  <Skeleton width={70} height={28} />
                  <Skeleton width={75} height={28} />
                </Row>

                <Row style={[a.mt_md, a.align_center, a.justify_between]}>
                  <Row style={[a.align_center]}>
                    {/* <Ionicons name="cash" color={'green'} /> */}
                    <Skeleton width={15} height={15} />
                    <View style={[a.ml_xs]}>
                      <Skeleton width={50} height={15} />
                    </View>
                  </Row>
                  <Skeleton width={45} height={15} />
                </Row>
                <Button
                  style={[
                    a.bg_('transparent'),
                    a.px_lg,
                    a.py_xl,
                    a.border,
                    a.mt_xl,
                    a.justify_center,
                    a.align_center,
                    a.border_tint(hexWithOpacity(colors.lightgrey, 0.4)),
                  ]}
                  shape="round"
                  variant="solid">
                  <ButtonText family="Bold" style={[a.text_(colors.darkgray)]}>
                    {/* <Skeleton width={100} height={20} /> */}
                  </ButtonText>
                </Button>
              </Column>
            </Column>
          </Container>
        </View>
      </ScrollView>
    </MotiView>
  );
}

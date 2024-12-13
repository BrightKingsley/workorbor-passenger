import {Feather, MaterialCommunityIcons} from '@expo/vector-icons';
import {useHeaderHeight} from '@react-navigation/elements';
import {useFocusEffect, useRouter} from 'expo-router';
import {useCallback, useEffect, useState} from 'react';
import {
  InteractionManager,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  SectionList,
} from 'react-native';

import {
  Button,
  Column,
  ListTile,
  Row,
  Separator,
} from '$/src/components/global';
import {ButtonText} from '$/src/components/global/Button';
import {Text, View} from '$/src/components/global/Themed';
import {Container, FadeScreenWrapper} from '$/src/components/utils';
import {a} from '$/src/lib/style/atoms';
import {colors} from '$/src/lib/theme/palette';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {RefreshControl} from 'react-native-gesture-handler';
import useApi from '$/src/hooks/api/useApi';
import OrdersLoader, {OrderLoading, OrdersHeaderLoading} from './OrdersLoader';
import {MotiView} from 'moti';
import {useScrollProps} from '@bacons/expo-router-top-tabs';

const AnimatedSectionList = Animated.createAnimatedComponent(SectionList);

const ORDER_DATA = [
  {
    title: 'Aug, 2024',
    data: [
      {
        id: Math.random(),
        destination: 'Saje Foods and Pastries',
        bookingTime: '20:22',
        arrivalTime: '21:22',
        origin: 'My House',
        date: '25th Aug, 2024',
        fee: 2000,
      },
      {
        id: Math.random(),
        destination: 'Saje Foods and Pastries',
        bookingTime: '20:22',
        arrivalTime: '21:22',
        origin: 'My House',
        date: '25th Aug, 2024',
        fee: 2000,
      },
      {
        id: Math.random(),
        destination: 'Saje Foods and Pastries',
        bookingTime: '20:22',
        arrivalTime: '21:22',
        origin: 'My House',
        date: '25th Aug, 2024',
        fee: 2000,
      },
      {
        id: Math.random(),
        destination: 'Saje Foods and Pastries',
        bookingTime: '20:22',
        arrivalTime: '21:22',
        origin: 'My House',
        date: '25th Aug, 2024',
        fee: 2000,
      },
      {
        id: Math.random(),
        destination: 'Saje Foods and Pastries',
        bookingTime: '20:22',
        arrivalTime: '21:22',
        origin: 'My House',
        date: '25th Aug, 2024',
        fee: 2000,
      },
      {
        id: Math.random(),
        destination: 'Saje Foods and Pastries',
        bookingTime: '20:22',
        arrivalTime: '21:22',
        origin: 'My House',
        date: '25th Aug, 2024',
        fee: 2000,
      },
      {
        id: Math.random(),
        destination: 'Saje Foods and Pastries',
        bookingTime: '20:22',
        arrivalTime: '21:22',
        origin: 'My House',
        date: '25th Aug, 2024',
        fee: 2000,
      },
      {
        id: Math.random(),
        destination: 'Saje Foods and Pastries',
        bookingTime: '20:22',
        arrivalTime: '21:22',
        origin: 'My House',
        date: '25th Aug, 2024',
        fee: 2000,
      },
      {
        id: Math.random(),
        destination: 'Saje Foods and Pastries',
        bookingTime: '20:22',
        arrivalTime: '21:22',
        origin: 'My House',
        date: '25th Aug, 2024',
        fee: 2000,
      },
      {
        id: Math.random(),
        destination: 'Saje Foods and Pastries',
        bookingTime: '20:22',
        arrivalTime: '21:22',
        origin: 'My House',
        date: '25th Aug, 2024',
        fee: 2000,
      },
      {
        id: Math.random(),
        destination: 'Saje Foods and Pastries',
        bookingTime: '20:22',
        arrivalTime: '21:22',
        origin: 'My House',
        date: '25th Aug, 2024',
        fee: 2000,
      },
      {
        id: Math.random(),
        destination: 'Saje Foods and Pastries',
        bookingTime: '20:22',
        arrivalTime: '21:22',
        origin: 'My House',
        date: '25th Aug, 2024',
        fee: 2000,
      },
    ],
  },
  {
    title: 'September, 2024',
    data: [
      {
        id: Math.random(),
        destination: 'Saje Foods and Pastries',
        bookingTime: '20:22',
        arrivalTime: '21:22',
        origin: 'My House',
        date: '25th Aug, 2024',
        fee: 2000,
      },
      {
        id: Math.random(),
        destination: 'Saje Foods and Pastries',
        bookingTime: '20:22',
        arrivalTime: '21:22',
        origin: 'My House',
        date: '25th Aug, 2024',
        fee: 2000,
      },
      {
        id: Math.random(),
        destination: 'Saje Foods and Pastries',
        bookingTime: '20:22',
        arrivalTime: '21:22',
        origin: 'My House',
        date: '25th Aug, 2024',
        fee: 2000,
      },
      {
        id: Math.random(),
        destination: 'Saje Foods and Pastries',
        bookingTime: '20:22',
        arrivalTime: '21:22',
        origin: 'My House',
        date: '25th Aug, 2024',
        fee: 2000,
      },
      {
        id: Math.random(),
        destination: 'Saje Foods and Pastries',
        bookingTime: '20:22',
        arrivalTime: '21:22',
        origin: 'My House',
        date: '25th Aug, 2024',
        fee: 2000,
      },
      {
        id: Math.random(),
        destination: 'Saje Foods and Pastries',
        bookingTime: '20:22',
        arrivalTime: '21:22',
        origin: 'My House',
        date: '25th Aug, 2024',
        fee: 2000,
      },
      {
        id: Math.random(),
        destination: 'Saje Foods and Pastries',
        bookingTime: '20:22',
        arrivalTime: '21:22',
        origin: 'My House',
        date: '25th Aug, 2024',
        fee: 2000,
      },
      {
        id: Math.random(),
        destination: 'Saje Foods and Pastries',
        bookingTime: '20:22',
        arrivalTime: '21:22',
        origin: 'My House',
        date: '25th Aug, 2024',
        fee: 2000,
      },
      {
        id: Math.random(),
        destination: 'Saje Foods and Pastries',
        bookingTime: '20:22',
        arrivalTime: '21:22',
        origin: 'My House',
        date: '25th Aug, 2024',
        fee: 2000,
      },
      {
        id: Math.random(),
        destination: 'Saje Foods and Pastries',
        bookingTime: '20:22',
        arrivalTime: '21:22',
        origin: 'My House',
        date: '25th Aug, 2024',
        fee: 2000,
      },
      {
        id: Math.random(),
        destination: 'Saje Foods and Pastries',
        bookingTime: '20:22',
        arrivalTime: '21:22',
        origin: 'My House',
        date: '25th Aug, 2024',
        fee: 2000,
      },
      {
        id: Math.random(),
        destination: 'Saje Foods and Pastries',
        bookingTime: '20:22',
        arrivalTime: '21:22',
        origin: 'My House',
        date: '25th Aug, 2024',
        fee: 2000,
      },
      {
        id: Math.random(),
        destination: 'Saje Foods and Pastries',
        bookingTime: '20:22',
        arrivalTime: '21:22',
        origin: 'My House',
        date: '25th Aug, 2024',
        fee: 2000,
      },
      {
        id: Math.random(),
        destination: 'Saje Foods and Pastries',
        bookingTime: '20:22',
        arrivalTime: '21:22',
        origin: 'My House',
        date: '25th Aug, 2024',
        fee: 2000,
      },
      {
        id: Math.random(),
        destination: 'Saje Foods and Pastries',
        bookingTime: '20:22',
        arrivalTime: '21:22',
        origin: 'My House',
        date: '25th Aug, 2024',
        fee: 2000,
      },
    ],
  },
];

export interface Order {
  _id: string;
  dropOffLocation: {address: string; latitude: number; longitude: number};
  isPaid: boolean;
  orderTime: string;
  passengerId: string;
  pickupLocation: {address: string; latitude: number; longitude: number};
  status: 'pending' | 'completed' | 'cancelled' | 'accepted';
  fare: number;
  passenger?: User;
  rider?: User;
}

interface TransformedOrder {
  title: string;
  data: {
    _id: string;
    dropOffLocation: {address: string; latitude: number; longitude: number};
    orderTime: string;
    // bookingTime: string; NOTE
    arrivalTime: string;
    pickupLocation: {address: string; latitude: number; longitude: number};
    date: string;
    fare: number;
  }[];
}

// Helper function to format date as '25th Aug, 2024'
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const day = date.getDate();
  const monthName = new Intl.DateTimeFormat('en-US', {month: 'short'}).format(
    date,
  );
  const year = date.getFullYear();

  const daySuffix = (day: number) => {
    if (day > 3 && day < 21) return 'th'; // catch 11th, 12th, 13th
    switch (day % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  };

  return `${day}${daySuffix(day)} ${monthName}, ${year}`;
}

// Helper function to format time as '20:22'
function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
}

// Function to transform and group orders by month-year
function transformOrders(orders: Order[]): TransformedOrder[] {
  const groupedOrders: Record<string, TransformedOrder> = {};

  orders.forEach(order => {
    const orderDate = new Date(order.orderTime);
    const shortMonthYear = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      year: 'numeric',
    }).format(orderDate);
    const longMonthYear = new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric',
    }).format(orderDate);

    if (!groupedOrders[longMonthYear]) {
      groupedOrders[longMonthYear] = {
        title: longMonthYear,
        data: [],
      };
    }

    groupedOrders[longMonthYear].data.push({
      _id: order._id,
      dropOffLocation: {
        address: order.dropOffLocation?.address,
        latitude: order.dropOffLocation?.latitude,
        longitude: order.dropOffLocation?.longitude,
      },
      pickupLocation: {
        address: order.pickupLocation?.address,
        latitude: order.pickupLocation?.latitude,
        longitude: order.pickupLocation?.longitude,
      },
      orderTime: formatTime(order.orderTime),
      arrivalTime: formatTime(
        new Date(
          new Date(order.orderTime).getTime() + 60 * 60 * 1000,
        ).toISOString(),
      ), // Assuming 1-hour difference for arrival
      date: formatDate(order.orderTime),
      fare: 2000, // Example fee
    });
  });

  // Return the grouped orders as an array
  return Object.values(groupedOrders);
}

const DEFAULT_ORDERS = Array.from({length: 20}, (_, i) => ({
  _id: i.toString(),
  dropOffLocation: {address: '', latitude: 0, longitude: 0},
  fare: 0,
  isPaid: false,
  orderTime: new Date(2024, Math.floor(i / 5) + 1, 15).toString(), // Month increments every 5 items
  passengerId: '',
  pickupLocation: {address: '', latitude: 0, longitude: 0},
  status: '',
}));

export default function Orders({status}: {status: 'pending' | 'completed'}) {
  const {getOrders} = useApi().order;
  const headerHeight = useSharedValue(0);

  const [h_height, setH_Height] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const headHeight = useHeaderHeight();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const responseData = await getOrders(status);
      if (!responseData) return;
      setOrders(responseData.orders);
    } catch (error) {
      console.error('GET_ORDERS: ', error);
    } finally {
      setLoading(false);
    }
  };

  // useFocusEffect(
  //   useCallback(() => {
  //     fetchOrders();
  //     return () => {
  //       headerHeight.value = 0;
  //       setH_Height(0);
  //     };
  //   }, []),
  // );

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      fetchOrders();
      setTimeout(() => {});
    });
    return () => task.cancel();
  }, []);

  const onRefresh = useCallback(() => {
    fetchOrders();
  }, []);

  return (
    <>
      <>
        <MotiView
          style={[a.flex_1]}
          transition={{
            type: 'timing',
          }}
          animate={{backgroundColor: '#ffffff'}}>
          <Container style={[a.bg_(colors.light), a.flex_1]} safeArea={false}>
            <SectionList
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              ListHeaderComponent={
                !orders.length && !loading ? (
                  <Column style={[a.align_center]}>
                    <Text style={[a.text_center]}>
                      You have no orders available
                    </Text>
                    <Button
                      variant="ghost"
                      shape="round"
                      style={[a.py_xs, a.px_md, a.mt_sm]}
                      color="primary"
                      onPress={fetchOrders}>
                      <ButtonText style={[a.text_md]}>Refresh</ButtonText>
                    </Button>
                  </Column>
                ) : undefined
              }
              showsVerticalScrollIndicator={false}
              contentInsetAdjustmentBehavior="automatic"
              stickySectionHeadersEnabled={true}
              style={[a.pt_xl]}
              sections={
                loading
                  ? transformOrders(DEFAULT_ORDERS)
                  : transformOrders(orders.reverse())
              }
              keyExtractor={(item, index) => (item?._id + index).toString()}
              ItemSeparatorComponent={() => (
                <Separator height={1} backgroundColor={colors.lightgrey} />
              )}
              SectionSeparatorComponent={() => <Separator height={15} />}
              renderSectionHeader={({section: {title}}) =>
                loading ? (
                  <OrdersHeaderLoading />
                ) : (
                  <View
                    style={[
                      {
                        shadowColor: colors.darkgray,
                        shadowOffset: {height: 10, width: 0},
                        shadowRadius: 10,
                        shadowOpacity: 0,
                        // elevation: 10,
                      },
                      a.bg_(colors.light),
                      a.w_(150),
                      a.rounded_xl,
                      a.px_sm,
                      a.py_xs,
                    ]}>
                    <Text>{title}</Text>
                  </View>
                )
              }
              renderItem={({item}) =>
                loading ? (
                  <OrderLoading />
                ) : (
                  <ListTile
                    action={() => router.push(`/(tabs)/orders/${item?._id}`)}
                    ripple
                    style={[a.py_md]}
                    leading={
                      <View
                        style={[
                          a.p_md,
                          a.rounded_full,
                          a.bg_(colors.lightgrey),
                        ]}>
                        <MaterialCommunityIcons name="car-outline" size={24} />
                      </View>
                    }
                    content={
                      <Column style={[a.ml_xl]}>
                        <Text
                          numberOfLines={1}
                          family="Bold"
                          style={[a.text_md]}>
                          {item?.dropOffLocation?.address}
                        </Text>
                        <Row>
                          <Text>{item?.date} - </Text>
                          <Text>${item?.fare}</Text>
                        </Row>
                      </Column>
                    }
                    // trailing={
                    //   <Button
                    //     style={[a.bg_(colors.lightgrey), a.px_lg, a.py_md]}
                    //     variant="solid"
                    //     shape="round">
                    //     <Row style={[a.align_center]}>
                    //       <Feather name="rotate-ccw" size={18} />
                    //       <ButtonText
                    //         family="Medium"
                    //         style={[a.text_(colors.dark)]}>
                    //         Rebook
                    //       </ButtonText>
                    //     </Row>
                    //   </Button>
                    // }
                  />
                )
              }
            />
          </Container>
        </MotiView>
      </>
    </>
  );
}

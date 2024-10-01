import {Feather, MaterialCommunityIcons} from '@expo/vector-icons';
import {useHeaderHeight} from '@react-navigation/elements';
import {Stack, useFocusEffect, useRouter} from 'expo-router';
import {useCallback, useEffect, useState} from 'react';
import {
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
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {RefreshControl} from 'react-native-gesture-handler';
import useApi from '$/src/hooks/api/useApi';

// const ORDER_DATA = [
//   {
//     title: 'Aug, 2024',
//     data: [
//       {
//         id: Math.random(),
//         destination: 'Saje Foods and Pastries',
//         bookingTime: '20:22',
//         arrivalTime: '21:22',
//         origin: 'My House',
//         date: '25th Aug, 2024',
//         fee: 2000,
//       },
//       {
//         id: Math.random(),
//         destination: 'Saje Foods and Pastries',
//         bookingTime: '20:22',
//         arrivalTime: '21:22',
//         origin: 'My House',
//         date: '25th Aug, 2024',
//         fee: 2000,
//       },
//       {
//         id: Math.random(),
//         destination: 'Saje Foods and Pastries',
//         bookingTime: '20:22',
//         arrivalTime: '21:22',
//         origin: 'My House',
//         date: '25th Aug, 2024',
//         fee: 2000,
//       },
//       {
//         id: Math.random(),
//         destination: 'Saje Foods and Pastries',
//         bookingTime: '20:22',
//         arrivalTime: '21:22',
//         origin: 'My House',
//         date: '25th Aug, 2024',
//         fee: 2000,
//       },
//       {
//         id: Math.random(),
//         destination: 'Saje Foods and Pastries',
//         bookingTime: '20:22',
//         arrivalTime: '21:22',
//         origin: 'My House',
//         date: '25th Aug, 2024',
//         fee: 2000,
//       },
//       {
//         id: Math.random(),
//         destination: 'Saje Foods and Pastries',
//         bookingTime: '20:22',
//         arrivalTime: '21:22',
//         origin: 'My House',
//         date: '25th Aug, 2024',
//         fee: 2000,
//       },
//       {
//         id: Math.random(),
//         destination: 'Saje Foods and Pastries',
//         bookingTime: '20:22',
//         arrivalTime: '21:22',
//         origin: 'My House',
//         date: '25th Aug, 2024',
//         fee: 2000,
//       },
//       {
//         id: Math.random(),
//         destination: 'Saje Foods and Pastries',
//         bookingTime: '20:22',
//         arrivalTime: '21:22',
//         origin: 'My House',
//         date: '25th Aug, 2024',
//         fee: 2000,
//       },
//       {
//         id: Math.random(),
//         destination: 'Saje Foods and Pastries',
//         bookingTime: '20:22',
//         arrivalTime: '21:22',
//         origin: 'My House',
//         date: '25th Aug, 2024',
//         fee: 2000,
//       },
//       {
//         id: Math.random(),
//         destination: 'Saje Foods and Pastries',
//         bookingTime: '20:22',
//         arrivalTime: '21:22',
//         origin: 'My House',
//         date: '25th Aug, 2024',
//         fee: 2000,
//       },
//       {
//         id: Math.random(),
//         destination: 'Saje Foods and Pastries',
//         bookingTime: '20:22',
//         arrivalTime: '21:22',
//         origin: 'My House',
//         date: '25th Aug, 2024',
//         fee: 2000,
//       },
//       {
//         id: Math.random(),
//         destination: 'Saje Foods and Pastries',
//         bookingTime: '20:22',
//         arrivalTime: '21:22',
//         origin: 'My House',
//         date: '25th Aug, 2024',
//         fee: 2000,
//       },
//     ],
//   },
//   {
//     title: 'September, 2024',
//     data: [
//       {
//         id: Math.random(),
//         destination: 'Saje Foods and Pastries',
//         bookingTime: '20:22',
//         arrivalTime: '21:22',
//         origin: 'My House',
//         date: '25th Aug, 2024',
//         fee: 2000,
//       },
//       {
//         id: Math.random(),
//         destination: 'Saje Foods and Pastries',
//         bookingTime: '20:22',
//         arrivalTime: '21:22',
//         origin: 'My House',
//         date: '25th Aug, 2024',
//         fee: 2000,
//       },
//       {
//         id: Math.random(),
//         destination: 'Saje Foods and Pastries',
//         bookingTime: '20:22',
//         arrivalTime: '21:22',
//         origin: 'My House',
//         date: '25th Aug, 2024',
//         fee: 2000,
//       },
//       {
//         id: Math.random(),
//         destination: 'Saje Foods and Pastries',
//         bookingTime: '20:22',
//         arrivalTime: '21:22',
//         origin: 'My House',
//         date: '25th Aug, 2024',
//         fee: 2000,
//       },
//       {
//         id: Math.random(),
//         destination: 'Saje Foods and Pastries',
//         bookingTime: '20:22',
//         arrivalTime: '21:22',
//         origin: 'My House',
//         date: '25th Aug, 2024',
//         fee: 2000,
//       },
//       {
//         id: Math.random(),
//         destination: 'Saje Foods and Pastries',
//         bookingTime: '20:22',
//         arrivalTime: '21:22',
//         origin: 'My House',
//         date: '25th Aug, 2024',
//         fee: 2000,
//       },
//       {
//         id: Math.random(),
//         destination: 'Saje Foods and Pastries',
//         bookingTime: '20:22',
//         arrivalTime: '21:22',
//         origin: 'My House',
//         date: '25th Aug, 2024',
//         fee: 2000,
//       },
//       {
//         id: Math.random(),
//         destination: 'Saje Foods and Pastries',
//         bookingTime: '20:22',
//         arrivalTime: '21:22',
//         origin: 'My House',
//         date: '25th Aug, 2024',
//         fee: 2000,
//       },
//       {
//         id: Math.random(),
//         destination: 'Saje Foods and Pastries',
//         bookingTime: '20:22',
//         arrivalTime: '21:22',
//         origin: 'My House',
//         date: '25th Aug, 2024',
//         fee: 2000,
//       },
//       {
//         id: Math.random(),
//         destination: 'Saje Foods and Pastries',
//         bookingTime: '20:22',
//         arrivalTime: '21:22',
//         origin: 'My House',
//         date: '25th Aug, 2024',
//         fee: 2000,
//       },
//       {
//         id: Math.random(),
//         destination: 'Saje Foods and Pastries',
//         bookingTime: '20:22',
//         arrivalTime: '21:22',
//         origin: 'My House',
//         date: '25th Aug, 2024',
//         fee: 2000,
//       },
//       {
//         id: Math.random(),
//         destination: 'Saje Foods and Pastries',
//         bookingTime: '20:22',
//         arrivalTime: '21:22',
//         origin: 'My House',
//         date: '25th Aug, 2024',
//         fee: 2000,
//       },
//       {
//         id: Math.random(),
//         destination: 'Saje Foods and Pastries',
//         bookingTime: '20:22',
//         arrivalTime: '21:22',
//         origin: 'My House',
//         date: '25th Aug, 2024',
//         fee: 2000,
//       },
//       {
//         id: Math.random(),
//         destination: 'Saje Foods and Pastries',
//         bookingTime: '20:22',
//         arrivalTime: '21:22',
//         origin: 'My House',
//         date: '25th Aug, 2024',
//         fee: 2000,
//       },
//       {
//         id: Math.random(),
//         destination: 'Saje Foods and Pastries',
//         bookingTime: '20:22',
//         arrivalTime: '21:22',
//         origin: 'My House',
//         date: '25th Aug, 2024',
//         fee: 2000,
//       },
//     ],
//   },
// ];

export interface Order {
  _id: string;
  dropOffLocation: {address: string; latitude: number; longitude: number};
  isPaid: boolean;
  orderTime: string;
  passengerId: string;
  pickupLocation: {address: string; latitude: number; longitude: number};
  status: string;
  fare: number;
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
        address: order.dropOffLocation.address,
        latitude: order.dropOffLocation.latitude,
        longitude: order.dropOffLocation.longitude,
      },
      pickupLocation: {
        address: order.pickupLocation.address,
        latitude: order.pickupLocation.latitude,
        longitude: order.pickupLocation.longitude,
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

export default function Orders() {
  const {getOrders} = useApi().order;
  const headerHeight = useSharedValue(0);

  const [h_height, setH_Height] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const headHeight = useHeaderHeight();

  const [orders, setOrders] = useState<Order[]>([]);

  const router = useRouter();
  const animatedContainerStyle = useAnimatedStyle(() => ({
    paddingTop: headerHeight.value,
  }));

  useFocusEffect(
    useCallback(() => {
      console.log('FOCUS!');
      (async () => {
        const responseData = await getOrders();
        console.log('ORDERS: ', responseData);
        if (!responseData) return;
        setOrders(responseData.orders);
      })();
      return () => {
        headerHeight.value = 0;
        setH_Height(0);
      };
    }, []),
  );

  useEffect(() => {}, []);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollOffsetY = event.nativeEvent.contentOffset.y;

    // Set the threshold for when the large title collapses (typically around 100-120px)
    const collapseThreshold = -headHeight;

    // Check if header is collapsed
    if (
      scrollOffsetY >= collapseThreshold &&
      headerHeight.value === 0 &&
      h_height === 0
    ) {
      setH_Height(headHeight);
      headerHeight.value = withTiming(headHeight, {duration: 300});
    }
    // else if (scrollOffsetY < collapseThreshold && isHeaderCollapsed) {
    //   setHeaderCollapsed(false);
    // }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Orders',
          headerShown: true,
          headerLargeTitle: true,
        }}
      />
      <>
        <Container
          style={[
            a.bg_(colors.light),
            a.flex_1,
            // Platform.OS === 'ios' && [a.pt_(h_height)],
            Platform.OS === 'ios' && animatedContainerStyle,
            // a.flex_1,
          ]}
          safeArea={false}>
          <SectionList
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            onScroll={handleScroll}
            showsVerticalScrollIndicator={false}
            contentInsetAdjustmentBehavior="automatic"
            stickySectionHeadersEnabled={true}
            style={[a.pt_xl]}
            sections={transformOrders(orders)}
            keyExtractor={(item, index) => (item._id + index).toString()}
            ItemSeparatorComponent={() => (
              <Separator height={1} backgroundColor={colors.lightgrey} />
            )}
            SectionSeparatorComponent={() => <Separator height={15} />}
            renderSectionHeader={({section: {title}}) => (
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
            )}
            renderItem={({item}) => (
              <ListTile
                action={() => router.push(`/(tabs)/orders/${item._id}`)}
                ripple
                style={[a.py_md]}
                leading={
                  <View
                    style={[a.p_md, a.rounded_full, a.bg_(colors.lightgrey)]}>
                    <MaterialCommunityIcons name="car-outline" size={24} />
                  </View>
                }
                content={
                  <Column style={[a.ml_xl]}>
                    <Text numberOfLines={1} family="Bold" style={[a.text_md]}>
                      {item.dropOffLocation.address}
                    </Text>
                    <Row>
                      <Text>{item.date} - </Text>
                      <Text>N{item.fare}</Text>
                    </Row>
                  </Column>
                }
                trailing={
                  <Button
                    style={[a.bg_(colors.lightgrey), a.px_lg, a.py_md]}
                    variant="solid"
                    shape="round">
                    <Row style={[a.align_center]}>
                      <Feather name="rotate-ccw" size={18} />
                      <ButtonText
                        family="Medium"
                        style={[a.text_(colors.dark)]}>
                        Rebook
                      </ButtonText>
                    </Row>
                  </Button>
                }
              />
            )}
          />
        </Container>
      </>
    </>
  );
}

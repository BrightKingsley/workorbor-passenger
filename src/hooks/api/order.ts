// import {useNavigation} from '@react-navigation/native';
import {useCallback} from 'react';

import {ApiError} from '#/lib/utils/api/axios';
import apiRoutes from '#/lib/utils/api/routes';
// import {NavigationProps} from '#/navigation/types';
import {OrderRequest} from '#/store/slices/order/types';
import useRequest from './useRequest';
import {useAppDispatch, useAppSelector} from '../store';
import {Alert} from 'react-native';

// import {useAppDispatch} from '../store';

export default function useOrderApi() {
  // const navigation = useNavigation<NavigationProps>();
  const dispatch = useAppDispatch();
  const {orderRequest} = useAppSelector(state => state.order);
  const {fetchData} = useRequest();

  const getOrders = useCallback(async () => {
    try {
      const data = await fetchData<{orders: any[]}>(
        'get',
        `${apiRoutes.order.orders.route}?user_type=passenger`,
      );
      console.log({data});
      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error(
          `API Error: ${error.message} (Status: ${error.status}, ${error.statusText})`,
        );
      } else {
        console.error('Unexpected Error:', error);
      }
      return null;
    }
  }, []);

  const getOrder = useCallback(async (id: string) => {
    try {
      const data = await fetchData<{order: any}>(
        'get',
        `${apiRoutes.order.orders.route_(id)}`,
      );
      console.log({data});
      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error(
          `API Error: ${error.message} (Status: ${error.status}, ${error.statusText})`,
        );
      } else {
        console.error('Unexpected Error:', error);
      }

      return null;
    }
  }, []);

  const createOrder = useCallback(async () => {
    try {
      if (!orderRequest) return Alert.alert('Invalid Order Request');
      const data = await fetchData<{orderId: string}>(
        'post',
        `${apiRoutes.order.create.route}`,
        {order: orderRequest},
      );
      console.log({data});
    } catch (error) {
      if (error instanceof ApiError) {
        console.error(
          `API Error: ${error.message} (Status: ${error.status}, ${error.statusText})`,
        );
      } else {
        console.error('Unexpected Error:', error);
      }
    }
  }, []);

  return {
    createOrder,
    getOrder,
    getOrders,
  };
}

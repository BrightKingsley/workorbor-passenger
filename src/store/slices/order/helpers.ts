import {Dispatch} from '@reduxjs/toolkit';

import store from '#/store';

import {setOrderRequest, setOrderResponse} from './slice';
import {OrderResponse, RideOrderRequest, RideOrderResponse} from './types';

export function updateOrderRequest(
  dispatch: Dispatch,
  data: Partial<RideOrderRequest>,
) {
  const orderState = store.getState().order;
  if (!data) return;
  dispatch(
    setOrderRequest({
      orderRequest: {...orderState.orderRequest, ...(data as any)},
    }),
  );
}

export function updateOrderResponse(
  dispatch: Dispatch,
  data: Partial<RideOrderResponse>,
) {
  const orderState = store.getState().order;
  console.debug('updateOrderResponse', {data, orderState});
  if (!data) return;
  dispatch(
    setOrderResponse({
      orderResponse: {
        ...orderState.orderResponse,
        ...(data as OrderResponse),
      },
    }),
  );
}

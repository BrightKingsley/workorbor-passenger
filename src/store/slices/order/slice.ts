import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {OrderPhase, OrderState} from './types';

// export type OrderType = 'ride' | 'delivery';

const initialState: OrderState = {
  orderRequest: null,
  orderResponse: null,
  orderPhase: OrderPhase.nil,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrderRequest: (state, action: PayloadAction<Partial<OrderState>>) => {
      state.orderRequest = action.payload.orderRequest!;
    },
    setOrderResponse: (state, action: PayloadAction<Partial<OrderState>>) => {
      state.orderResponse = action.payload.orderResponse!;
    },
    setOrderPhase: (state, action: PayloadAction<Partial<OrderState>>) => {
      state.orderPhase = action.payload.orderPhase!;
    },
    clearOrderRequest: state => {
      state.orderRequest = null;
    },
    clearOrderResponse: state => {
      state.orderRequest = null;
    },
  },
});

export const {
  clearOrderRequest,
  clearOrderResponse,
  setOrderRequest,
  setOrderResponse,
} = orderSlice.actions;
export default orderSlice;

import {combineReducers} from 'redux';

import authSlice from './slices/auth';
import chatSlice from './slices/chat';
import locationSlice from './slices/location';
import orderSlice from './slices/order/slice';

const rootReducer = combineReducers({
  auth: authSlice.reducer,
  // modal: modalSlice.reducer,
  // notification: notificationSlice.reducer,
  order: orderSlice.reducer,
  location: locationSlice.reducer,
  chat: chatSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;

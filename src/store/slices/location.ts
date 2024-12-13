import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import * as Location from 'expo-location';
import {Address} from 'react-native-maps';

type LocationState = {
  currentPosition: Location.LocationObject | null;
  lastPosition: Location.LocationObject | null;
  currentAddress:
    | (Partial<Location.LocationGeocodedAddress> & Partial<Address>)
    | null;
};

const initialState: LocationState = {
  currentPosition: null,
  lastPosition: null,
  currentAddress: null,
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setCurrentPosition: (
      state,
      action: PayloadAction<Partial<LocationState>>,
    ) => {
      state.currentPosition = action.payload.currentPosition!;
    },
    setLastPosition: (state, action: PayloadAction<Partial<LocationState>>) => {
      state.lastPosition = action.payload.lastPosition!;
    },
    setCurrentAddress: (
      state,
      action: PayloadAction<Partial<LocationState>>,
    ) => {
      state.currentAddress = action.payload.currentAddress!;
    },
  },
});

export const {setCurrentPosition, setLastPosition, setCurrentAddress} =
  locationSlice.actions;
export default locationSlice;

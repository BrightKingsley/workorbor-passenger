import {createSlice, PayloadAction} from '@reduxjs/toolkit';

type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading?: boolean;
  error?: string | null;
};

let user: AuthState['user'] = null;
// const storedUser = localStorage.getItem('user');
// if (storedUser) user = JSON.parse(storedUser);
// const token = localStorage.getItem('token');

const storedUser = '';
if (storedUser) user = JSON.parse(storedUser);
const token = '';

const initialState: AuthState = {
  user,
  isAuthenticated: user ? true : false,
  isLoading: false,
  error: null,
  token,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<AuthState & {callback?: () => void}>,
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isLoading = false;
      if (action.payload.callback) {
        action.payload.callback();
      }
    },
    clearUser: state => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },
  },
  extraReducers: builder => {
    builder;
    // Handle signupUser and other async thunks similarly...
  },
});

export const {setUser, clearUser} = authSlice.actions;
export default authSlice;

import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';

import {getItemFromAsyncStore} from '$/src/lib/utils/helpers/async-store';

export interface Transaction {
  id: string;
  amount: number;
  type: 'top-up' | 'withdrawal' | 'purchase'; // Extend as needed
  date?: string; // You can add date for better tracking
}

interface WalletState {
  balance: number | null;
  transactions: Transaction[] | null;
  loading: boolean;
  error?: string | null;
}

const initialState: WalletState = {
  balance: 0,
  transactions: [],
  loading: false,
  error: null,
};

export const loadWalletFromStorage = createAsyncThunk(
  'wallet/loadWalletFromStorage',
  async (_, {rejectWithValue}) => {
    try {
      const storedWalletBalance = await getItemFromAsyncStore('wallet_balance');
      const storedTransactions = await getItemFromAsyncStore('transactions');
      if (storedWalletBalance && storedTransactions) {
        return {balance: storedWalletBalance, transactions: storedTransactions};
      }
      return {balance: null, transactions: null};
    } catch (error) {
      return rejectWithValue('Failed to load user from storage');
    }
  },
);

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setWalletDetails: (
      state,
      action: PayloadAction<{balance: number; transactions: Transaction[]}>,
    ) => {
      state.balance = action.payload.balance;
      state.transactions = action.payload.transactions;
    },
    updateBalance: (state, action: PayloadAction<number>) => {
      if (state.balance)
        state.balance += action.payload; // Update balance with the top-up amount
      else state.balance = action.payload;
    },
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions?.push(action.payload); // Add new transaction to the list
    },
    clearTransactions: state => {
      state.transactions = []; // Clear transactions if needed
    },
  },
  extraReducers: builder => {
    builder.addCase(loadWalletFromStorage.pending, state => {
      state.loading = true;
    });
    builder.addCase(loadWalletFromStorage.fulfilled, (state, action) => {
      state.balance = action.payload.balance;
      state.transactions = action.payload.transactions;
      state.loading = false;
    });
    builder.addCase(loadWalletFromStorage.rejected, (state, action) => {
      state.error = action.payload as string;
      state.loading = false;
    });
  },
});

// Export actions
export const {
  setWalletDetails,
  updateBalance,
  addTransaction,
  clearTransactions,
} = walletSlice.actions;

// Export reducer
export default walletSlice;

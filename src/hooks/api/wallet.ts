import {useCallback} from 'react';
import {Alert} from 'react-native';

import {ApiError} from '#/lib/utils/api/axios';
import apiRoutes from '#/lib/utils/api/routes';

import useRequest from './useRequest';
import {
  addTransaction,
  setWalletDetails,
  Transaction,
  updateBalance,
} from '$/src/store/slices/wallet';
import {
  addItemToAsyncStore,
  getItemFromAsyncStore,
} from '$/src/lib/utils/helpers/async-store';
import {useAppDispatch, useAppSelector} from '../store';
import useLocationService from '../useLocationService';

export default function useWalletApi() {
  const dispatch = useAppDispatch();

  const {balance, transactions} = useAppSelector(state => state.wallet);

  const getWalletDetails = useCallback(async () => {
    try {
      const balance = await getItemFromAsyncStore('wallet_balance');
      const transactions = await getItemFromAsyncStore('transactions');
      const data = {
        balance: balance ? balance : 0,
        transactions: transactions ? transactions : [],
      };
      dispatch(setWalletDetails(data)); // Update context with wallet details
      return data;
    } catch (error) {
      console.error('Unexpected Error:', error);
      return null;
    }
  }, []);

  const topUp = useCallback(
    async (amount: string) => {
      try {
        console.log({amount});
        if (!amount || isNaN(parseFloat(amount))) {
          Alert.alert('Invalid Amount', 'Please enter a valid top-up amount.');
          return 'failed';
        }

        // Simulate API call by writing to async storage
        const transactionId = new Date().getTime().toString(); // Generate a unique transaction ID
        const transaction: Transaction = {
          id: transactionId,
          amount: parseFloat(amount),
          type: 'top-up', // Add the type property
        };

        // Update balance and add transaction
        dispatch(updateBalance(parseFloat(amount)));
        dispatch(addTransaction(transaction));

        // Save transaction to async storage
        // Retrieve existing transactions from async storage
        const existingTransactions =
          await getItemFromAsyncStore('transactions');
        const transactionsArray: Transaction[] = existingTransactions
          ? existingTransactions
          : [];

        // Append the new transaction to the array
        transactionsArray.push(transaction);

        // Save the updated transactions array back to async storage
        await addItemToAsyncStore('transactions', transactionsArray);

        // Update balance in async storage
        const currentBalance = await getItemFromAsyncStore('wallet_balance');

        const newBalance =
          (parseFloat(currentBalance?.toString() || '0') || 0) +
          parseFloat(amount);
        await addItemToAsyncStore('wallet_balance', newBalance);

        // return {transactionId};
        return 'success';
      } catch (error) {
        console.error('Unexpected Error:', error);
        // return null;
        return 'failed';
      }
    },
    [updateBalance, addTransaction],
  );

  // Optional: Function to fetch recent transactions if needed
  // const getTransactions = useCallback(async () => {
  //   try {
  //     const data = await fetchData<{transactions: any[]}>(
  //       'get',
  //       apiRoutes.wallet.transactions.route,
  //     );
  //     return data.transactions; // Return the list of transactions
  //   } catch (error) {
  //     if (error instanceof ApiError) {
  //       console.error(
  //         `API Error: ${error.message} (Status: ${error.status}, ${error.statusText})`,
  //       );
  //     } else {
  //       console.error('Unexpected Error:', error);
  //     }
  //     return null;
  //   }
  // }, [fetchData]);
  const getTransactions = useCallback(async () => {
    try {
      const transactions = await getItemFromAsyncStore('transactions');
      dispatch(
        setWalletDetails({
          balance: balance || 0,
          transactions: transactions || [],
        }),
      );
      return transactions ? transactions : []; // Return the list of transactions
    } catch (error) {
      console.error('Unexpected Error:', error);
      return null;
    }
  }, []);

  return {
    topUp,
    getWalletDetails,
    getTransactions,
  };
}

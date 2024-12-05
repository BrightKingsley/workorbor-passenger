import AsyncStorage from '@react-native-async-storage/async-storage';

import {Transaction} from '$/src/store/slices/wallet';

type StoreItems = {
  auth: {
    password: string;
    email: string;
  };
  user: User;
  wallet_balance: number;
  transactions: Transaction[];
};

export async function getItemFromAsyncStore<K extends keyof StoreItems>(
  item: K,
): Promise<StoreItems[K] | null> {
  const storedItem = await AsyncStorage.getItem(item);
  return storedItem ? (JSON.parse(storedItem) as StoreItems[K]) : null;
}

export async function addItemToAsyncStore<K extends keyof StoreItems>(
  key: K,
  value: StoreItems[K],
): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function updateItemInAsyncStore<K extends keyof StoreItems>(
  key: K,
  value: Partial<StoreItems[K]>,
): Promise<void> {
  await AsyncStorage.mergeItem(key, JSON.stringify(value));
}

export async function removeItemFromAsyncStore<K extends keyof StoreItems>(
  item: K,
) {
  await AsyncStorage.removeItem(item);
}

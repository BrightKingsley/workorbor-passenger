import {Stack} from 'expo-router';

export default function Layout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{headerShown: false}} />
        <Stack.Screen
          name="chats"
          options={{headerShown: false, presentation: 'modal'}}
        />
        <Stack.Screen
          name="wallet"
          options={{headerShown: false, presentation: 'modal'}}
        />
      </Stack>
    </>
  );
}

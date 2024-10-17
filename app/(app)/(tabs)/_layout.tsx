import {MaterialCommunityIcons} from '@expo/vector-icons';
import {Tabs} from 'expo-router';
import {GestureResponderEvent, Pressable} from 'react-native';

import {HomeIcon, HomeIconOutline} from '$/src/assets/icons';
import {colors} from '$/src/lib/theme/palette';
import {useCallback} from 'react';
import {useModals} from '$/src/components/global/modals/ModalState';
import {Haptics} from '$/src/lib/utils/haptics';

export default function TabLayout() {
  const {isModalActive} = useModals();
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          headerShown: false,
          tabBarStyle: {
            display: isModalActive ? 'none' : 'flex',
          },
          tabBarLabelStyle: {
            fontFamily: 'DMSans_400Regular',
          },
          // tabBarShowLabel: false,
          tabBarButton({children, onPressIn, ...props}) {
            const onTabButtonPressIn = useCallback(
              (e: GestureResponderEvent) => {
                onPressIn?.(e);
                Haptics.success();
              },
              [],
            );
            return (
              <Pressable onPressIn={onTabButtonPressIn} {...props}>
                {children}
              </Pressable>
            );
          },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({color, focused}) =>
              focused ? <HomeIcon fill={color} /> : <HomeIconOutline />,
          }}
        />
        <Tabs.Screen
          name="orders"
          options={{
            title: 'orders',
            headerShown: false,
            tabBarIcon: ({color, focused}) => (
              <MaterialCommunityIcons
                name={focused ? 'calendar-blank' : 'calendar-blank-outline'}
                color={color}
                size={24}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="account"
          options={{
            title: 'account',
            tabBarIcon: ({color, focused}) => (
              <MaterialCommunityIcons
                name={focused ? 'account-circle' : 'account-circle-outline'}
                color={color}
                size={24}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
}

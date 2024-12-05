import {MaterialCommunityIcons} from '@expo/vector-icons';
import {Tabs} from 'expo-router';
import {GestureResponderEvent, Pressable} from 'react-native';

import {HomeIcon, HomeIconOutline} from '$/src/assets/icons';
import {colors} from '$/src/lib/theme/palette';
import {ComponentProps, useCallback, useMemo} from 'react';
import {useModals} from '$/src/components/global/modals/ModalState';
import {Haptics} from '$/src/lib/utils/haptics';
import {BottomTabNavigationOptions} from '@react-navigation/bottom-tabs';
import {LabelPosition} from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import {ParamListBase, RouteProp} from '@react-navigation/native';
import {HeaderOptions} from '@react-navigation/elements';
import {ScreenProps} from 'expo-router/build/useScreens';

type RouteOptions = ComponentProps<typeof Tabs.Screen>['options'];

export default function TabLayout() {
  const {isModalActive} = useModals();

  const screenOptions = useMemo(
    (): BottomTabNavigationOptions => ({
      lazy: false,
      tabBarActiveTintColor: colors.primary,
      headerShown: false,
      tabBarStyle: {
        display: isModalActive ? 'none' : 'flex',
      },
      tabBarLabelStyle: {
        fontFamily: 'DMSans_400Regular',
      },
      tabBarButton({children, onPressIn, ...props}) {
        const onTabButtonPressIn = useCallback((e: GestureResponderEvent) => {
          onPressIn?.(e);
          Haptics.success();
        }, []);
        return (
          <Pressable onPressIn={onTabButtonPressIn} {...props}>
            {children}
          </Pressable>
        );
      },
    }),
    [isModalActive],
  );

  const homeScreenOptions = useMemo(
    (): RouteOptions => ({
      title: 'Home',
      tabBarIcon: ({color, focused}) =>
        focused ? <HomeIcon fill={color} /> : <HomeIconOutline />,
    }),
    [],
  );

  const ordersScreenOptions = useMemo(
    (): RouteOptions => ({
      title: 'orders',
      headerShown: false,
      tabBarIcon: ({color, focused}) => (
        <MaterialCommunityIcons
          name={focused ? 'calendar-blank' : 'calendar-blank-outline'}
          color={color}
          size={24}
        />
      ),
    }),
    [],
  );

  const accountScreenOptions = useMemo(
    (): RouteOptions => ({
      title: 'account',
      tabBarIcon: ({color, focused}) => (
        <MaterialCommunityIcons
          name={focused ? 'account-circle' : 'account-circle-outline'}
          color={color}
          size={24}
        />
      ),
    }),
    [],
  );

  return (
    <>
      <Tabs screenOptions={screenOptions}>
        <Tabs.Screen name="index" options={homeScreenOptions} />
        <Tabs.Screen name="orders" options={ordersScreenOptions} />
        <Tabs.Screen name="account" options={accountScreenOptions} />
      </Tabs>
    </>
  );
}

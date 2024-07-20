import {Ionicons} from '@expo/vector-icons';
import {
  createNavigationContainerRef,
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackHeaderProps,
} from '@react-navigation/native-stack';
import * as React from 'react';
import {Platform, StatusBar} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {View} from '#/components/Themed';
import {a} from '#/lib/style/atoms';
import {useColorSchemeStyle} from '#/lib/theme/hooks';
import {LoginScreen, RegisterScreen} from '#/screens';
import ForgotPassword from '#/screens/Auth/ForgotPassword';
import ResetPassword from '#/screens/Auth/ResetPassword';
import VerifyOtp from '#/screens/Auth/VerifyOtp';
import Home from '#/screens/Home';

import {AllNavigatorParams} from './types';

const navigationRef = createNavigationContainerRef<AllNavigatorParams>();

function AuthStackHeader({navigation}: NativeStackHeaderProps) {
  return Platform.OS === 'ios' ? null : (
    <View
      style={[
        a.absolute,
        a.mt_(StatusBar.currentHeight!),
        a.left_(10),
        a.rounded_full,
      ]}>
      {navigation.canGoBack() && (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[a.h_(50), a.w_(50), a.align_center, a.justify_center]}>
          <Ionicons name="arrow-back" size={30} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const Stack = createNativeStackNavigator<AllNavigatorParams>();
export function Navigator() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login" getComponent={() => LoginScreen} />
      <Stack.Screen name="SignUp" getComponent={() => RegisterScreen} />
      <Stack.Screen
        options={{
          headerShown: true,
          header: AuthStackHeader,
        }}
        name="ForgotPassword"
        getComponent={() => ForgotPassword}
      />
      <Stack.Screen
        options={{
          headerShown: true,
          header: AuthStackHeader,
        }}
        name="VerifyOtp"
        getComponent={() => VerifyOtp}
      />
      <Stack.Screen
        options={{
          headerShown: true,
          header: AuthStackHeader,
        }}
        name="ResetPassword"
        getComponent={() => ResetPassword}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          header: AuthStackHeader,
        }}
        name="Home"
        getComponent={() => Home}
      />
    </Stack.Navigator>
  );
}

function RouteContainer({children}: React.PropsWithChildren<{}>) {
  const theme = useColorSchemeStyle(DefaultTheme, DarkTheme);
  const prevLoggedRouteName = React.useRef<string | undefined>(undefined);

  function onReady() {
    prevLoggedRouteName.current = getCurrentRouteName();
  }
  return (
    <NavigationContainer
      ref={navigationRef}
      theme={theme}
      onStateChange={() => {
        console.log('router:navigate', {
          from: prevLoggedRouteName.current,
        });
      }}
      onReady={() => onReady()}>
      {children}
    </NavigationContainer>
  );
}

export default RouteContainer;

function getCurrentRouteName() {
  if (navigationRef.isReady()) {
    return navigationRef.getCurrentRoute()?.name;
  } else {
    return undefined;
  }
}

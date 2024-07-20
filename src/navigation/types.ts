import {NavigationState, PartialState} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
export type CommonNavigatorParams = {
  NotFound: undefined;
  Onboarding: undefined;
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  VerifyOtp?: {email?: string};
  ResetPassword: {email?: string};
  Profile: undefined;
};

export type AllNavigatorParams = CommonNavigatorParams & {
  Home: undefined;
};

export type NavigationProps = NativeStackNavigationProp<
  AllNavigatorParams,
  any,
  string
>;

export type State =
  | NavigationState
  | Omit<PartialState<NavigationState>, 'stale'>;

type ExtractScreenNames<T> =
  T extends NativeStackNavigationProp<infer P> ? keyof P : never;

export type ScreenNamesFromNavigationProps =
  ExtractScreenNames<NavigationProps>;

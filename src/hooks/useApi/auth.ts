import fetchData, {ApiError} from '#/lib/utils/api/axios';
import apiRoutes from '#/lib/utils/api/routes';
import {NavigationProps} from '#/navigation/types';
import {setUser} from '#/store/slices/auth';
import {useNavigation} from '@react-navigation/native';
import {useCallback} from 'react';
import {useAppDispatch} from '../store';
import {addItemFromAsyncStore} from '$/src/lib/utils/helpers/async-store';

export default function useAuthApi() {
  const navigation = useNavigation<NavigationProps>();
  const dispatch = useAppDispatch();

  const login = useCallback(
    async (
      {email, password}: {email: string; password: string},
      remember?: boolean,
    ) => {
      console.log({email, password});
      try {
        const data = await fetchData<{
          message: string;
          user: User;
          token: string;
        }>('post', `${apiRoutes.auth.login.route}`, {email, password});
        console.log({data});
        dispatch(
          setUser({
            isAuthenticated: true,
            user: data.user,
            token: data.token,
          }),
        );
        navigation.navigate('Home');

        if (remember) addItemFromAsyncStore('auth', {email, password});
        return true;
      } catch (error) {
        if (error instanceof ApiError) {
          console.error(
            `API Error: ${error.message} (Status: ${error.status}, ${error.statusText})`,
          );
        } else {
          console.error('Unexpected Error:', error);
        }
        return false;
      }
    },
    [],
  );

  const signup = useCallback(
    async ({
      email,
      firstname,
      lastname,
      password,
      phoneNumber,
      anniversary,
      dateOfBirth,
      gender,
      referee,
    }: {
      email: string;
      password: string;
      firstname: string;
      lastname: string;
      phoneNumber: string;
      gender: string;
      dateOfBirth: string;
      anniversary: string;
      referee: string;
    }) => {
      try {
        const data = await fetchData('post', `${apiRoutes.auth.signup.route}`, {
          email,
          password,
          firstname,
          lastname,
          phoneNumber,
          anniversary,
          dateOfBirth,
          gender,
          referee,
        });
        console.log({data});
      } catch (error) {
        if (error instanceof ApiError) {
          console.error(
            `API Error: ${error.message} (Status: ${error.status}, ${error.statusText})`,
          );
        } else {
          console.error('Unexpected Error:', error);
        }
      }
    },
    [],
  );

  const forgotPassword = useCallback(async (email: string) => {
    try {
      const data = await fetchData(
        'post',
        `${apiRoutes.auth['forgot-password'].route}`,
        {email},
      );
      console.log({data});
      return true;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error(
          `API Error: ${error.message} (Status: ${error.status}, ${error.statusText})`,
        );
      } else {
        console.error('Unexpected Error:', error);
      }
      return false;
    }
  }, []);

  const verifyResetOtp = async ({email, otp}: {otp: string; email: string}) => {
    console.log({otp, email});
    try {
      console.log('ROUTE: ', apiRoutes.auth['verify-reset-otp'].route);
      const data = await fetchData(
        'post',
        `${apiRoutes.auth['verify-reset-otp'].route}`,
        {otp, email},
      );
      console.log({data});
      return true;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error(
          `API Error: ${error.message} (Status: ${error.status}, ${error.statusText})`,
        );
      } else {
        console.error('Unexpected Error:', error);
      }
      return false;
    }
  };

  const createNewPassword = useCallback(
    async ({email, password}: {email: string; password: string}) => {
      try {
        const data = await fetchData(
          'post',
          `${apiRoutes.auth['reset-password'].route}`,
          {password, email},
        );
        console.log({data});
        return true;
      } catch (error) {
        if (error instanceof ApiError) {
          console.error(
            `API Error: ${error.message} (Status: ${error.status}, ${error.statusText})`,
          );
        } else {
          console.error('Unexpected Error:', error);
        }
        return false;
      }
    },
    [],
  );

  return {
    login,
    signup,
    forgotPassword,
    verifyResetOtp,
    createNewPassword,
  };
}

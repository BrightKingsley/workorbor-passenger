import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import React from 'react';
import {KeyboardAvoidingView, View} from 'react-native';

import {Column} from '#/components';
import DialPad from '#/components/Dialpad/Dialpad';
import {Text} from '#/components/Themed';
import useApi from '#/hooks/useApi';
import {a} from '#/lib/style/atoms';
import {colors} from '#/lib/theme/palette';
import {CommonNavigatorParams, NavigationProps} from '#/navigation/types';

export default function VerifyOtp() {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<RouteProp<CommonNavigatorParams>>();

  const {verifyResetOtp} = useApi();

  const [error, setError] = useState(false);
  const [, setLoading] = useState({login: false, google: false});

  const [input, setInput] = React.useState('');

  const handleNumberPress = (val: string) => {
    setError(false);
    console.log('OTP_INPUT_VALUE', val);
    setInput(val);
  };

  useEffect(() => {
    console.log({input});
  }, [input]);

  const handleCompleteOtp = () => {
    console.log('RUNNNN');
    setTimeout(async () => {
      setLoading(prev => ({...prev, login: true}));
      const success = await verifyResetOtp({
        otp: input,
        email: route.params?.email ?? '',
      });
      setLoading(prev => ({...prev, login: false}));
      if (success)
        return navigation.replace('ResetPassword', {
          email: route.params?.email,
        });
      setError(true);
    }, 500);
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={[a.flex_1]}>
      <View
        style={[
          a.flex_1,
          a.w_85,
          a.self_center,
          a.justify_center,
          a.align_center,
          a.flex_row,
        ]}>
        <Column style={[a.justify_center]}>
          <View style={[a.mx_auto]}>
            <Text
              style={[
                a.text_(colors.dark),
                a.text_center,
                a.text_xl,
                a.font_bold,
              ]}>
              Verify via E-mail or SMS
            </Text>
            <Text style={[a.mt_md, a.text_(colors.darkgray), a.text_center]}>
              Lorem ipsum dolor sit amet, consectetur elit. Nulla aliquet
              facilisis magna sit amet
            </Text>
          </View>

          <View style={[a.mt_2xl]}>
            <DialPad
              handleCompleteOtp={handleCompleteOtp}
              pinLength={4}
              getValue={handleNumberPress}
            />
          </View>

          {error && (
            <Text style={[a.self_center, a.text_(colors.error_light)]}>
              Please enter a correct code
            </Text>
          )}
        </Column>
      </View>
    </KeyboardAvoidingView>
  );
}

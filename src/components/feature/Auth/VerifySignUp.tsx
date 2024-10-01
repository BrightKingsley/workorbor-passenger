import {useEffect, useState} from 'react';
import React from 'react';
import {KeyboardAvoidingView, View} from 'react-native';

import {a} from '#/lib/style/atoms';
import {colors} from '#/lib/theme/palette';
import {Column} from '$/src/components/global';
import DialPad from '$/src/components/global/DialPad/DialPad';
import {Text} from '$/src/components/global/Themed';
import useApi from '$/src/hooks/api/useApi';

export default function VerifySignUp() {
  const [error, setError] = useState(false);
  const [, setLoading] = useState({login: false, google: false});

  const [code, setCode] = React.useState('');

  const {signup} = useApi().auth;

  const handleNumberPress = (val: string) => {
    setError(false);
    console.log('OTP_INPUT_VALUE', val);
    setCode(val);
  };

  useEffect(() => {
    console.log({input: code});
  }, [code]);

  const handleCompleteOtp = async (code: string) => {
    setLoading(prev => ({...prev, login: true}));
    console.log('CODE: ', code);
    await handleVerify(code);
    setLoading(prev => ({...prev, login: false}));
    setError(true);
  };

  const handleVerify = async (code: string) => {
    console.log({code});
    signup.verifyUser(code);
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
              Verify via E-mail or my SMS
            </Text>
            <Text style={[a.mt_md, a.text_(colors.darkgray), a.text_center]}>
              You will receive a verification code sent to your preferred
              service
            </Text>
          </View>

          <View style={[a.mt_2xl]}>
            <DialPad
              handleCompleteOtp={handleCompleteOtp}
              pinLength={6}
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

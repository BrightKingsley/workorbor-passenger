import {Button, Column, Row} from '#/components';
import Separator from '#/components/Separator';
import {Text} from '#/components/Themed';
import {a} from '#/lib/style/atoms';
import {colors} from '#/lib/theme/palette';
import {NavigationProps} from '#/navigation/types';
import {useNavigation} from '@react-navigation/native';
import {useCallback, useState} from 'react';
import {Image, KeyboardAvoidingView, ScrollView, View} from 'react-native';
import * as Location from 'expo-location';
import {useAppDispatch} from '#/hooks/store';
import React from 'react';

import TextInput from '#/components/TextInput';
import {ButtonText} from '#/components/Button';
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import useApi from '#/hooks/useApi';
import {WaterWave} from '#/assets/images';
import {hexWithOpacity} from '#/lib/ui/helpers';
import t from '../../../locales/translate';

export default function Login() {
  const navigation = useNavigation<NavigationProps>();
  const dispatch = useAppDispatch();
  const {login} = useApi();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState({login: false, google: false});

  const handleLoginPress = useCallback(async () => {
    setLoading(prev => ({...prev, login: true}));
    const success = await login({email, password});
    if (!success) setError(true);
    setLoading(prev => ({...prev, login: false}));
  }, [email, password]);

  const handleSignUpPress = useCallback(() => {
    navigation.navigate('SignUp');
  }, []);

  const handleForgotPasswordPress = useCallback(() => {
    navigation.navigate('ForgotPassword');
  }, []);

  const handleRememberMePress = useCallback(() => {
    setRememberMe(prev => !prev);
  }, []);

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={[a.flex_1, a.bg_(colors.light)]}>
      <ScrollView style={{flexGrow: 1}} contentContainerStyle={[a.h_full]}>
        <View style={[a.flex_1, a.bg_(colors.light)]}>
          <View style={[a.h_(189), a.relative]}>
            {/* <Image
              source={WaterWave}
              style={[a.w_full, a.h_full, a.absolute, a.z_10]}
            /> */}
            <View style={[a.absolute, a.bottom_(0), a.p_(24), a.z_20]}>
              <Text
                family="Bold"
                style={[a.text_2xl, a.leading_snug, a.font_bold]}>
                {t('welcome')}
              </Text>
              <View style={[a.flex_row, a.gap_sm, a.mt_2xs]}>
                <Text
                  style={[a.font_normal, a.text_('16'), a.text_('#000000CC')]}>
                  {t('signupPrompt')}
                </Text>
                <TouchableOpacity onPress={handleSignUpPress} style={[]}>
                  <Text
                    style={[
                      a.text_(colors.beige),
                      a.underline,
                      a.solid,
                      a.decoration_tint_(colors.beige),
                    ]}>
                    {t('signup')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={[a.bg_(colors.light), a.flex_1, a.py_md]}>
            <Column style={[a.w_90, a.self_center]}>
              <TextInput
                label={t('email')}
                labelStyle={[a.text_(colors.darkgray)]}
                containerStyle={[a.mt_2xl]}
                inputStyle={[]}
                value={email}
                onChangeText={text => {
                  setError(false);
                  setEmail(text);
                }}
                textContentType="emailAddress"
                keyboardType="email-address"
                style={[a.px_0, a.py_0, a.mt_sm, a.rounded_full]}
              />

              <TextInput
                label={t('enter_password')}
                labelStyle={[a.text_(colors.darkgray)]}
                containerStyle={[a.mt_2xl]}
                value={password}
                onChangeText={text => {
                  setError(false);
                  setPassword(text);
                }}
                textContentType="password"
                style={[a.px_0, a.py_0, a.mt_sm, a.rounded_full]}
              />

              <TouchableWithoutFeedback onPress={handleRememberMePress}>
                <Row style={[a.align_center, a.mt_xl, a.gap_md]}>
                  <View
                    style={[
                      a.w_(20),
                      a.h_(20),
                      a.rounded_full,
                      a.border_(1),
                      a.border_tint(colors.darkgray),
                      a.p_xs,
                    ]}>
                    <View
                      style={[
                        rememberMe && [
                          a.bg_(colors.darkgray),
                          a.w_full,
                          a.h_full,
                          a.rounded_full,
                        ],
                      ]}
                    />
                  </View>
                  <Text>{t('remember_me')}</Text>
                </Row>
              </TouchableWithoutFeedback>

              {error && (
                <Text
                  style={[
                    a.self_center,
                    a.mt_sm,
                    a.text_(hexWithOpacity(colors.error, 0.5)),
                  ]}>
                  {t('please_enter_correct_details')}
                </Text>
              )}

              <Button
                loading={loading.login}
                onPress={handleLoginPress}
                variant="solid"
                shape="round"
                color="primary"
                style={[a.mt_2xl]}>
                <ButtonText>{t('login')}</ButtonText>
              </Button>

              <Column style={[a.mt_md]}>
                <Button
                  onPress={handleForgotPasswordPress}
                  variant="ghost"
                  shape="round"
                  color="primary">
                  <ButtonText style={[a.text_(colors.beige)]}>
                    {t('forgot_password')}
                  </ButtonText>
                </Button>
              </Column>
            </Column>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

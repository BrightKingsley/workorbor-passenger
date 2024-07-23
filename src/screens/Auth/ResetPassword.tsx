import {Button, Column, Row} from '#/components';
import Separator from '#/components/Separator';
import {Text} from '#/components/Themed';
import {a} from '#/lib/style/atoms';
import {colors} from '#/lib/theme/palette';
import {CommonNavigatorParams, NavigationProps} from '#/navigation/types';
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import * as Location from 'expo-location';
import {useAppDispatch} from '#/hooks/store';
import React from 'react';

import TextInput from '#/components/TextInput';
import Animated, {RollInRight} from 'react-native-reanimated';
import {Ionicons, FontAwesome} from '@expo/vector-icons';
import {ButtonText} from '#/components/Button';
import {TouchableOpacity} from 'react-native-gesture-handler';
import useApi from '#/hooks/useApi';
import {
  validateEmail,
  validatePassword,
  validatePhoneNumber,
  validateRetypePassword,
} from '#/lib/utils/api/forms';

export default function ResetPassword() {
  const dispatch = useAppDispatch();
  const {createNewPassword} = useApi();
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<RouteProp<CommonNavigatorParams>>();

  const [password, setPassword] = useState({value: '', error: ''});
  const [retypePassword, setRetypePassword] = useState({value: '', error: ''});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState({login: false, google: false});

  const handleContinue = useCallback(async () => {
    const passwordValidation = validatePassword(password.value);
    const retypePasswordValidation = validateRetypePassword(
      password.value,
      retypePassword.value,
    );

    setPassword(passwordValidation);
    setRetypePassword(retypePasswordValidation);

    if (passwordValidation.error && retypePasswordValidation.error)
      return Alert.alert('Please enter a a valid email or password ');

    setLoading(prev => ({...prev, login: true}));
    const success = await createNewPassword({
      password: password.value,
      email: route.params?.email ?? '',
    });
    setLoading(prev => ({...prev, login: false}));
    if (!success) return setError(true);
    navigation.navigate('Login');
  }, [password, retypePassword]);

  return (
    <KeyboardAvoidingView behavior="padding" style={[a.flex_1]}>
      <ScrollView
        style={{flexGrow: 1}}
        contentContainerStyle={[a.justify_center, a.h_full]}>
        <View style={[a.flex_1, a.w_85, a.self_center, a.pt_(150)]}>
          <Column style={[[a.mt_(60)]]}>
            <Text family="Bold" style={[a.text_2xl, a.font_semi_bold]}>
              Create new Password
            </Text>

            <Text style={[a.font_('400'), a.mt_md, a.text_(colors.dark)]}>
              Password must contain at least 7 letters and 1 number
            </Text>

            <TextInput
              label="New Password"
              labelStyle={[a.text_(colors.darkgray)]}
              containerStyle={[a.mt_4xl]}
              value={password.value}
              onChangeText={text => {
                setError(false);
                setPassword(prev => ({...prev, value: text}));
              }}
              textContentType="password"
              placeholder="Create Password"
              style={[a.px_0, a.py_0, a.mt_sm]}
            />

            <TextInput
              label="Re-enter Password"
              labelStyle={[a.text_(colors.darkgray)]}
              containerStyle={[a.mt_4xl]}
              value={retypePassword.value}
              onChangeText={text => {
                setError(false);
                setRetypePassword(prev => ({...prev, value: text}));
              }}
              textContentType="password"
              placeholder="Re-enter Password"
              style={[a.px_0, a.py_0, a.mt_sm]}
            />
          </Column>

          {error && (
            <Text style={[a.self_center, a.text_(colors.error_light)]}>
              Please enter a correct email or phoneNumber
            </Text>
          )}

          <Button
            loading={loading.login}
            onPress={handleContinue}
            variant="solid"
            color="primary"
            shape="round"
            style={[a.mt_5xl]}>
            <ButtonText>Continue</ButtonText>
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

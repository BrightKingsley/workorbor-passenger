import {Button, Column, Indicator, Row} from '#/components';
import Separator from '#/components/Separator';
import {Text} from '#/components/Themed';
import {a} from '#/lib/style/atoms';
import {colors} from '#/lib/theme/palette';
import {NavigationProps} from '#/navigation/types';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useCallback, useEffect, useRef, useState} from 'react';
import {
  Alert,
  Animated,
  Image,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';
import * as Location from 'expo-location';
import useLocationService from '#/hooks/useLocationService';
import {useAppDispatch} from '#/hooks/store';
import React from 'react';

import TextInput, {DateInput} from '#/components/TextInput';
import {ButtonText} from '#/components/Button';
import {TouchableOpacity} from 'react-native-gesture-handler';
import useApi from '#/hooks/useApi';
import {
  validateEmail,
  validateName,
  validatePassword,
  validatePhoneNumber,
  validateRetypePassword,
} from '#/lib/utils/api/forms';
import {WaterWave} from '#/assets/images';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import {FormProvider, useFormContext} from './state';

const DATA = [StepOne, StepTwo];

export default function Register() {
  return (
    <FormProvider>
      <RegisterComponent />
    </FormProvider>
  );
}

function RegisterComponent() {
  const scrollRef = useRef<ScrollView>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const navigation = useNavigation<NavigationProps>();

  const {handleSignUpPress, loading, setLoading} = useFormContext();

  const scrollX = useRef(new Animated.Value(0)).current;
  const {width: SCREEN_WIDTH} = useWindowDimensions();

  const handleLoginPress = useCallback(() => {
    navigation.navigate('Login');
  }, []);

  const handleButtonPress = useCallback(() => {
    if (currentPage < DATA.length - 1) {
      const nextPage = currentPage + 1;
      scrollRef?.current?.scrollTo?.({
        x: SCREEN_WIDTH * nextPage,
        animated: true,
      });
      setCurrentPage(nextPage);
    } else {
      //   Alert.alert('You have reached the end of the onboarding steps.');
      handleSignUpPress();
    }
  }, [currentPage, SCREEN_WIDTH]);

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={[a.flex_1, a.bg_(colors.light)]}>
      <Column style={[a.flex_(3)]}>
        <View style={[a.flex_1]}>
          <ScrollView style={[]} showsVerticalScrollIndicator={false}>
            <View style={[a.h_(189), a.relative]}>
              <Image
                source={WaterWave}
                style={[a.w_full, a.h_full, a.absolute, a.z_10]}
              />
              <View style={[a.absolute, a.bottom_(0), a.p_(24), a.z_20]}>
                <Text
                  family="Bold"
                  style={[a.text_2xl, a.leading_snug, a.font_bold]}>
                  Sign Up
                </Text>
                <View style={[a.flex_row, a.gap_sm, a.mt_2xs]}>
                  <Text
                    style={[
                      a.font_normal,
                      a.text_('16'),
                      a.text_('#000000CC'),
                    ]}>
                    Already have an Account?
                  </Text>
                  <TouchableOpacity onPress={handleLoginPress} style={[]}>
                    <Text
                      style={[
                        a.underline,
                        a.solid,
                        a.decoration_tint_(colors.dark),
                      ]}>
                      Login
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={[a.bg_(colors.light), a.flex_1, a.pt_5xl]}>
              <View style={[a.w_(60)]}>
                <Indicator scrollX={scrollX} DATA={DATA} padding={50} />
              </View>
              <ScrollView
                ref={scrollRef}
                testID="welcomeMobileContentSlide"
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                overScrollMode={'never'}
                scrollEventThrottle={16}
                onScroll={Animated.event(
                  [{nativeEvent: {contentOffset: {x: scrollX}}}],
                  {useNativeDriver: false},
                )}
                scrollEnabled={false} // Disable user-initiated scrolling
                style={[a.w_(SCREEN_WIDTH), a.flex_1, a.pt_2xl]}
                contentContainerStyle={[]}>
                {DATA.map((item, index) => {
                  const Item = item;
                  return (
                    <View
                      key={index}
                      style={[
                        a.w_(SCREEN_WIDTH),
                        a.self_center,
                        a.px_md,
                        a.h_full,
                      ]}>
                      <Item />
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          </ScrollView>
          <View style={[a.w_full, a.px_md, a.pb_4xl]}>
            <Button
              loading={loading}
              onPress={handleButtonPress}
              variant="solid"
              color="primary"
              shape="round"
              style={[a.mt_2xl]}>
              <ButtonText>
                {currentPage + 1 === DATA.length ? 'SignUp' : 'Continue'}
              </ButtonText>
            </Button>
          </View>
        </View>
      </Column>
    </KeyboardAvoidingView>
  );
}

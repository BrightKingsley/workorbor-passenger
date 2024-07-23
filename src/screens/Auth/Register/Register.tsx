import {Button, Indicator, Row} from '#/components';
import {Text} from '#/components/Themed';
import {a} from '#/lib/style/atoms';
import {colors} from '#/lib/theme/palette';
import {NavigationProps} from '#/navigation/types';
import {useNavigation} from '@react-navigation/native';
import {useCallback, useEffect, useRef, useState} from 'react';
import {
  Animated,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  View,
  useWindowDimensions,
} from 'react-native';
import React from 'react';

import {ButtonText} from '#/components/Button';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {WaterWave} from '#/assets/images';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import {FormProvider, useFormContext} from './state';
import t from '$/locales/translate';

import {IS_RTL} from '$/locales';

const DATA = [StepOne, StepTwo];

const pages = IS_RTL ? DATA : DATA;

export default function Register() {
  return (
    <FormProvider>
      <RegisterComponent />
    </FormProvider>
  );
}

function RegisterComponent() {
  const {handleSignUpPress, loading} = useFormContext();

  const [currentPage, setCurrentPage] = useState(IS_RTL ? 1 : 0);
  const navigation = useNavigation<NavigationProps>();

  const horizontalScrollRef = useRef<ScrollView>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const {width: SCREEN_WIDTH} = useWindowDimensions();

  const handleLoginPress = useCallback(() => {
    navigation.navigate('Login');
  }, []);

  const handleButtonPress = useCallback(() => {
    if (IS_RTL) {
      if (currentPage > 0) {
        const nextPage = currentPage - 1;
        horizontalScrollRef?.current?.scrollTo?.({
          x: SCREEN_WIDTH * nextPage,
          animated: true,
        });
        setCurrentPage(nextPage);
      } else {
        //   Alert.alert('You have reached the end of the onboarding steps.');
        handleSignUpPress();
      }
    } else {
      if (currentPage < DATA.length - 1) {
        const nextPage = currentPage + 1;
        horizontalScrollRef?.current?.scrollTo?.({
          x: SCREEN_WIDTH * nextPage,
          animated: true,
        });
        setCurrentPage(nextPage);
      } else {
        handleSignUpPress();
      }
    }
  }, [currentPage, SCREEN_WIDTH]);

  useEffect(() => {
    if (!IS_RTL) return;
    console.log('SCROLL-TO_RUNNING');
    if (horizontalScrollRef.current) {
      // Scroll to the initial page position
      horizontalScrollRef.current.scrollTo({
        x: SCREEN_WIDTH * currentPage + 1,
        animated: false,
      });
    }
  }, []);

  return (
    <KeyboardAvoidingView behavior="padding" style={[a.flex_1]}>
      <View style={[a.flex_1]}>
        <ScrollView
          contentContainerStyle={[a.bg_(colors.light)]}
          style={[a.bg_(colors.beigedarker), a.flex_1]}
          showsVerticalScrollIndicator={false}>
          <View style={[a.h_(189), a.relative]}>
            <Image
              source={WaterWave}
              style={[a.w_full, a.h_full, a.absolute, a.z_10]}
            />
            <View
              style={[a.w_full, a.absolute, a.bottom_(0), a.p_(24), a.z_20]}>
              <Text
                family="Bold"
                style={[a.text_2xl, , a.leading_snug, a.font_bold]}>
                {t('signup')}
              </Text>
              <Row style={[a.gap_sm, a.mt_2xs, a.w_full]}>
                <Text
                  style={[a.font_normal, a.text_('16'), a.text_('#000000CC')]}>
                  {t('loginPrompt')}
                </Text>
                <TouchableOpacity onPress={handleLoginPress} style={[]}>
                  <Text
                    style={[
                      a.underline,
                      a.solid,
                      a.decoration_tint_(colors.dark),
                    ]}>
                    {t('login')}
                  </Text>
                </TouchableOpacity>
              </Row>
            </View>
          </View>

          <View
            style={[
              a.bg_(colors.light),
              a.flex_1,
              a.pt_5xl,
              a.pb_(100),
              a.overflow_visible,
            ]}>
            <View style={[a.w_(60)]}>
              <Indicator scrollX={scrollX} DATA={DATA} padding={50} />
            </View>
            <ScrollView
              ref={horizontalScrollRef}
              testID="welcomeMobileContentSlide"
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              scrollEventThrottle={16}
              scrollEnabled={false} // Disable user-initiated scrolling
              onScroll={Animated.event(
                [{nativeEvent: {contentOffset: {x: scrollX}}}],
                {useNativeDriver: false},
              )}
              style={[
                a.w_(SCREEN_WIDTH),
                a.flex_1,
                a.pt_2xl,
                a.flex_row_reverse,
                !IS_RTL && a.flex_row,
                // a.bg_(colors.dark),
                a.pb_5xl,
              ]}
              contentContainerStyle={[a.pb_5xl]}>
              {pages.map((item, index) => {
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
        <View style={[a.w_full, a.px_md, a.pb_4xl, a.bg_(colors.light)]}>
          <Button
            loading={loading}
            onPress={handleButtonPress}
            variant="solid"
            color="primary"
            shape="round"
            style={[a.mt_2xl]}>
            <ButtonText>
              {(IS_RTL ? currentPage : currentPage + 1) ===
              (IS_RTL ? 0 : DATA.length)
                ? t('signup')
                : t('continue')}
            </ButtonText>
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

import {FontAwesome} from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import React, {
  type ComponentProps,
  PropsWithChildren,
  useCallback,
  useMemo,
  useState,
} from 'react';
import {
  Platform,
  Pressable,
  TextInput as DefaultTextInput,
  ViewStyle,
} from 'react-native';

import {CalendarIcon} from '#/assets/icons';
import useLoadedFonts from '#/hooks/useLoadedFonts';
import {a} from '#/lib/style/atoms';
import {colors} from '#/lib/theme/palette';
import {hexWithOpacity} from '#/lib/ui/helpers';

import Column from './Column';
import Row from './Row';
import {getFontFamily, Text, View} from './Themed';

type Props = {
  value?: string | number;
  showLabel?: boolean;
  containerStyle?: ComponentProps<typeof View>['style'];
  inputStyle?: ComponentProps<typeof DefaultTextInput>['style'];
  label?: string;
  labelIcon?: React.ReactNode;
  labelStyle?: ComponentProps<typeof Text>['style'];
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  errorText?: string;
  focusStyle?(focused: boolean, original?: ViewStyle): ViewStyle;
  altComponent?: React.ComponentType<any>; // Optional alternative component. This should be TextInput-like component (casually a BottomSheetTextInput) This would replace the DefaultTextInput if provided
};

export default function TextInput({
  children,
  value,
  style,
  containerStyle,
  inputStyle,
  focusStyle,
  leading,
  trailing,
  label,
  labelIcon,
  labelStyle,
  showLabel = true,
  placeholder,
  errorText,
  altComponent: AltComponent,
  ...textInputProps
}: PropsWithChildren<Props & ComponentProps<typeof DefaultTextInput>>) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordVisibilityToggle = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const focStyle = useMemo<ComponentProps<typeof View>['style']>(
    () => [
      a.bg_(isFocused ? 'transparent' : colors.light),
      a.border_(isFocused ? 2 : 1),
      a.border_tint(colors.beige),
    ],
    [isFocused],
  );

  const {loaded} = useLoadedFonts();

  const InputComponent = AltComponent || DefaultTextInput; // If alt component is not provided, use DefaultTextInput. AltComponent should inherit all props of a regular TextInput

  return (
    <>
      <Column style={containerStyle}>
        {showLabel && label && (
          <Row style={[a.ml_xs]}>
            <Text style={labelStyle}>{label}</Text>
            <View style={[a.w_(5), a.h_(5)]}>{labelIcon}</View>
          </Row>
        )}
        <Row
          style={[
            a.align_center,
            a.p_2xs,
            a.px_sm,
            a.overflow_hidden,
            a.rounded_full,
            focusStyle?.(isFocused, {
              borderColor: colors.beige,
              borderWidth: isFocused ? 2 : 1,
              backgroundColor: isFocused ? 'transparent' : colors.light,
            }) || focStyle,
            style,
          ]}>
          {leading && leading}
          <InputComponent
            style={[
              a.flex_1,
              a.w_full,
              a.px_sm,
              a.text_sm,
              a.text_('gray'),
              a.py_md,
              {fontFamily: loaded ? getFontFamily('Regular') : 'Inter'},
              inputStyle,
            ]}
            keyboardType="default"
            value={value}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder ? placeholder : label ? label : ''}
            placeholderTextColor={'lightgray'}
            cursorColor="black"
            autoCorrect
            secureTextEntry={
              textInputProps.textContentType === 'password' && value
                ? showPassword
                  ? false
                  : true
                : false
            }
            {...textInputProps}
          />
          {textInputProps.textContentType === 'password' ? (
            <View
              style={[
                a.h_(40),
                a.w_(40),
                a.rounded_full,
                a.overflow_hidden,
                a.mx_xs,
              ]}>
              <Pressable
                style={[a.w_full, a.h_full, a.justify_center, a.align_center]}
                android_ripple={{
                  color: hexWithOpacity(colors.darkgray, 0.5),
                }}
                onPress={handlePasswordVisibilityToggle}>
                <FontAwesome name={showPassword ? 'eye' : 'eye-slash'} />
              </Pressable>
            </View>
          ) : (
            trailing && trailing
          )}
        </Row>
        {errorText && (
          <Text style={[a.text_xs, a.text_(colors.error)]}>{errorText}</Text>
        )}
      </Column>
      {children}
    </>
  );
}

export const DateInput = (
  props: Props & ComponentProps<typeof DefaultTextInput>,
) => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const onChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const formatDate = (date: moment.MomentInput) => {
    return moment(date).format('DD.MM.YYYY');
  };

  const showDatePicker = () => {
    setShow(true);
  };

  const hideDatePicker = () => {
    setShow(false);
  };

  return (
    <>
      <TextInput
        value={formatDate(date).toString() ?? ''}
        // font: 400
        containerStyle={[a.z_50, a.overflow_hidden]}
        style={[a.relative, a.z_50]}
        inputStyle={[a.relative, a.z_50]}
        trailing={
          <View style={[a.align_center, a.justify_center, a.w_(40)]}>
            <CalendarIcon />
          </View>
        }
        {...props}
        onBlur={hideDatePicker}
        onFocus={showDatePicker}>
        {show &&
          (Platform.OS === 'ios' ? (
            <View
              style={[
                a.top_(10),
                a.bg_(colors.light),
                a.z_50,
                // a.absolute,
                // a.top_(120),
              ]}>
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode="date"
                display="spinner"
                onChange={onChange}
                textColor="black"
                style={[a.z_50]}
              />
            </View>
          ) : (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode="date"
              display="spinner"
              onChange={onChange}
              textColor="black"
              style={{
                width: 320,
                height: 260,
              }}
            />
          ))}
      </TextInput>
    </>
  );
};

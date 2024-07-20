import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
} from 'react-native';
import React, {
  ComponentProps,
  memo,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {Feather} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {FlatList} from 'react-native';
import {useTheme} from '#/lib/ui/theme';
import {NavigationProps} from '#/navigation/types';
import {a} from '#/lib/style/atoms';
import {colors} from '#/lib/theme/palette';
import {hexWithOpacity} from '#/lib/ui/helpers';

const {width} = Dimensions.get('window');

export default function DialPad({
  pinLength = 4,
  getValue,
  handleCompleteOtp,
}: {
  pinLength: number;
  getValue(value: string | number): void;
  handleCompleteOtp?(value: string): void;
}) {
  const navigation = useNavigation<NavigationProps>();
  const [code, setCode] = useState<(string | number)[]>([]);
  const t = useTheme();

  useEffect(() => {
    getValue?.(code.join(''));
  }, [code, getValue]);

  const dialPadContent: (number | string)[] = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    '',
    0,
    'X',
  ];

  const dialPadSize = width * 0.2;
  const dialPadTextSize = dialPadSize * 0.4;

  return (
    <SafeAreaView style={[]}>
      <View style={styles.textContainer}>
        <View style={[a.flex_row]}>
          <View>
            <FlatList
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              data={Array(pinLength).fill(0)}
              ItemSeparatorComponent={memo(ItemSeparator)}
              renderItem={({index}) => (
                <View
                  key={index}
                  style={[
                    a.w_(40),
                    a.h_(40),
                    a.rounded_sm,
                    a.bg_(colors.beige),
                    // a.border_(2),
                    // a.border_tint(colors.dark_2),
                    a.align_center,
                    a.justify_center,
                  ]}>
                  <Text style={[a.text_(colors.light), a.font_semi_bold]}>
                    {code[index]}
                  </Text>
                </View>
              )}
            />
          </View>
        </View>
        <DialpadKeypad
          navigation={navigation}
          dialPadContent={dialPadContent}
          pinLength={pinLength}
          setCode={setCode}
          code={code}
          dialPadSize={dialPadSize}
          dialPadTextSize={dialPadTextSize}
          handleCompleteOtp={handleCompleteOtp}
        />
      </View>
    </SafeAreaView>
  );
}
function ItemSeparator() {
  return <View style={[a.h_full, a.w_(3)]} />;
}

interface DialpadKeypadProps {
  dialPadContent: (string | number)[];
  pinLength: number;
  code: (string | number)[];
  setCode: React.Dispatch<React.SetStateAction<(string | number)[]>>;
  navigation: NavigationProps;
  dialPadSize: number;
  dialPadTextSize: number;
  handleCompleteOtp: ComponentProps<typeof DialPad>['handleCompleteOtp'];
}

function DialpadKeypad({
  dialPadContent,
  pinLength,
  code,
  setCode,
  navigation,
  dialPadSize,
  dialPadTextSize,
  handleCompleteOtp,
}: DialpadKeypadProps) {
  const t = useTheme();

  const handleOtpInput = useCallback(
    (item: number | string) => {
      if (item === 'X') {
        setCode(prev => prev.slice(0, -1));
      } else {
        setCode(prev => [...prev, item]);
        if (code.length >= pinLength - 1) {
          handleCompleteOtp?.(code.join(''));
        }
      }
    },
    [code],
  );

  return (
    <FlatList
      style={[a.mt_5xl]}
      data={dialPadContent}
      numColumns={3} // set number of columns
      keyExtractor={(_, index) => index.toString()}
      renderItem={({item}) => {
        return (
          <View
            style={[
              a.rounded_full,
              a.overflow_hidden,
              a.w_(dialPadSize),
              a.h_(dialPadSize),
              // a.m_md,
            ]}>
            <Pressable
              android_ripple={{
                color: hexWithOpacity(colors.beige, 0.6),
              }}
              disabled={
                item !== 'X' && (item === '' || code.length >= pinLength)
              } // make the empty space on the dialpad content un-clickable
              style={({pressed}) => [
                a.w_(dialPadSize),
                a.h_(dialPadSize),
                a.rounded_full,
                a.overflow_hidden,
                item === '' ? [] : a.bg_(colors.light),
                a.justify_center,
                a.align_center,
                a.w_full,
                a.h_full,
                a.border_(2),
                a.border_tint(
                  item !== ''
                    ? pressed
                      ? colors.beige
                      : colors.beige
                    : 'transparent',
                ),
              ]}
              onPress={() => handleOtpInput(item)}>
              {item === 'X' ? (
                <Feather name="delete" size={24} color={colors.darkgray} />
              ) : (
                <Text
                  style={[
                    {fontSize: dialPadTextSize},
                    a.text_(colors.darkgray),
                  ]}>
                  {item}
                </Text>
              )}
            </Pressable>
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    position: 'relative',
  },
});

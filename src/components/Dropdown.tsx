import React, {useState} from 'react';
import {FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import {a} from '#/lib/style/atoms';
import {colors} from '#/lib/theme/palette';
import t from '$/locales/translate';

import Row from './Row';
import {Text} from './Themed';

interface DropdownItem {
  label: string;
  value: string;
}

interface DropdownProps {
  items: DropdownItem[];
  onSelect: (item: DropdownItem) => void;
}

const Dropdown: React.FC<DropdownProps> = ({items, onSelect}) => {
  const [isOpen, setIsOpen] = useState(false);
  const animation = useSharedValue(0);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    animation.value = withTiming(isOpen ? 0 : items.length * 50, {
      duration: 300,
      easing: Easing.inOut(Easing.ease),
    });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: animation.value,
    };
  });

  return (
    <Animated.View
      style={[a.mx_lg, a.self_center, a.w_full, a.z_50, a.relative, a.mt_md]}>
      <Row style={[a.ml_xs]}>
        <Text style={{}}>{t('select_gender')}</Text>
      </Row>
      <TouchableOpacity
        style={[
          a.p_(15),
          a.border_tint(colors.beige),
          a.border,
          a.rounded_full,
          a.w_full,
          a.z_50,
        ]}
        onPress={toggleDropdown}>
        <Text style={[a.text_(colors.darkgray)]}>{t('select_an_item')}</Text>
      </TouchableOpacity>
      <Animated.View
        style={[
          styles.dropdown,
          a.bg_(colors.beige),
          animatedStyle,
          a.absolute,
          a.w_full,
          a.z_50,
          a.top_('100%'),
        ]}>
        <FlatList
          data={items}
          keyExtractor={item => item.value}
          renderItem={({item}) => (
            <TouchableOpacity
              style={[
                a.p_(15),
                isOpen && [(a.border_b_(1), a.border_tint(colors.beige))],
              ]}
              onPress={() => {
                onSelect(item);
                toggleDropdown();
              }}>
              <Text>{item.label}</Text>
            </TouchableOpacity>
          )}
        />
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    overflow: 'hidden',
    backgroundColor: 'white',
    borderRadius: 8,
    marginTop: 8,
  },
});

export default Dropdown;

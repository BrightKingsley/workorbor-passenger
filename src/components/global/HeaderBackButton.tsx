import {FontAwesome} from '@expo/vector-icons';
import type {HeaderBackButtonProps} from '@react-navigation/native-stack/src/types';
import {useRouter} from 'expo-router';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {HITSLOP_30} from '$/src/lib/constants';
import {a} from '$/src/lib/style/atoms';

export default function HeaderBackButton({canGoBack}: HeaderBackButtonProps) {
  const router = useRouter();

  return (
    <TouchableOpacity
      testID="viewHeaderDrawerBtn"
      onPress={() => (canGoBack ? router.back() : null)}
      hitSlop={HITSLOP_30}
      style={[a.align_center, a.justify_center, a.rounded_full]}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel="Back"
      accessibilityHint={'Access navigation links and settings'}>
      <FontAwesome name="angle-left" size={30} />
    </TouchableOpacity>
  );
}

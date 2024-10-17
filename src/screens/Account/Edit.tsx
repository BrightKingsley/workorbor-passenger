import {useUser} from '@clerk/clerk-expo';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  BottomSheetScrollView,
  BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import React, {useState} from 'react';
import {Image, ImageStyle} from 'react-native';

import {FormField} from '$/src/components/feature/Auth/SignUp/state';
import {Button} from '$/src/components/global';
import TextInput from '$/src/components/global/TextInput';
import {Container} from '$/src/components/utils';
import {a} from '$/src/lib/style/atoms';
import {colors} from '$/src/lib/theme/palette';
import {hexWithOpacity} from '$/src/lib/ui/helpers';

type Fields = 'firstName' | 'lastName' | 'phoneNumber';

export const snapPoints = ['50%', '90%'];
export const enablePanDownToClose = false;

export default function Edit() {
  const {user} = useUser();

  const [formData, setFormData] = useState<{[key in Fields]: FormField}>({
    phoneNumber: {value: '', error: ''},
    firstName: {error: '', value: ''},
    lastName: {error: '', value: ''},
  });

  return (
    <BottomSheetScrollView showsVerticalScrollIndicator={false}>
      <Container style={[a.py_3xl]}>
        <Button
          variant="ghost"
          style={[a.self_center, a.rounded_md, a.py_0, a.bg_(colors.primary)]}>
          <>
            {user?.imageUrl ? (
              <Image
                source={{uri: user.imageUrl}}
                style={[a.w_(100), a.h_(100)] as ImageStyle}
              />
            ) : (
              <Ionicons
                name="image-outline"
                size={60}
                style={[
                  a.absolute,
                  a.z_40,
                  a.bg_(colors.light),
                  a.bottom_(0),
                  a.right_0,
                ]}
              />
            )}
          </>
        </Button>
        <TextInput
          altComponent={BottomSheetTextInput}
          containerStyle={[
            a.mt_md,
            a.bg_(hexWithOpacity(colors.lightgrey, 0.3)),
            a.rounded_full,
          ]}
          placeholder="first name"
          value={formData.firstName.value}
          focusStyle={isFocused => ({
            borderColor: isFocused ? colors.primary : 'transparent',
            borderWidth: isFocused ? 2 : 1,
            backgroundColor: 'transparent',
          })}
          onChangeText={text =>
            setFormData(prev => ({
              ...prev,
              firstName: {...prev.firstName, value: text},
            }))
          }
        />
        <TextInput
          altComponent={BottomSheetTextInput}
          containerStyle={[
            a.mt_md,
            a.bg_(hexWithOpacity(colors.lightgrey, 0.3)),
            a.rounded_full,
          ]}
          placeholder="last name"
          value={formData.lastName.value}
          focusStyle={isFocused => ({
            borderColor: isFocused ? colors.primary : 'transparent',
            borderWidth: isFocused ? 2 : 1,
            backgroundColor: 'transparent',
          })}
          onChangeText={text =>
            setFormData(prev => ({
              ...prev,
              lastName: {...prev.lastName, value: text},
            }))
          }
        />
        <TextInput
          altComponent={BottomSheetTextInput}
          containerStyle={[
            a.mt_md,
            a.bg_(hexWithOpacity(colors.lightgrey, 0.3)),
            a.rounded_full,
          ]}
          placeholder="phone number"
          value={formData['phoneNumber'].value}
          focusStyle={isFocused => ({
            borderColor: isFocused ? colors.primary : 'transparent',
            borderWidth: isFocused ? 2 : 1,
            backgroundColor: 'transparent',
          })}
          onChangeText={text =>
            setFormData(prev => ({
              ...prev,
              phoneNumber: {...prev.phoneNumber, value: text},
            }))
          }
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
        />
      </Container>
    </BottomSheetScrollView>
  );
}

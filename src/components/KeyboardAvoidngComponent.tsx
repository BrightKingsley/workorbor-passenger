import React, {PropsWithChildren} from 'react';
import {KeyboardAvoidingView, Platform, ScrollView} from 'react-native';

import {a} from '#/lib/style/atoms';

const KeyboardAvoidingComponent = ({children}: PropsWithChildren) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[a.flex_1]}>
      <ScrollView contentContainerStyle={[a.flex_grow]}>{children}</ScrollView>
    </KeyboardAvoidingView>
  );
};

export default KeyboardAvoidingComponent;

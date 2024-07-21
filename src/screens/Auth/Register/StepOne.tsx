import TextInput from '#/components/TextInput';
import {a} from '#/lib/style/atoms';
import {colors} from '#/lib/theme/palette';
import t from '$/locales/translate';

import {useFormContext} from './state';

export default function StepOne() {
  const {
    firstname,
    setFirstname,
    email,
    lastname,
    setEmail,
    setLastname,
    password,
    passwordCorrect,
    retypePassword,
    setPassword,
    setRetypePassword,
  } = useFormContext();

  return (
    <>
      <TextInput
        value={firstname.value}
        errorText={firstname.error}
        onChangeText={text => setFirstname({value: text, error: ''})}
        label={t('firstname')}
        labelStyle={[a.text_(colors.darkgray)]}
        containerStyle={[]}
        textContentType="name"
        placeholder="Bright"
        style={[a.px_0, a.py_0, a.mt_sm]}
      />

      <TextInput
        value={lastname.value}
        errorText={lastname.error}
        onChangeText={text => setLastname({value: text, error: ''})}
        label={t('lastname')}
        labelStyle={[a.text_(colors.darkgray)]}
        containerStyle={[a.mt_2xl]}
        placeholder="Kingsley"
        textContentType="familyName"
        style={[a.px_0, a.py_0, a.mt_sm]}
      />
      <TextInput
        value={email.value}
        errorText={email.error}
        onChangeText={text => setEmail({value: text, error: ''})}
        label={t('email')}
        labelStyle={[a.text_(colors.darkgray)]}
        containerStyle={[a.mt_2xl]}
        placeholder="briggskvngzz@gmail.com"
        keyboardType="email-address"
        textContentType="emailAddress"
        style={[a.px_0, a.py_0, a.mt_sm]}
      />
      <TextInput
        value={password.value}
        errorText={password.error}
        onChangeText={text => setPassword({value: text, error: ''})}
        label={t('password')}
        labelStyle={[a.text_(colors.darkgray)]}
        containerStyle={[a.mt_2xl]}
        placeholder={'******'}
        textContentType="password"
        style={[a.px_0, a.py_0, a.mt_sm]}
      />
      <TextInput
        value={retypePassword.value}
        errorText={retypePassword.error}
        onChangeText={text => setRetypePassword({value: text, error: ''})}
        label={t('password_confirmation')}
        labelStyle={[a.text_(colors.darkgray)]}
        containerStyle={[a.mt_2xl]}
        placeholder={'******'}
        textContentType="password"
        style={[
          a.px_0,
          a.py_0,
          a.mt_sm,
          passwordCorrect && a.border_tint('lightgreen'),
        ]}
        inputStyle={[passwordCorrect && a.text_('lightgreen')]}
      />
    </>
  );
}

import Dropdown from '#/components/Dropdown';
import TextInput, {DateInput} from '#/components/TextInput';
import {a} from '#/lib/style/atoms';
import {colors} from '#/lib/theme/palette';
import t from '$/locales/translate';

import {useFormContext} from './state';

export default function StepTwo() {
  const {
    phoneNumber,
    setPhoneNumber,
    referee,
    gender,
    setReferee,
    setGender,
    setDateOfBirth,
    setAnniversary,
  } = useFormContext();

  return (
    <>
      <TextInput
        value={phoneNumber.value}
        errorText={phoneNumber.error}
        onChangeText={text => {
          setPhoneNumber({value: text, error: ''});
        }}
        label={t('phone_number')}
        labelStyle={[a.text_(colors.darkgray)]}
        containerStyle={[]}
        textContentType="telephoneNumber"
        keyboardType="number-pad"
        placeholder="+972-52-345-6789"
        style={[a.px_0, a.py_0, a.mt_sm]}
      />

      <DateInput
        getDate={date => setDateOfBirth({value: date.toString(), error: ''})}
        label={t('date_of_birth')}
        containerStyle={[a.mt_2xl]}
        style={[a.px_0, a.py_0, a.mt_sm]}
      />

      <DateInput
        getDate={date => setAnniversary({value: date.toString(), error: ''})}
        label={t('anniversary_day')}
        containerStyle={[a.mt_2xl]}
        style={[a.px_0, a.py_0, a.mt_sm]}
      />

      <Dropdown
        selected={gender.value}
        items={[
          {label: 'M', value: 'M'},
          {label: 'F', value: 'F'},
          {label: 'Other', value: 'other'},
        ]}
        onSelect={value => setGender({value, error: ''})}
      />

      <TextInput
        value={referee.value}
        errorText={referee.error}
        onChangeText={text => setReferee({value: text, error: ''})}
        label={t('refer_by')}
        labelStyle={[a.text_(colors.darkgray)]}
        containerStyle={[a.mt_2xl]}
        placeholder="briggskvngzz@gmail.com"
        keyboardType="email-address"
        textContentType="emailAddress"
        style={[a.px_0, a.py_0, a.mt_sm]}
      />
    </>
  );
}

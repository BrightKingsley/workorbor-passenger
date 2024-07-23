import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react';
import {Alert} from 'react-native';

import useApi from '#/hooks/useApi';
import {
  validateEmail,
  validateName,
  validatePassword,
  validatePhoneNumber,
  validateRetypePassword,
} from '#/lib/utils/api/forms';

type Gender = 'M' | 'F';

export type FormField = {value: string | Gender; error: string};

interface FormContextProps {
  firstname: FormField;
  referee: FormField;
  gender: FormField;
  setReferee: React.Dispatch<React.SetStateAction<FormField>>;
  setGender: React.Dispatch<React.SetStateAction<FormField>>;
  setFirstname: React.Dispatch<React.SetStateAction<FormField>>;
  lastname: FormField;
  setLastname: React.Dispatch<React.SetStateAction<FormField>>;
  email: FormField;
  setEmail: React.Dispatch<React.SetStateAction<FormField>>;
  phoneNumber: FormField;
  dateOfBirth: FormField;
  setDateOfBirth: React.Dispatch<React.SetStateAction<FormField>>;
  anniversary: FormField;
  setPhoneNumber: React.Dispatch<React.SetStateAction<FormField>>;
  setAnniversary: React.Dispatch<React.SetStateAction<FormField>>;
  password: FormField;
  setPassword: React.Dispatch<React.SetStateAction<FormField>>;
  retypePassword: FormField;
  setRetypePassword: React.Dispatch<React.SetStateAction<FormField>>;
  passwordCorrect: boolean;
  handleSignUpPress: () => void;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const FormContext = createContext<FormContextProps | undefined>(undefined);

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};

export const FormProvider = ({children}: {children: ReactNode}) => {
  const {signup} = useApi();

  const [firstname, setFirstname] = useState<FormField>({
    value: 'Bright',
    error: '',
  });
  const [lastname, setLastname] = useState<FormField>({
    value: 'Kingsley',
    error: '',
  });
  const [referee, setReferee] = useState<FormField>({
    value: 'Kingsley',
    error: '',
  });
  const [gender, setGender] = useState<FormField>({
    value: 'Kingsley',
    error: '',
  });
  const [email, setEmail] = useState<FormField>({
    value: 'briggskvngzz@gmail.com',
    error: '',
  });
  const [dateOfBirth, setDateOfBirth] = useState<FormField>({
    value: new Date().toString(),
    error: '',
  });
  const [anniversary, setAnniversary] = useState<FormField>({
    value: new Date().toString(),
    error: '',
  });
  const [phoneNumber, setPhoneNumber] = useState<FormField>({
    value: '08021248576',
    error: '',
  });
  const [password, setPassword] = useState<FormField>({
    value: '@Test1234',
    error: '',
  });
  const [retypePassword, setRetypePassword] = useState<FormField>({
    value: '@Test1234',
    error: '',
  });
  const [loading, setLoading] = useState<boolean>(false);

  const passwordCorrect =
    retypePassword.value !== '' && retypePassword.value === password.value;

  const handleSignUpPress = useCallback(async () => {
    const firstNameValidation = validateName(firstname.value);
    const lastNameValidation = validateName(lastname.value);
    const emailValidation = validateEmail(email.value);
    const passwordValidation = validatePassword(password.value);
    const phoneNumberValidation = validatePhoneNumber(phoneNumber.value);
    const retypePasswordValidation = validateRetypePassword(
      password.value,
      retypePassword.value,
    );

    setFirstname(firstNameValidation);
    setLastname(lastNameValidation);
    setEmail(emailValidation);
    setPassword(passwordValidation);
    setRetypePassword(retypePasswordValidation);
    setPhoneNumber(phoneNumberValidation);
    setPhoneNumber(phoneNumberValidation);
    setPhoneNumber(phoneNumberValidation);
    setPhoneNumber(phoneNumberValidation);

    if (
      firstNameValidation.error ||
      lastNameValidation.error ||
      emailValidation.error ||
      passwordValidation.error ||
      retypePasswordValidation.error ||
      phoneNumberValidation.error
    )
      return Alert.alert('Please enter valid credentials');
    setLoading(true);
    await signup({
      email: email.value,
      password: password.value,
      firstname: firstname.value,
      lastname: lastname.value,
      phoneNumber: phoneNumber.value,
      anniversary: anniversary.value,
      dateOfBirth: dateOfBirth.value,
      gender: gender.value,
      referee: referee.value,
    });
    setLoading(false);
  }, [
    email.value,
    firstname.value,
    lastname.value,
    password.value,
    phoneNumber.value,
    anniversary.value,
    dateOfBirth.value,
    retypePassword.value,
    setFirstname,
    setLastname,
    setEmail,
    setPassword,
    setRetypePassword,
    setPhoneNumber,
    setAnniversary,
    setDateOfBirth,
    signup,
  ]);

  return (
    <FormContext.Provider
      value={{
        referee,
        setReferee,
        setGender,
        gender,
        firstname,
        setFirstname,
        lastname,
        setLastname,
        email,
        setEmail,
        phoneNumber,
        setPhoneNumber,
        password,
        setPassword,
        retypePassword,
        setRetypePassword,
        passwordCorrect,
        anniversary,
        dateOfBirth,
        setAnniversary,
        setDateOfBirth,
        handleSignUpPress,
        loading,
        setLoading,
      }}>
      {children}
    </FormContext.Provider>
  );
};

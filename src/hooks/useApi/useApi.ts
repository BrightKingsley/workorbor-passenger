import useAuthApi from './auth';

export default function useApi() {
  const {createNewPassword, forgotPassword, login, signup, verifyResetOtp} =
    useAuthApi();

  return {
    login,
    signup,
    forgotPassword,
    verifyResetOtp,
    createNewPassword,
  };
}

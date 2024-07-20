import {useEffect} from 'react';

import {View} from '#/components/Themed';
import {LoginScreen, RegisterScreen} from '#/screens';

import {a} from '../style/atoms';
import {usePalette} from '../theme/usePalette';
import Layout from './Layout';
import {Splash} from './Splash';

enum ScreenState {
  S_AppOverview,
  S_LoginOrCreateAccount,
  S_Login,
  S_CreateAccount,
  S_SelectAccount,
  S_PIN,
}

export function LoggedOut({onDismiss}: {onDismiss?: () => void}) {
  const pal = usePalette('default');
  // const hasSession = useSession();
  // const setMinimalShellMode = useSetMinimalShellMode();
  // const {clearRequestedAccount} = useLoggedOutViewControls();
  // const [screenState, setScreenState] = React.useState<ScreenState>(
  //   requestedAccountSwitchTo
  //     ? requestedAccountSwitchTo === 'new'
  //       ? ScreenState.S_CreateAccount
  //       : ScreenState.S_Login
  //     : ScreenState.S_LoginOrCreateAccount,
  // );
  // const isFirstScreen = screenState === ScreenState.S_LoginOrCreateAccount;
  // const skip = store.onboarding.skip();
  // useEffect(() => {
  //   setMinimalShellMode(true);
  // }, [setMinimalShellMode]);

  return (
    <Layout>
      <View testID="noSessionView" style={[pal.view, a.h_full]}>
        <>
          {/* {screenState === ScreenState.S_LoginOrCreateAccount ? (
            <Splash
              skip={() => {}}
              onPressCreateAccount={() =>
                setScreenState(ScreenState.S_CreateAccount)
                }
              onPressSignIn={() => setScreenState(ScreenState.S_Login)}
              />
            ) : undefined} */}
          <LoginScreen
          // back={() => setScreenState(ScreenState.S_LoginOrCreateAccount)}
          />
          {/* {screenState === ScreenState.S_Login ? ( */}
          {/* ) : undefined} */}
          {/* {screenState === ScreenState.S_CreateAccount ? ( */}
          {/* <RegisterScreen
            // onPressBack={() =>
            //   setScreenState(ScreenState.S_LoginOrCreateAccount)
            // }
            /> */}
          {/* ) : undefined} */}
        </>
      </View>
    </Layout>
  );
}

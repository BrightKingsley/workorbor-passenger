import {ModalContainer} from '$/src/components/global/modals/Modal';
import {ModalProvider} from '$/src/components/global/modals/ModalState';
import {FadeScreenWrapper} from '$/src/components/utils';
import {AccountScreen} from '$/src/screens/Account';

export default function Account() {
  return (
    <ModalProvider>
      <FadeScreenWrapper>
        <AccountScreen account={'baconbrix'} />
      </FadeScreenWrapper>
      <ModalContainer />
    </ModalProvider>
  );
}

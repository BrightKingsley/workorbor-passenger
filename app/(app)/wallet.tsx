import Wallet from '$/src/components/feature/Wallet/Wallet';
import {ModalContainer} from '$/src/components/global/modals/Modal';
import {ModalProvider} from '$/src/components/global/modals/ModalState';

export default function WalletScreen() {
  return (
    <ModalProvider>
      <Wallet />
      <ModalContainer />
    </ModalProvider>
  );
}

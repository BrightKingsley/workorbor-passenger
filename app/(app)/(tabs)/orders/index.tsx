import {ModalContainer} from '$/src/components/global/modals/Modal';
import {ModalProvider} from '$/src/components/global/modals/ModalState';
import {FadeScreenWrapper} from '$/src/components/utils';
import Orders from '$/src/screens/Orders';

export default function OrdersScreen() {
  return (
    <ModalProvider>
      {/* <FadeScreenWrapper duration={10}> */}
      <Orders />
      {/* </FadeScreenWrapper> */}
      <ModalContainer />
    </ModalProvider>
  );
}

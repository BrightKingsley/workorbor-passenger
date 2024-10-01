import {BottomSheetProps} from '@gorhom/bottom-sheet';
import {BottomSheetMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import React, {useEffect} from 'react';

import {useNonReactiveCallback} from '$/src/hooks/useNonReactiveCallbacks';
import {moveStringToEnd} from '$/src/lib/utils/helpers/arrays';

import modalContent from './ModalContent';

export interface AddAppPasswordModal {
  name: 'app-password';
}
export interface DeleteAccountModal {
  name: 'delete-account';
}
export interface ChangePasswordModal {
  name: 'change-password';
}
export interface ChangePasswordModal {
  name: 'change-password';
}
export interface ChangeHandleModal {
  name: 'change-handle';
}
export interface VerifyEmailModal {
  name: 'verify-email';
  showReminder?: boolean;
  onSuccess?: () => void;
}
export interface ChangeEmailModal {
  name: 'change-email';
}
export interface SendModal {
  name: 'send';
}
export interface ConfirmationModal {
  name: 'confirmation';
}
export interface CheckoutConfirmationModal {
  name: 'checkout-confirmation-modal';
  title: string;
  data: {pay: number | any; get: number | any};
  confirmationAction?(): void;
}
export interface TransferConfirmationModal {
  name: 'confirm-transfer';
  type: 'wallet-to-wallet' | 'bank-to-wallet' | 'wallet-to-bank';
}
export interface RequestPayModal {
  name: 'request-pay-modal';
}
export interface UpdateWalletModal {
  name: 'update-wallet';
}
export interface CreateWalletModal {
  name: 'create-wallet';
}
export interface DepositModal {
  name: 'deposit';
  title: string;
}
export interface ManageCardModal {
  name: 'manage-cards';
}

// export type Modal =
//   // Account
//   | AddAppPasswordModal
//   | DeleteAccountModal
//   | ChangePasswordModal
//   | ChangeHandleModal
//   | VerifyEmailModal
//   | ChangeEmailModal

//   // Send
//   | SendModal
//   | ConfirmationModal
//   | CheckoutConfirmationModal
//   | RequestPayModal
//   | TransferConfirmationModal

//   // Wallet
//   | UpdateWalletModal
//   | CreateWalletModal
//   // Deposit
//   | DepositModal

//   // Cards
//   | ManageCardModal;

export type Modal = keyof typeof modalContent;

const ModalContext = React.createContext<{
  isModalActive: boolean;
  activeModals: Modal[];
}>({
  isModalActive: false,
  activeModals: [],
});

const ModalControlContext = React.createContext<{
  openModal: (modal: Modal, props: Partial<BottomSheetProps>) => void;
  closeModal: () => boolean;
  closeAllModals: () => void;
  setupModal: (modalRef: React.RefObject<BottomSheetMethods>) => void;
  modalProps: Partial<BottomSheetProps>;
}>({
  openModal: () => {},
  closeModal: () => false,
  closeAllModals: () => {},
  setupModal: () => {},
  modalProps: {children: <></>},
});
/**
 * @deprecated DO NOT USE THIS unless you have no other choice.
 */
export let unstable_openModal: (
  modal: Modal,
  props: BottomSheetProps,
) => void = () => {
  throw new Error('ModalContext is not initialized');
};
/**
 * @deprecated DO NOT USE THIS unless you have no other choice.
 */
export let unstable_closeModal: () => boolean = () => {
  throw new Error('ModalContext is not initialized');
};

export function ModalProvider({children}: React.PropsWithChildren<{}>) {
  const [activeModals, setActiveModals] = React.useState<Modal[]>([]);
  const [modalProps, setModalProps] = React.useState<Partial<BottomSheetProps>>(
    {
      children: <></>,
    },
  );
  const [modalRef, setModalRef] =
    React.useState<React.RefObject<BottomSheetMethods> | null>(null);

  const setupModal = useNonReactiveCallback((ref: typeof modalRef) => {
    setModalRef(ref);
  });

  const openModal = useNonReactiveCallback(
    (modal: Modal, props: Partial<BottomSheetProps>) => {
      setActiveModals(modals => {
        const sortedModals = moveStringToEnd<Modal>([...modals, modal], modal);
        console.log({
          modals,
          modal,
          sortedModals,
          unSorted: [...modals, modal],
        });
        // return [...modals, modal];
        return sortedModals;
      });

      setModalProps(props);
    },
  );

  // const closeModal = useNonReactiveCallback(() => {
  //   let wasActive = activeModals.length > 0;
  //   setActiveModals(modals => {
  //     return modals.slice(0, -1);
  //   });
  //   return wasActive;
  // });
  const closeModal = useNonReactiveCallback(() => {
    modalRef?.current?.close();
    let wasActive = true;
    setTimeout(() => {
      console.log('RESOLVING!');
      let active = activeModals.length > 0;
      setActiveModals(modals => {
        return modals.slice(0, -1);
      });
      wasActive = active;
    }, 200);

    return wasActive;
  });

  const closeAllModals = useNonReactiveCallback(() => {
    setActiveModals([]);
  });

  unstable_openModal = openModal;
  unstable_closeModal = closeModal;

  const state = React.useMemo(
    () => ({
      isModalActive: activeModals.length > 0,
      activeModals,
    }),
    [activeModals],
  );

  const methods = React.useMemo(
    () => ({
      openModal,
      closeModal,
      closeAllModals,
      setupModal,
    }),
    [openModal, closeModal, closeAllModals, setupModal],
  );

  useEffect(() => {
    console.log({activeModals});
  }, [activeModals, activeModals.length]);

  return (
    <ModalContext.Provider value={state}>
      <ModalControlContext.Provider value={{...methods, modalProps}}>
        {children}
      </ModalControlContext.Provider>
    </ModalContext.Provider>
  );
}

export function useModals() {
  return React.useContext(ModalContext);
}
export function useModalControls() {
  return React.useContext(ModalControlContext);
}

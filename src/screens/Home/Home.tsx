import {useFocusEffect} from 'expo-router';
import {useCallback} from 'react';

import Map from '$/src/components/feature/Map';
import {useModalControls} from '$/src/components/global/modals/ModalState';
import {Button} from '$/src/components/global';
import {ButtonText} from '$/src/components/global/Button';
import {a} from '$/src/lib/style/atoms';
import useApi from '$/src/hooks/api/useApi';

export default function Home() {
  const {openModal} = useModalControls();
  const {createOrder} = useApi().order;

  const toggleModal = () => {
    openModal('where-to', {});
  };

  useFocusEffect(
    useCallback(() => {
      console.log('Open where-to');
      toggleModal();
    }, []),
  );

  return (
    <>
      <Map />
      <Button
        style={[a.absolute, a.p_2xl, a.bottom_(20), a.left_(10)]}
        variant="solid"
        shape="round"
        onPress={toggleModal}>
        <ButtonText>Open</ButtonText>
      </Button>
    </>
  );
}

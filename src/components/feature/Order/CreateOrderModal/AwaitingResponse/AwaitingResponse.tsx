import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {Fragment} from 'react';

import {a} from '#/lib/style/atoms';
import {Button, Separator} from '$/src/components/global';
import {ButtonText} from '$/src/components/global/Button';
import {createCustomBackdrop} from '$/src/components/global/modals/ModalBackdrop';
import {useModalControls} from '$/src/components/global/modals/ModalState';
import {View} from '$/src/components/global/Themed';
import ViewHeader from '$/src/components/global/ViewHeader';
import {Container} from '$/src/components/utils';

import ResponseTile from './ResponseTile';

export const snapPoints = ['35%'];
export const backdropComponent = createCustomBackdrop();
export const enablePanDownToClose = false;

export default function AwaitingResponse() {
  const {closeModal} = useModalControls();
  return (
    <>
      <Container style={[]}>
        <ViewHeader
          canGoBack={true}
          backPressHandler={closeModal}
          title="Awaiting Ride"
        />
      </Container>
      <BottomSheetScrollView
        showsVerticalScrollIndicator={false}
        style={[a.mt_2xl]}
        contentContainerStyle={[a.p_xs]}>
        {Array.from({length: 1}, () => null).map((_, i) => (
          <Fragment key={i}>
            <ResponseTile />
            <Separator height={30} />
          </Fragment>
        ))}
      </BottomSheetScrollView>
      <View style={[a.my_lg]}>
        <Button label={'confirm'} color="error" variant="outline" shape="round">
          <ButtonText>back</ButtonText>
        </Button>
      </View>
    </>
  );
}

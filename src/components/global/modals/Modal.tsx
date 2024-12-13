import BottomSheet from '@gorhom/bottom-sheet';
import Constants from 'expo-constants';
import {memo, useCallback, useEffect, useMemo, useRef} from 'react';
import React from 'react';
import {Platform, StyleSheet} from 'react-native';

import {a} from '$/src/lib/style/atoms';
import {colors} from '$/src/lib/theme/palette';
import {Haptics} from '$/src/lib/utils/haptics';

import modalContent from './ModalContent';
import {useModalControls, useModals} from './ModalState';
import {useSegments} from 'expo-router';

const DEFAULT_SNAP_POINTS = ['90%'];
const HANDLE_HEIGHT = 24;

function Modal() {
  const {isModalActive, activeModals, modalRef} = useModals();
  const {closeModal, setupModal, openModal, modalProps} = useModalControls();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const activeModal = activeModals[activeModals.length - 1];
  const segments = useSegments();

  const onBottomSheetChange = useCallback(
    async (snapPoint: number) => {
      if (!modalRef?.current) setupModal(bottomSheetRef);
      Haptics.medium();
      if (snapPoint === -1) {
        closeModal();
      }
    },
    [modalRef],
  );

  // const onBottomSheetChange = (snapPoint: number) => {
  //   if (!modalRef?.current) setupModal(bottomSheetRef);
  //   Haptics.medium();
  //   if (snapPoint === -1) {
  //     closeModal();
  //   }
  // };
  const onClose = useCallback(() => {
    if (segments[segments.length - 1] === '(tabs)')
      setTimeout(() => {
        openModal(activeModals[activeModals.length - 1] || 'where-to');
      }, 100);
  }, []);

  useEffect(() => {
    console.log({bottomSheetRef});
    if (bottomSheetRef.current) {
      console.log('SETTING_UP_MODAL');
      if (!modalRef?.current) setupModal(bottomSheetRef);
    }
  }, [bottomSheetRef.current]);

  useEffect(() => {
    if (isModalActive) {
      bottomSheetRef.current?.snapToIndex(0);
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isModalActive]);

  const snapPoints = useMemo(() => {
    if (modalContent[activeModal]?.snapPoints) {
      return modalContent[activeModal].snapPoints;
    }
    return DEFAULT_SNAP_POINTS;
  }, [activeModal]);

  const contentProps = useMemo(() => {
    if (modalContent[activeModal]) {
      const {snapPoints, ...content} = modalContent[activeModal];
      return content;
    }
    return {};
  }, [activeModal]);

  if (!isModalActive || !activeModals.length) return null;
  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      handleHeight={HANDLE_HEIGHT}
      index={isModalActive ? 0 : -1}
      android_keyboardInputMode="adjustResize"
      // onClose={onClose}
      keyboardBlurBehavior="restore"
      containerStyle={[
        snapPoints.includes('100%') &&
          Platform.OS === 'ios' && [a.mt_(Constants.statusBarHeight)],
      ]}
      handleIndicatorStyle={[a.bg_(colors.darkgray)]}
      onChange={onBottomSheetChange}
      handleStyle={[styles.handle]}
      {...contentProps}
      {...modalProps}>
      {modalContent[activeModal]?.children}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  handle: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  fullscreenContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export const ModalContainer = memo(Modal);

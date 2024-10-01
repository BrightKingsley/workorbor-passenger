import {useFocusEffect, useRouter, useSegments} from 'expo-router';
import React, {PropsWithChildren} from 'react';

export default function PopScreenOnBlur({children}: PropsWithChildren) {
  const router = useRouter();
  const segments = useSegments();

  useFocusEffect(
    React.useCallback(() => {
      // Screen is focused
      console.log('FOCUSED:', {segments});
      return () => {
        console.log('UNFOCUSED:', {segments});

        // Screen is unfocused
        // Remove this screen from the stack
        router.dismiss();
      };
    }, [router]),
  );
  return <>{children}</>;
}

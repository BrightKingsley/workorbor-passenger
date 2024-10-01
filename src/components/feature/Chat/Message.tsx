import {useUser} from '@clerk/clerk-expo';
import React from 'react';

import {a} from '$/src/lib/style/atoms';
import {colors} from '$/src/lib/theme/palette';

import {Column} from '../../global';
import {Text} from '../../global/Themed';
import {MessageType} from './types';

export default function Message({sender, text}: MessageType) {
  const {user} = useUser();
  return (
    <Column
      style={[
        a.rounded_lg,
        a.p_md,
        sender === user?.id
          ? [a.self_end, a.bg_(colors.light), {borderTopRightRadius: 0}]
          : [a.bg_(colors.lightgrey), {borderTopLeftRadius: 0}],
      ]}>
      <Text style={[a.text_(colors.darkgray)]}>{text}</Text>
    </Column>
  );
}

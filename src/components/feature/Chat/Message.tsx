import {useUser} from '@clerk/clerk-expo';
import {memo} from 'react';
import Animated, {ZoomInEasyDown} from 'react-native-reanimated';

import {a} from '$/src/lib/style/atoms';
import {colors} from '$/src/lib/theme/palette';
import {hexWithOpacity} from '$/src/lib/ui/helpers';

import {Row} from '../../global';
import {Text} from '../../global/Themed';
import {MessageType} from './types';

const Message = memo(({sender, content}: MessageType) => {
  const {user} = useUser();

  return (
    // <Column
    //   style={[
    //     a.rounded_lg,
    //     a.p_md,
    //     sender === user?.id
    //       ? [a.self_end, a.bg_(colors.light), {borderTopRightRadius: 0}]
    //       : [a.bg_(colors.lightgrey), {borderTopLeftRadius: 0}],
    //   ]}>
    //   <Text style={[a.text_(colors.darkgray)]}>{text}</Text>
    // </Column>
    <Animated.View style={[a.mt_xl]}>
      <Row
        reverse={sender === user?.id}
        style={[
          a.gap_sm,
          a.align_center,
          a.w_90,
          sender === user?.id && a.self_end,
        ]}>
        <Animated.View
          entering={ZoomInEasyDown}
          style={[
            a.p_lg,
            a.bg_(
              sender === user?.id
                ? hexWithOpacity(colors.primarylighter, 0.3)
                : colors.light,
            ),
            sender === user?.id
              ? []
              : [a.border, a.border_tint(colors.lightgrey)],
            a.rounded_(25),
          ]}>
          <Text style={[a.text_md]}>{content}</Text>
        </Animated.View>
      </Row>
    </Animated.View>
  );
});

export default Message;

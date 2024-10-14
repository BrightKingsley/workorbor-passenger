import {useUser} from '@clerk/clerk-expo';
import Animated, {ZoomInEasyDown} from 'react-native-reanimated';

import {a} from '$/src/lib/style/atoms';
import {colors} from '$/src/lib/theme/palette';
import {hexWithOpacity} from '$/src/lib/ui/helpers';

import {Row} from '../../global';
import {Text} from '../../global/Themed';
import {MessageType} from './types';

export default function Message({sender, text}: MessageType) {
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
        {/* <Image
          source={{uri: sender === 'me' ? PASSENGER_IMG : DRIVER_IMG}}
          alt="user"
          style={
            [
              a.rounded_full,
              a.overflow_hidden,
              a.w_(40),
              a.h_(40),
              a.bg_(colors.yellow_1),
            ] as React.ComponentProps<typeof Image>['style']
          }
        /> */}
        <Animated.View
          entering={ZoomInEasyDown}
          style={[
            a.p_lg,
            a.bg_(
              sender === 'me'
                ? colors.primarylighter
                : hexWithOpacity(colors.primarylighter, 0.3),
            ),
            // sender === 'me'
            //   ? [a.rounded_b_md, a.rounded_t_lg]
            //   : [a.rounded_b_lg, a.rounded_t_sm],
            a.rounded_(25),
          ]}>
          <Text style={[a.text_md]}>{text}</Text>
        </Animated.View>
      </Row>
    </Animated.View>
  );
}

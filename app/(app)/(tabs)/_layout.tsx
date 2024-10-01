import {MaterialCommunityIcons} from '@expo/vector-icons';
import {Tabs} from 'expo-router';

import {HomeIcon, HomeIconOutline} from '$/src/assets/icons';
import {Text} from '$/src/components/global/Themed';
import {a} from '$/src/lib/style/atoms';
import {colors} from '$/src/lib/theme/palette';

export default function TabLayout() {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          headerShown: false,
          // tabBarLabel: ({children, color}) => (
          //   <Text style={[a.text_(color), a.text_xs]}>{children}</Text>
          // ),
          tabBarLabelStyle: {
            fontFamily: 'DMSans_400Regular',
          },
          // tabBarShowLabel: false,
          // tabBarButton({children, ...props}) {
          //   const [active, setActive] = useState(false);
          //   const animatedValue = useSharedValue(0);

          //   const animatedStyle = useAnimatedStyle(() => ({
          //     backgroundColor: withTiming(
          //       active ? '#6944D880' : 'transparent',
          //       {duration: 300}, // adjust the duration for smoothness
          //     ),
          //   }));
          //   return (
          //     <Pressable
          //       android_ripple={{
          //         color: hexWithOpacity(colors.primary, 0.1),
          //       }}
          //       {...props}
          //       onPressIn={() => {
          //         setActive(true);
          //         animatedValue.value = 1;
          //       }}
          //       onPressOut={() => {
          //         setActive(false);
          //         animatedValue.value = 0;
          //       }}
          //       style={[
          //         props.style,
          //         // [active && a.bg_(hexWithOpacity(colors.primary, 0.1))],
          //       ]}>
          //       <Animated.View
          //         style={[
          //           Platform.OS === 'ios' && animatedStyle,
          //           a.w_full,
          //           a.h_full,
          //         ]}>
          //         {children}
          //       </Animated.View>
          //     </Pressable>
          //   );
          // },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({color, focused}) =>
              focused ? <HomeIcon fill={color} /> : <HomeIconOutline />,
          }}
        />
        <Tabs.Screen
          name="orders"
          options={{
            title: 'orders',
            tabBarIcon: ({color, focused}) => (
              <MaterialCommunityIcons
                name={focused ? 'calendar-blank' : 'calendar-blank-outline'}
                color={color}
                size={24}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="account"
          options={{
            title: 'account',
            tabBarIcon: ({color, focused}) => (
              <MaterialCommunityIcons
                name={focused ? 'account-circle' : 'account-circle-outline'}
                color={color}
                size={24}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
}

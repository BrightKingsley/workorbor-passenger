import {FontAwesome} from '@expo/vector-icons';
import {useHeaderHeight} from '@react-navigation/elements';
import {useFocusEffect, useLocalSearchParams} from 'expo-router';
import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import {
  Image,
  ImageStyle,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import useApi from '$/src/hooks/api/useApi';
import {useChatSocket} from '$/src/hooks/socket/chat';
import {useAppSelector} from '$/src/hooks/store';
import {a} from '$/src/lib/style/atoms';
import {colors} from '$/src/lib/theme/palette';
import {hexWithOpacity} from '$/src/lib/ui/helpers';

import {Button, Column, Row, Separator} from '../../global';
import {ButtonText} from '../../global/Button';
import {useModalControls} from '../../global/modals/ModalState';
import {Text, View} from '../../global/Themed';
import ViewHeader from '../../global/ViewHeader';
import {Container} from '../../utils';
import ChatInput from './ChatInput';
import ChatLoader from './ChatLoader';
import Message from './Message';
import {ChatSocket} from './Socket/ChatSocket';

type Props = {};

const QUICK_CHAT_MESSAGES = [
  'Where are you?',
  "I'm here.",
  'On my way.',
  'Almost there.',
  'Share your location.',
  'Stuck in traffic.',
];

export const snapPoints = ['95%'];
export const enablePanDownToClose = false;

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const QuickButton = memo(({text}: {text: string}) => {
  const {sendMessage} = useApi().chat;
  const sendQuickMessage = useCallback(
    async () => await sendMessage(text),
    [text],
  );

  return (
    <View
      style={[
        {
          shadowColor: colors.darkgray,
          shadowOpacity: 0.3,
          shadowOffset: {height: 2, width: 1},
          elevation: 3,
        },
        a.ml_lg,
        a.bg_(colors.light),
        a.rounded_full,
      ]}>
      <Button
        onPress={sendQuickMessage}
        variant="solid"
        shape="round"
        style={[a.bg_(hexWithOpacity(colors.light, 1)), a.py_sm, a.px_lg]}>
        <ButtonText style={[a.text_(colors.darkgray), a.text_md]}>
          {text}
        </ButtonText>
      </Button>
    </View>
  );
});

const Chat = () => {
  let {chat: iosChatId} = useLocalSearchParams<{chat: string}>();

  const {chatId, messages} = useAppSelector(state => state.chat);
  const {riderInfo} = useAppSelector(state => state.order);
  const [loading, setLoading] = useState(false);
  const {closeModal} = useModalControls();

  const flatListRef = useRef<FlatList | null>(null);

  const {getMessages} = useApi().chat;

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    console.log({chatId});
    await getMessages(chatId!);
    setLoading(false);
  }, [chatId, getMessages]);

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== 'ios') return;
      fetchMessages();
      return () => {};
    }, []),
  );

  useEffect(() => {
    if (Platform.OS === 'ios') return;
    fetchMessages();
  }, []);

  const safeAreaInsets = useSafeAreaInsets();
  const [listViewDimensions, setListViewDimensions] = useState({
    width: 0,
    height: 0,
  });

  const scrollY = useSharedValue(0);
  const headerHeight = useHeaderHeight(); // Get the height of the header

  // Scroll handler to update scrollY based on scroll events
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Animated style for the large title (transitioning between large and small)
  const animatedHeaderStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [40, 60], [0, 1], 'clamp');
    const translateY = interpolate(scrollY.value, [40, 60], [5, 0], 'clamp');

    return {
      opacity,
      transform: [{translateY}],
    };
  });

  const animatedLargeHeaderStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [30, 60], [1, 0], 'clamp');

    return {
      opacity,
    };
  });

  const getItemLayout = useCallback(
    (data: any[] | null | undefined, index: number) => ({
      length: 80,
      offset: 80 * index,
      index,
    }),
    [],
  ); // Assuming each item has a height of 80

  const scrollToIndex = useCallback((index: number) => {
    if (index > messages.length) {
      flatListRef.current?.scrollToIndex({
        animated: true,
        index,
        viewPosition: 10,
      });
    }
  }, []);

  const scrollToEnd = useCallback(() => {
    flatListRef.current?.scrollToEnd({
      animated: true,
    });
  }, []);

  useEffect(() => {
    flatListRef.current?.scrollToEnd({
      animated: true,
    });
  }, [messages.length]);

  return (
    <>
      <Container
        safeArea={Platform.OS === 'android'}
        horizontalPadding={false}
        style={[
          a.flex_1,
          a.bg_(colors.light),
          Platform.OS === 'ios' && a.pt_2xl,
          a.pb_(safeAreaInsets.bottom),
        ]}>
        {loading && !messages.length ? (
          <ChatLoader />
        ) : (
          <KeyboardAvoidingView
            keyboardVerticalOffset={60}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[a.flex_1]}>
            <Container style={[a.bg_(colors.light), animatedHeaderStyle]}>
              <ViewHeader
                canGoBack
                backPressHandler={closeModal}
                titleComponent={
                  <Row style={[a.align_center, a.justify_center, a.mx_auto]}>
                    <Row style={[a.align_center]}>
                      <Image
                        style={
                          [a.w_(30), a.h_(30), a.rounded_full] as ImageStyle
                        }
                        source={{
                          uri: riderInfo?.photo,
                        }}
                      />
                      <Text
                        numberOfLines={1}
                        family="Bold"
                        style={[a.text_xl, a.ml_sm]}>
                        {riderInfo?.firstName} {riderInfo?.lastName}
                      </Text>
                    </Row>
                  </Row>
                }
              />
            </Container>

            <Container style={[a.flex_1]}>
              <AnimatedFlatList
                ref={flatListRef}
                onScroll={scrollHandler}
                onLayout={event => {
                  const {width, height} = event.nativeEvent.layout;
                  setListViewDimensions({width, height});
                  Keyboard.isVisible()
                    ? scrollToIndex(messages.length - 1)
                    : scrollToEnd();
                }}
                getItemLayout={getItemLayout}
                scrollEventThrottle={16}
                contentInsetAdjustmentBehavior="automatic"
                showsVerticalScrollIndicator={false}
                style={[a.flex_1]}
                contentContainerStyle={[a.py_lg]}
                data={messages}
                keyExtractor={(item: any) => item.id}
                renderItem={({item: {sender, content, id}}: any) => (
                  <Message sender={sender} content={content} id={id} />
                )}
                ListHeaderComponent={
                  <Container
                    horizontalPadding={false}
                    style={[animatedLargeHeaderStyle]}>
                    <Row style={[a.align_center, a.mb_md]}>
                      <Button
                        variant="ghost"
                        style={[a.w_(20), a.align_center, a.justify_center]}
                        onPress={() => closeModal()}>
                        <FontAwesome name="angle-left" size={30} />
                      </Button>
                      <Image
                        style={
                          [a.w_(30), a.h_(30), a.rounded_full] as ImageStyle
                        }
                        source={{
                          uri: riderInfo?.photo,
                        }}
                      />
                      <Text
                        numberOfLines={1}
                        family="Bold"
                        style={[a.text_5xl, a.ml_sm]}>
                        {riderInfo?.firstName} {riderInfo?.lastName}
                      </Text>
                    </Row>
                    <Separator
                      backgroundColor={hexWithOpacity(colors.lightgrey, 0.3)}
                      height={1}
                      style={[a.w_full]}
                    />
                  </Container>
                }
                ListFooterComponent={() =>
                  !messages.length && (
                    <Column style={[a.align_center, a.mt_5xl]}>
                      <Text style={[a.text_center]}>You have no messages</Text>
                      <Button
                        variant="ghost"
                        shape="round"
                        style={[a.py_xs, a.px_md, a.mt_sm]}
                        color="primary"
                        onPress={fetchMessages}>
                        <ButtonText style={[a.text_md]}>Refresh</ButtonText>
                      </Button>
                    </Column>
                  )
                }
              />
            </Container>
            <Container horizontalPadding={false}>
              <ScrollView
                style={[]}
                contentContainerStyle={[a.py_sm, a.px_md, a.h_full]}
                showsHorizontalScrollIndicator={false}
                horizontal={true}>
                {QUICK_CHAT_MESSAGES.map((message, i) => (
                  <QuickButton key={i} text={message} />
                ))}
              </ScrollView>
            </Container>
            <Container style={[Platform.OS === 'android' ? a.pb_sm : null]}>
              <ChatInput />
            </Container>
          </KeyboardAvoidingView>
        )}
      </Container>
    </>
  );
};

export default memo(Chat);

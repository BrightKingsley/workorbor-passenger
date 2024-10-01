import React, {useEffect} from 'react';
import {FlatList} from 'react-native-gesture-handler';

import Message from './Message';
import {MessageType} from './types';

type Props = {};

const CHAT_DATA: MessageType[] = Array.from({length: 15}, () => null).map(
  (_, i) => ({
    id: i.toString(),
    sender: 'senderId',
    text: `A text ${i}`,
  }),
);

export default function Chat(props: Props) {
  useEffect(() => {
    console.log({CHAT_DATA, props});
  }, []);

  return (
    <FlatList
      data={CHAT_DATA}
      keyExtractor={({id}) => id}
      renderItem={({item: {sender, text, id}}) => (
        <Message sender={sender} text={text} id={id} />
      )}
    />
  );
}

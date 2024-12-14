import {useUser} from '@clerk/clerk-expo';
import {useEffect} from 'react';

import {MessageType} from '$/src/components/feature/Chat/types';
import {useAppDispatch, useAppSelector} from '$/src/hooks/store';
import {socket} from '$/src/lib/utils/socket';
import {addMessage} from '$/src/store/slices/chat';

export function ChatSocket() {
  const {user} = useUser();
  const {chatId} = useAppSelector(state => state.chat);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!chatId) return;
    console.log('JOIN_ROOM:', chatId);
    socket.emit('join_room', chatId);

    return () => {
      socket.emit('leave_room', chatId);
    };
  }, [chatId]);

  useEffect(() => {
    if (!user) return;

    const handleIncomingMessage = (data: MessageType) => {
      console.log('🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥INCOMING_MESSAGE:', data);

      const message = {
        id: data.id,
        sender: data.sender,
        content: data.content,
      };
      dispatch(addMessage(message));
    };

    socket.on('incoming_message', handleIncomingMessage);

    // return () => {
    //   socket.off('incoming_message', handleIncomingMessage);
    // };
  }, [user, dispatch]);

  return null;
}

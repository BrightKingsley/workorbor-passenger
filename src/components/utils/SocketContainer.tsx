import {ChatSocket} from '../feature/Chat/Socket/ChatSocket';
import OrderSocket from '../feature/Order/Socket/OrderSocket';

export default function SocketContainer() {
  return (
    <>
      <OrderSocket />
      <ChatSocket />
    </>
  );
}

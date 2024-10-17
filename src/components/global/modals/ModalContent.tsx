import * as EditImports from '../../../screens/Account/Edit';
import * as ChatImports from '../../feature/Chat/Chat';
import * as AwaitingResponseImports from '../../feature/Order/CreateOrderModal/AwaitingResponse';
import * as ConfirmOrderImports from '../../feature/Order/CreateOrderModal/ConfirmOrder';
import * as OrderDetailsImports from '../../feature/Order/CreateOrderModal/OrderDetails';
import * as EnrouteImports from '../../feature/Order/EnRoute';
import * as RideInfoImports from '../../feature/Order/RideInfo';
import * as RiderDetailsImports from '../../feature/Order/RiderDetails';
import * as SelectDestinationImports from '../../feature/Order/SelectDestination';
import * as WhereToImports from '../../feature/Order/WhereTo';

const {default: WhereToComponent, ...whereToOptions} = WhereToImports;
const {default: SelectDestinationComponent, ...selectDestinationOptions} =
  SelectDestinationImports;
const {default: RideInfoComponent, ...rideInfoOptions} = RideInfoImports;
const {default: OrderDetailsComponent, ...orderDetailsOptions} =
  OrderDetailsImports;
const {default: ConfirmOrderComponent, ...confirmOrderOptions} =
  ConfirmOrderImports;
const {default: AwaitingResponseComponent, ...awaitingResponseOptions} =
  AwaitingResponseImports;
const {default: ChatComponent, ...chatOptions} = ChatImports;
const {default: EditComponent, ...editOptions} = EditImports;
const {default: EnrouteComponent, ...enrouteOptions} = EnrouteImports;
const {default: RiderDetailsComponent, ...riderDetailsOptions} =
  RiderDetailsImports;

// Define the modalContent object with proper typing for each bottom sheet
const modalContent = {
  'where-to': {
    children: <WhereToComponent />, // Using JSX.Element as value for 'children' prop
    ...whereToOptions,
  },
  'select-destination': {
    children: <SelectDestinationComponent />,
    ...selectDestinationOptions,
  },
  // 'create-order': {
  //   children: <CreateOrderComponent />,
  //   ...createOrderOptions,
  // },
  'ride-info': {
    children: <RideInfoComponent />,
    ...rideInfoOptions,
  },
  'order-details': {
    children: <OrderDetailsComponent />,
    ...orderDetailsOptions,
  },
  'confirm-order': {
    children: <ConfirmOrderComponent />,
    ...confirmOrderOptions,
  },
  'awaiting-response': {
    children: <AwaitingResponseComponent />,
    ...awaitingResponseOptions,
  },
  enroute: {
    children: <EnrouteComponent />,
    ...enrouteOptions,
  },
  'rider-details': {
    children: <RiderDetailsComponent />,
    ...riderDetailsOptions,
  },
  chat: {
    children: <ChatComponent />,
    ...chatOptions,
  },
  edit: {
    children: <EditComponent />,
    ...editOptions,
  },
};
export default modalContent;

import * as AwaitingResponseImports from '../../feature/Order/CreateOrderModal/AwaitingResponse';
import * as ConfirmOrderImports from '../../feature/Order/CreateOrderModal/ConfirmOrder';
import * as CreateOrderImports from '../../feature/Order/CreateOrderModal/CreateOrder';
import * as OrderDetailsImports from '../../feature/Order/CreateOrderModal/OrderDetails';
import * as RideInfoImports from '../../feature/Order/RideInfo';
import * as SelectDestinationImports from '../../feature/Order/SelectDestination';
import * as WhereToImports from '../../feature/Order/WhereTo';

const {default: WhereToComponent, ...whereToOptions} = WhereToImports;
const {default: SelectDestinationComponent, ...selectDestinationOptions} =
  SelectDestinationImports;
const {default: CreateOrderComponent, ...createOrderOptions} =
  CreateOrderImports;
const {default: RideInfoComponent, ...rideInfoOptions} = RideInfoImports;
const {default: OrderDetailsComponent, ...orderDetailsOptions} =
  OrderDetailsImports;
const {default: ConfirmOrderComponent, ...confirmOrderOptions} =
  ConfirmOrderImports;

const {default: AwaitingResponseComponent, ...awaitingResponseOptions} =
  AwaitingResponseImports;

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
};
export default modalContent;

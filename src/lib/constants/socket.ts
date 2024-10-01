// Socket Constants
const sk = {
  global: {
    reconnect: 'reconnect',
    disconnect_user: 'disconnect_user',
  },
  order: {
    update_rider_socket: 'update_rider_socket',
    update_passenger_socket: 'update_passenger_socket',
    update_rider_location: 'update_rider_location',
  },
} as const;

export default sk;

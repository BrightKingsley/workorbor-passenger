export enum VehicleType {
  car = 'car',
  keke = 'keke',
  bike = 'bike',
}

export type Vehicle = {
  capacity: number;
  type: VehicleType;
};

export type Rider = {
  riderId: string;
  location: {coords: {latitude: number; longitude: number}; address: string};
  vehicle: Vehicle;
  photo: string;
  lastName: string;
  firstName: string;
  phoneNumber: string;
};

export enum OrderPhase {
  creation = 'creation',
  awaitingResponse = 'awaiting-response',
  awaitingRide = 'awaiting-ride',
  enroute = 'enroute',
  complete = 'complete',
  accepted = 'accepted',
  nil = 'nil',
  rideArrived = 'ride-arrived',
}

export interface RideOrderRequest {
  orderId: string;
  origin: {
    latitude?: number;
    longitude?: number;
    address?: string;
  };
  destination: {
    latitude?: number;
    longitude?: number;
    address?: string;
  };
  fare?: number;
}
export interface RideOrderResponse {
  availableRiders: Rider[];
}

// export type OrderRequest = RideOrderRequest | DeliveryOrderRequest;

export interface OrderRequest extends RideOrderRequest {}

export type OrderResponse = RideOrderResponse;

export type OrderState = {
  orderRequest: OrderRequest | null;
  orderResponse: OrderResponse | null;
  orderPhase: OrderPhase;
  riderInfo: Rider | null;
};

export function getDistanceFromLatLonInMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371e3; // Radius of the earth in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in meters
  return distance;
}

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
  name: string;
  location: {coords: {latitude: number; longitude: number}; address: string};
  vehicle: Vehicle;
};

export enum OrderPhase {
  creation = 'creation',
  awaitingResponse = 'awaiting-response',
  awaitingRide = 'awaiting-ride',
  enroute = 'enroute',
  complete = 'complete',
  nil = 'nil',
}

export interface RideOrderRequest {
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
};

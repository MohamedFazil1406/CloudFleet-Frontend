export type WebSocketMessageType =
    | "VEHICLE_LOCATION_UPDATED"
    | "VEHICLE_STATUS_UPDATED"
    | "ALERT_CREATED"
    | "ALERT_UPDATED"
    | "VEHICLE_CREATED"
    | "VEHICLE_DELETED";

export interface WebSocketMessage<T = unknown> {
    type: WebSocketMessageType;
    data: T;
}

export interface VehicleLocationUpdate {
    id: number;
    vehicleNumber?: string;
    latitude: number;
    longitude: number;
    status?: string;
}

export interface VehicleStatusUpdate {
    id: number;
    vehicleNumber?: string;
    status: string;
}

export interface AlertUpdate {
    id: number;
    message?: string;
    type?: string;
    createdAt?: string;
}
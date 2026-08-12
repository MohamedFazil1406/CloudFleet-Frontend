export type VehicleStatus = "ACTIVE" | "INACTIVE" | "MAINTENANCE";

export interface Vehicle {
  id: number;
  vehicleNumber: string;
  type: string;
  status: VehicleStatus;
  latitude: number | null;
  longitude: number | null;
  speed: number | null;
  lastUpdated?: string | null;
}

export interface VehicleRequest {
  vehicleNumber: string;
  type: string;
  status: VehicleStatus;
  latitude: number;
  longitude: number;
  speed: number;
}

export type AlertType = "GEOFENCE_ENTER" | "GEOFENCE_EXIT";

export interface Alert {
  id: number;
  vehicleId: number;
  geofenceId: number;
  geofenceName: string;
  type: AlertType;
  message: string;
  latitude: number;
  longitude: number;
  createdAt: string;
}

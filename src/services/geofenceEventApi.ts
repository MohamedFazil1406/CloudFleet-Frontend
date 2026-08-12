import api from "./api";

export interface GeofenceEvent {
  id: number;
  vehicleId: number;
  geofenceId: number;
  geofenceName: string;
  eventType: "ENTER" | "EXIT";
  latitude: number;
  longitude: number;
  occurredAt: string;
}

export const getGeofenceEvents = async (): Promise<GeofenceEvent[]> => {
  const response = await api.get<GeofenceEvent[]>("/geofence-events");

  return response.data;
};

export const getVehicleGeofenceEvents = async (
  vehicleId: number,
): Promise<GeofenceEvent[]> => {
  const response = await api.get<GeofenceEvent[]>(
    `/vehicles/${vehicleId}/geofence-events`,
  );

  return response.data;
};

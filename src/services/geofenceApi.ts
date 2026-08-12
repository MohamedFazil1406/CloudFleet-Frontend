import api from "./api";

export interface Geofence {
  id: number;
  name: string;
  centerLatitude: number;
  centerLongitude: number;
  radiusMeters: number;
  active: boolean;
  createdAt?: string;
}

export interface CreateGeofenceRequest {
  name: string;
  centerLatitude: number;
  centerLongitude: number;
  radiusMeters: number;
  active: boolean;
}

export const getGeofences = async (): Promise<Geofence[]> => {
  const response = await api.get<Geofence[]>("/geofences");

  return response.data;
};

export const createGeofence = async (
  request: CreateGeofenceRequest,
): Promise<Geofence> => {
  const response = await api.post<Geofence>("/geofences", request);

  return response.data;
};

export const deleteGeofence = async (id: number): Promise<void> => {
  await api.delete(`/geofences/${id}`);
};

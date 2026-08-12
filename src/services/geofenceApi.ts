import api from "./api.ts";

export interface Geofence {
  id: number;
  name: string;
  centerLatitude: number;
  centerLongitude: number;
  radiusMeters: number;
  active: boolean;
  createdAt?: string;
}

export interface GeofenceRequest {
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
  data: GeofenceRequest,
): Promise<Geofence> => {
  const response = await api.post<Geofence>("/geofences", data);

  return response.data;
};

export const getGeofence = async (id: number): Promise<Geofence> => {
  const response = await api.get<Geofence>(`/geofences/${id}`);

  return response.data;
};

export const updateGeofence = async (
  id: number,
  data: GeofenceRequest,
): Promise<Geofence> => {
  const response = await api.put<Geofence>(`/geofences/${id}`, data);

  return response.data;
};

export const deleteGeofence = async (id: number): Promise<void> => {
  await api.delete(`/geofences/${id}`);
};

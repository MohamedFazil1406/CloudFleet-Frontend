import api from "./api";

import type { Geofence } from "../types/geofence";

// Re-export Geofence so components can import it from this service.
export type { Geofence } from "../types/geofence";

export const getGeofences = async (): Promise<Geofence[]> => {
  const response = await api.get<Geofence[]>("/geofences");

  return response.data;
};

export const getGeofence = async (id: number): Promise<Geofence> => {
  const response = await api.get<Geofence>(`/geofences/${id}`);

  return response.data;
};

export interface GeofenceRequest {
  name: string;
  centerLatitude: number;
  centerLongitude: number;
  radiusMeters: number;
  active?: boolean;
}

export const createGeofence = async (
  request: GeofenceRequest,
): Promise<Geofence> => {
  const response = await api.post<Geofence>("/geofences", request);

  return response.data;
};

export const updateGeofence = async (
  id: number,
  request: GeofenceRequest,
): Promise<Geofence> => {
  const response = await api.put<Geofence>(`/geofences/${id}`, request);

  return response.data;
};

export const deleteGeofence = async (id: number): Promise<void> => {
  await api.delete(`/geofences/${id}`);
};

import api from "./api.ts";

export interface GeofencePoint {
    latitude: number;
    longitude: number;
}

export interface Geofence {
    id: number;
    name: string;
    description?: string;
    points: GeofencePoint[];
    active?: boolean;
}

export const getGeofences = async (): Promise<Geofence[]> => {
    const response = await api.get<Geofence[]>("/geofences");

    return response.data;
};

export const getGeofence = async (
    id: number
): Promise<Geofence> => {
    const response = await api.get<Geofence>(`/geofences/${id}`);

    return response.data;
};
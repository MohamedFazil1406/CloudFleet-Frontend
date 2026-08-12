import api from "./api.ts";

export type GeofenceCategory =
    | "delivery_zone"
    | "restricted_zone"
    | "toll_zone"
    | "customer_area";

export interface Geofence {
    id: number;
    name: string;
    description?: string;
    coordinates: [number, number][];
    category: GeofenceCategory;
    status?: string;
    createdAt?: string;
}

export interface CreateGeofenceRequest {
    name: string;
    description?: string;
    coordinates: [number, number][];
    category: GeofenceCategory;
}

export const getGeofences = async (): Promise<Geofence[]> => {
    const response =
        await api.get<Geofence[]>("/geofences");

    return response.data;
};

export const createGeofence = async (
    data: CreateGeofenceRequest
): Promise<Geofence> => {
    const response =
        await api.post<Geofence>("/geofences", data);

    return response.data;
};

export const getGeofence = async (
    id: number
): Promise<Geofence> => {
    const response =
        await api.get<Geofence>(`/geofences/${id}`);

    return response.data;
};
import api from "./api.ts";

export interface Vehicle {
    id: number;
    vehicleNumber?: string;
    status?: string;
    latitude?: number;
    longitude?: number;
}

export const getVehicles = async (): Promise<Vehicle[]> => {
    const response = await api.get<Vehicle[]>("/vehicles");

    return response.data;
};

export const getVehicle = async (
    id: number
): Promise<Vehicle> => {
    const response = await api.get<Vehicle>(`/vehicles/${id}`);

    return response.data;
};
import api from "./api.ts";

export interface Alert {
    id: number;
    message?: string;
    type?: string;
    createdAt?: string;
    vehicleId?: number;
    vehicleNumber?: string;
}

export const getAlerts = async (): Promise<Alert[]> => {
    const response = await api.get<Alert[]>("/alerts");

    return response.data;
};

export const getRecentAlerts = async (): Promise<Alert[]> => {
    const response = await api.get<Alert[]>("/alerts/recent");

    return response.data;
};
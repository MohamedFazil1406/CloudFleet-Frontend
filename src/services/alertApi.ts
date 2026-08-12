import api from "./api";
import type { Alert } from "../types/alert";

export const getAlerts = async (): Promise<Alert[]> => {
  const response = await api.get<Alert[]>("/alerts");

  return response.data;
};

export const getAlert = async (id: number): Promise<Alert> => {
  const response = await api.get<Alert>(`/alerts/${id}`);

  return response.data;
};

export const getVehicleAlerts = async (vehicleId: number): Promise<Alert[]> => {
  const response = await api.get<Alert[]>(`/alerts/vehicle/${vehicleId}`);

  return response.data;
};

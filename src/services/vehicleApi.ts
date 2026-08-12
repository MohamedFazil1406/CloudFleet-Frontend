import api from "./api.ts";

import type { Vehicle, VehicleRequest } from "../types/vehicle";

export const getVehicles = async (): Promise<Vehicle[]> => {
  const response = await api.get<Vehicle[]>("/vehicles");

  return response.data;
};

export const getVehicle = async (id: number): Promise<Vehicle> => {
  const response = await api.get<Vehicle>(`/vehicles/${id}`);

  return response.data;
};

export const createVehicle = async (data: VehicleRequest): Promise<Vehicle> => {
  const response = await api.post<Vehicle>("/vehicles", data);

  return response.data;
};

export const updateVehicle = async (
  id: number,
  data: VehicleRequest,
): Promise<Vehicle> => {
  const response = await api.put<Vehicle>(`/vehicles/${id}`, data);

  return response.data;
};

export const deleteVehicle = async (id: number): Promise<void> => {
  await api.delete(`/vehicles/${id}`);
};

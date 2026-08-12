import api from "./api";

import type { Vehicle, VehicleRequest } from "../types/vehicle";

/* -------------------------------- */
/* Get all vehicles */
/* -------------------------------- */

export const getVehicles = async (): Promise<Vehicle[]> => {
  const response = await api.get<Vehicle[]>("/vehicles");

  return response.data;
};

/* -------------------------------- */
/* Get vehicle by ID */
/* -------------------------------- */

export const getVehicle = async (id: number): Promise<Vehicle> => {
  const response = await api.get<Vehicle>(`/vehicles/${id}`);

  return response.data;
};

/* -------------------------------- */
/* Create vehicle */
/* -------------------------------- */

export const createVehicle = async (
  request: VehicleRequest,
): Promise<Vehicle> => {
  const response = await api.post<Vehicle>("/vehicles", request);

  return response.data;
};

/* -------------------------------- */
/* Update vehicle */
/* -------------------------------- */

export const updateVehicle = async (
  id: number,
  request: VehicleRequest,
): Promise<Vehicle> => {
  const response = await api.put<Vehicle>(`/vehicles/${id}`, request);

  return response.data;
};

/* -------------------------------- */
/* Delete vehicle */
/* -------------------------------- */

export const deleteVehicle = async (id: number): Promise<void> => {
  await api.delete(`/vehicles/${id}`);
};

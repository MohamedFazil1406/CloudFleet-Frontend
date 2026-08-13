import api from "./api";

import type { Vehicle, VehicleRequest } from "../types/vehicle";

/**
 * Update only the vehicle location/speed.
 *
 * The backend currently uses PUT /vehicles/{id}
 * for vehicle updates.
 */
export const updateVehicleLocation = async (
  vehicle: Vehicle,
  latitude: number,
  longitude: number,
  speed: number = vehicle.speed ?? 0,
): Promise<Vehicle> => {
  const request: VehicleRequest = {
    vehicleNumber: vehicle.vehicleNumber,

    type: vehicle.type,

    status: vehicle.status,

    latitude,

    longitude,

    speed,
  };

  const response = await api.put<Vehicle>(`/vehicles/${vehicle.id}`, request);

  return response.data;
};

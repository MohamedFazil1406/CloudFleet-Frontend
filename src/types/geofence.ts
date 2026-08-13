export interface Geofence {
  id: number;
  name: string;
  centerLatitude: number;
  centerLongitude: number;
  radiusMeters: number;
  active: boolean;
  createdAt?: string;
}

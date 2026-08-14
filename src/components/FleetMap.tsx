import { MapContainer, TileLayer, Circle, Marker, Popup } from "react-leaflet";

import L from "leaflet";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import { useState } from "react";

import type { Vehicle } from "../types/vehicle";
import type { Geofence } from "../types/geofence";

import { updateVehicleLocation } from "../services/vehicleLocationApi";

interface FleetMapProps {
  vehicles?: Vehicle[];
  geofences?: Geofence[];
}

const vehicleIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,

  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const FleetMap = ({ vehicles = [], geofences = [] }: FleetMapProps) => {
  const [movingVehicleId, setMovingVehicleId] = useState<number | null>(null);

  const handleVehicleMove = async (
    vehicle: Vehicle,
    latitude: number,
    longitude: number,
  ) => {
    try {
      setMovingVehicleId(vehicle.id);

      await updateVehicleLocation(
        vehicle,
        latitude,
        longitude,
        vehicle.speed ?? 0,
      );

      console.log("Vehicle location updated:", {
        vehicleId: vehicle.id,
        latitude,
        longitude,
      });
    } catch (error) {
      console.error("Failed to update vehicle location:", error);
    } finally {
      setMovingVehicleId(null);
    }
  };

  return (
    <MapContainer
      center={[19.076, 72.8777]}
      zoom={12}
      style={{
        width: "100%",
        height: "100%",
        minHeight: "500px",
      }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* ============================== */}
      {/* GEOFENCES */}
      {/* ============================== */}

      {geofences.map((geofence) => (
        <Circle
          key={geofence.id}
          center={[geofence.centerLatitude, geofence.centerLongitude]}
          radius={geofence.radiusMeters}
          pathOptions={{
            color: "#06b6d4",
            fillOpacity: 0.12,
          }}
        />
      ))}

      {/* ============================== */}
      {/* VEHICLES */}
      {/* ============================== */}

      {vehicles.map((vehicle) => {
        if (vehicle.latitude == null || vehicle.longitude == null) {
          return null;
        }

        const position: [number, number] = [
          vehicle.latitude,
          vehicle.longitude,
        ];

        return (
          <Marker
            key={vehicle.id}
            position={position}
            icon={vehicleIcon}
            draggable={true}
            eventHandlers={{
              dragstart: () => {
                setMovingVehicleId(vehicle.id);
              },

              dragend: async (event) => {
                const marker = event.target as L.Marker;

                const newPosition = marker.getLatLng();

                await handleVehicleMove(
                  vehicle,
                  newPosition.lat,
                  newPosition.lng,
                );
              },
            }}
          >
            <Popup>
              <div className="min-w-47.5">
                <h3 className="font-semibold text-base">
                  {vehicle.vehicleNumber}
                </h3>

                <div className="mt-2 space-y-1 text-sm">
                  <p>Type: {vehicle.type}</p>

                  <p>Status: {vehicle.status}</p>

                  <p>Speed: {vehicle.speed ?? 0} km/h</p>

                  <p>Latitude: {vehicle.latitude}</p>

                  <p>Longitude: {vehicle.longitude}</p>
                </div>

                {movingVehicleId === vehicle.id && (
                  <p className="mt-3 text-cyan-400 text-xs">
                    Updating location...
                  </p>
                )}

                <p className="mt-3 text-xs text-slate-500">
                  Drag the marker to move this vehicle.
                </p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default FleetMap;

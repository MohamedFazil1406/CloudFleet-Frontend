import { useEffect, useState } from "react";

import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";

import L from "leaflet";

import { getGeofences } from "../services/geofenceApi";

import type { Geofence } from "../services/geofenceApi";

import { useWebSocket } from "../hooks/useWebSocket";

import type { WebSocketMessage } from "../types/websocket";

import "leaflet/dist/leaflet.css";

/* -------------------------------- */
/* Leaflet marker fix */
/* -------------------------------- */

delete (
  L.Icon.Default.prototype as L.Icon.Default & {
    _getIconUrl?: string;
  }
)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* -------------------------------- */
/* Vehicle type used by FleetMap */
/* -------------------------------- */

/*
 * Dashboard vehicles do not currently contain
 * all fields from the full Vehicle interface.
 *
 * Therefore FleetMap only requires the fields
 * that it actually uses.
 */
interface FleetMapVehicle {
  id: number;

  vehicleNumber?: string;

  status?: string;

  latitude?: number | null;

  longitude?: number | null;

  type?: string;

  speed?: number | null;
}

/* -------------------------------- */
/* Props */
/* -------------------------------- */

interface FleetMapProps {
  vehicles: FleetMapVehicle[];
}

/* -------------------------------- */
/* Component */
/* -------------------------------- */

const FleetMap = ({ vehicles }: FleetMapProps) => {
  const [geofences, setGeofences] = useState<Geofence[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  /* -------------------------------- */
  /* Load geofences */
  /* -------------------------------- */

  const loadGeofences = async () => {
    try {
      setError(null);

      const data = await getGeofences();

      setGeofences(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load geofences:", err);

      setError("Failed to load geofences.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGeofences();
  }, []);

  /* -------------------------------- */
  /* WebSocket */
  /* -------------------------------- */

  const handleWebSocketMessage = (message: WebSocketMessage) => {
    if (message.type === "VEHICLE_LOCATION_UPDATED") {
      console.log("Vehicle location updated:", message.data);
    }

    if (message.type === "VEHICLE_CREATED") {
      console.log("Vehicle created:", message.data);
    }

    if (message.type === "VEHICLE_DELETED") {
      console.log("Vehicle deleted:", message.data);
    }
  };

  useWebSocket({
    onMessage: handleWebSocketMessage,
  });

  /* -------------------------------- */
  /* Vehicles with valid coordinates */
  /* -------------------------------- */

  const locatedVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.latitude !== null &&
      vehicle.latitude !== undefined &&
      vehicle.longitude !== null &&
      vehicle.longitude !== undefined,
  );

  /* -------------------------------- */
  /* Loading */
  /* -------------------------------- */

  if (loading) {
    return (
      <div className="w-full min-h-[500px] rounded-2xl bg-[#0d1b2a] border border-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-9 h-9 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />

          <p className="text-slate-400 mt-4">Loading fleet map...</p>
        </div>
      </div>
    );
  }

  /* -------------------------------- */
  /* Map */
  /* -------------------------------- */

  return (
    <div className="relative w-full h-full min-h-[500px] rounded-2xl overflow-hidden border border-slate-800">
      {/* Error */}

      {error && (
        <div className="absolute top-4 left-4 right-4 z-[1000] rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <MapContainer
        center={[19.076, 72.8777]}
        zoom={11}
        scrollWheelZoom={true}
        className="w-full h-full min-h-[500px]"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* ================================ */}
        {/* GEOFENCES */}
        {/* ================================ */}

        {geofences.map((geofence) => {
          if (
            geofence.centerLatitude === undefined ||
            geofence.centerLongitude === undefined ||
            geofence.radiusMeters === undefined
          ) {
            return null;
          }

          return (
            <Circle
              key={geofence.id}
              center={[geofence.centerLatitude, geofence.centerLongitude]}
              radius={geofence.radiusMeters}
              pathOptions={{
                color: geofence.active ? "#06b6d4" : "#64748b",

                fillColor: geofence.active ? "#06b6d4" : "#64748b",

                fillOpacity: 0.12,

                weight: 2,
              }}
            >
              <Popup>
                <div className="text-slate-900 min-w-[180px]">
                  <h3 className="font-semibold text-base">{geofence.name}</h3>

                  <div className="mt-2 text-sm space-y-1">
                    <p>Radius: {geofence.radiusMeters} m</p>

                    <p>Status: {geofence.active ? "Active" : "Inactive"}</p>

                    <p>
                      Center:
                      <br />
                      {geofence.centerLatitude}
                      {" , "}
                      {geofence.centerLongitude}
                    </p>
                  </div>
                </div>
              </Popup>
            </Circle>
          );
        })}

        {/* ================================ */}
        {/* VEHICLES */}
        {/* ================================ */}

        {locatedVehicles.map((vehicle) => (
          <Marker
            key={vehicle.id}
            position={[vehicle.latitude!, vehicle.longitude!]}
          >
            <Popup>
              <div className="text-slate-900 min-w-[180px]">
                <h3 className="font-semibold text-base">
                  {vehicle.vehicleNumber ?? `Vehicle #${vehicle.id}`}
                </h3>

                <div className="mt-2 text-sm space-y-1">
                  <p>Status: {vehicle.status ?? "Unknown"}</p>

                  {vehicle.type && <p>Type: {vehicle.type}</p>}

                  {vehicle.speed !== null && vehicle.speed !== undefined && (
                    <p>Speed: {vehicle.speed} km/h</p>
                  )}

                  <p>Location:</p>

                  <p>
                    {vehicle.latitude}
                    {" , "}
                    {vehicle.longitude}
                  </p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* ================================ */}
      {/* MAP STATUS */}
      {/* ================================ */}

      <div className="absolute bottom-5 left-5 z-[1000]">
        <div className="flex items-center gap-5 rounded-xl border border-slate-700 bg-[#07111f]/95 backdrop-blur px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />

            <span className="text-xs text-slate-300">
              {locatedVehicles.length} located
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />

            <span className="text-xs text-slate-300">
              {geofences.length} geofences
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FleetMap;

import { useEffect, useState } from "react";

import {
  Circle,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";

import {
  createGeofence,
  getGeofences,
  deleteGeofence,
} from "../services/geofenceApi";

import type { Geofence } from "../services/geofenceApi";

import "leaflet/dist/leaflet.css";

const DEFAULT_CENTER: [number, number] = [19.076, 72.8777];

/* -------------------------------- */
/* Map click handler */
/* -------------------------------- */

interface MapClickHandlerProps {
  onMapClick: (point: [number, number]) => void;
}

const MapClickHandler = ({ onMapClick }: MapClickHandlerProps) => {
  useMapEvents({
    click(event) {
      onMapClick([event.latlng.lat, event.latlng.lng]);
    },
  });

  return null;
};

/* -------------------------------- */
/* Distance calculation */
/* -------------------------------- */

const calculateDistanceMeters = (
  point1: [number, number],
  point2: [number, number],
) => {
  const earthRadius = 6_371_000;

  const lat1 = (point1[0] * Math.PI) / 180;

  const lat2 = (point2[0] * Math.PI) / 180;

  const deltaLat = ((point2[0] - point1[0]) * Math.PI) / 180;

  const deltaLng = ((point2[1] - point1[1]) * Math.PI) / 180;

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadius * c;
};

/* -------------------------------- */
/* Page */
/* -------------------------------- */

const Geofences = () => {
  const [geofences, setGeofences] = useState<Geofence[]>([]);

  const [name, setName] = useState("");

  const [center, setCenter] = useState<[number, number] | null>(null);

  const [boundary, setBoundary] = useState<[number, number] | null>(null);

  const [radius, setRadius] = useState(0);

  const [active, setActive] = useState(true);

  const [loading, setLoading] = useState(false);

  const [loadingGeofences, setLoadingGeofences] = useState(true);

  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [message, setMessage] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);

  /* -------------------------------- */
  /* Load geofences */
  /* -------------------------------- */

  const loadGeofences = async () => {
    try {
      setLoadingGeofences(true);

      const data = await getGeofences();

      setGeofences(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load geofences:", err);

      setError("Failed to load geofences.");
    } finally {
      setLoadingGeofences(false);
    }
  };

  useEffect(() => {
    loadGeofences();
  }, []);

  /* -------------------------------- */
  /* Map click */
  /* -------------------------------- */

  const handleMapClick = (point: [number, number]) => {
    setMessage(null);
    setError(null);

    /*
     * First click:
     * select center.
     */
    if (!center) {
      setCenter(point);

      setBoundary(null);

      setRadius(0);

      return;
    }

    /*
     * Second click:
     * calculate radius.
     */
    const calculatedRadius = calculateDistanceMeters(center, point);

    if (calculatedRadius <= 0) {
      setError("Radius must be greater than zero.");

      return;
    }

    setBoundary(point);

    setRadius(Math.round(calculatedRadius));
  };

  /* -------------------------------- */
  /* Clear form */
  /* -------------------------------- */

  const clearGeofence = () => {
    setCenter(null);

    setBoundary(null);

    setRadius(0);

    setName("");

    setActive(true);

    setMessage(null);

    setError(null);
  };

  /* -------------------------------- */
  /* Create geofence */
  /* -------------------------------- */

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setMessage(null);
    setError(null);

    if (!name.trim()) {
      setError("Geofence name is required.");

      return;
    }

    if (!center) {
      setError("Click on the map to select the geofence center.");

      return;
    }

    if (radius <= 0) {
      setError("Click a second point on the map to define the radius.");

      return;
    }

    try {
      setLoading(true);

      /*
       * This matches your backend
       * GeofenceRequest exactly.
       */
      const created = await createGeofence({
        name: name.trim(),

        centerLatitude: center[0],

        centerLongitude: center[1],

        radiusMeters: radius,

        active,
      });

      console.log("Created geofence:", created);

      setMessage(`Geofence "${created.name}" created successfully.`);

      /*
       * Refresh the list/map.
       */
      await loadGeofences();

      /*
       * Clear only the creation form.
       */
      setCenter(null);

      setBoundary(null);

      setRadius(0);

      setName("");

      setActive(true);
    } catch (err) {
      console.error("Failed to create geofence:", err);

      setError("Failed to create geofence. Check the backend/API response.");
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------- */
  /* Delete geofence */
  /* -------------------------------- */

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this geofence?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);

      setError(null);

      await deleteGeofence(id);

      setMessage("Geofence deleted successfully.");

      await loadGeofences();
    } catch (err) {
      console.error("Failed to delete geofence:", err);

      setError("Failed to delete geofence.");
    } finally {
      setDeletingId(null);
    }
  };

  /* -------------------------------- */
  /* Render */
  /* -------------------------------- */

  return (
    <div className="min-h-[calc(100vh-4rem)] text-white">
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}

        <div className="mb-8">
          <p className="text-cyan-400 text-sm font-medium mb-2">
            GEO-FENCE MANAGEMENT
          </p>

          <h1 className="text-3xl md:text-4xl font-bold">Create Geofence</h1>

          <p className="text-slate-400 mt-2">
            Select a center and define the monitoring radius on the map.
          </p>
        </div>

        {/* Messages */}

        {message && (
          <div className="mb-5 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-5 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">
          {/* ================================ */}
          {/* FORM */}
          {/* ================================ */}

          <section className="bg-[#0d1b2a] border border-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold">Geofence Details</h2>

            <p className="text-sm text-slate-500 mt-1 mb-6">
              Configure your monitoring zone.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}

              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Mumbai Delivery Zone"
                  className="w-full px-4 py-3 rounded-lg bg-[#07111f] border border-slate-700 text-white placeholder:text-slate-600 outline-none focus:border-cyan-500 transition"
                />
              </div>

              {/* Active */}

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(event) => setActive(event.target.checked)}
                  className="w-4 h-4 accent-cyan-500"
                />

                <span className="text-sm text-slate-300">Active geofence</span>
              </label>

              {/* Information */}

              <div className="bg-[#07111f] border border-slate-800 rounded-lg p-4 space-y-3">
                <div className="flex justify-between gap-4">
                  <span className="text-sm text-slate-400">Center</span>

                  <span className="text-sm text-cyan-400 text-right">
                    {center
                      ? `${center[0].toFixed(5)}, ${center[1].toFixed(5)}`
                      : "Not selected"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-slate-400">Radius</span>

                  <span className="text-sm text-cyan-400">
                    {radius > 0 ? `${radius} m` : "Not set"}
                  </span>
                </div>
              </div>

              {/* Instructions */}

              <div className="rounded-lg bg-cyan-500/5 border border-cyan-500/10 p-4">
                <p className="text-sm text-cyan-400 font-medium">
                  How to create
                </p>

                <ol className="text-xs text-slate-500 mt-2 space-y-1">
                  <li>1. Click the center of the zone.</li>

                  <li>2. Click another point to set the radius.</li>

                  <li>3. Click Create Geofence.</li>
                </ol>
              </div>

              {/* Buttons */}

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={clearGeofence}
                  className="px-4 py-3 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
                >
                  Clear
                </button>

                <button
                  type="submit"
                  disabled={loading || !center || radius <= 0}
                  className="px-4 py-3 rounded-lg bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  {loading ? "Creating..." : "Create Geofence"}
                </button>
              </div>
            </form>
          </section>

          {/* ================================ */}
          {/* MAP */}
          {/* ================================ */}

          <section className="bg-[#0d1b2a] border border-slate-800 rounded-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Geofence Map</h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Click twice on the map.
                  </p>
                </div>

                <span className="px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs">
                  {radius > 0 ? `${radius} m radius` : "No radius"}
                </span>
              </div>
            </div>

            <div className="h-[600px]">
              <MapContainer
                center={DEFAULT_CENTER}
                zoom={11}
                scrollWheelZoom
                className="h-full w-full"
              >
                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapClickHandler onMapClick={handleMapClick} />

                {/* Existing geofences */}

                {geofences.map((geofence) => (
                  <Circle
                    key={geofence.id}
                    center={[geofence.centerLatitude, geofence.centerLongitude]}
                    radius={geofence.radiusMeters}
                    pathOptions={{
                      color: geofence.active ? "#06b6d4" : "#64748b",

                      fillColor: geofence.active ? "#06b6d4" : "#64748b",

                      fillOpacity: 0.1,

                      weight: 2,
                    }}
                  >
                    <Popup>
                      <div className="text-slate-900">
                        <strong>{geofence.name}</strong>

                        <p>Radius: {geofence.radiusMeters} m</p>

                        <p>Status: {geofence.active ? "Active" : "Inactive"}</p>
                      </div>
                    </Popup>
                  </Circle>
                ))}

                {/* Selected center */}

                {center && (
                  <Marker position={center}>
                    <Popup>
                      <strong>Geofence Center</strong>

                      <p>Latitude: {center[0].toFixed(6)}</p>

                      <p>Longitude: {center[1].toFixed(6)}</p>
                    </Popup>
                  </Marker>
                )}

                {/* Radius point */}

                {boundary && (
                  <Marker position={boundary}>
                    <Popup>Radius point</Popup>
                  </Marker>
                )}

                {/* New geofence preview */}

                {center && radius > 0 && (
                  <Circle
                    center={center}
                    radius={radius}
                    pathOptions={{
                      color: "#06b6d4",
                      fillColor: "#06b6d4",
                      fillOpacity: 0.15,
                      weight: 3,
                    }}
                  />
                )}
              </MapContainer>
            </div>
          </section>
        </div>

        {/* ================================ */}
        {/* EXISTING GEOFENCES */}
        {/* ================================ */}

        <section className="mt-6 bg-[#0d1b2a] border border-slate-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Existing Geofences</h2>

              <p className="text-sm text-slate-500 mt-1">
                Geofences currently stored in the backend.
              </p>
            </div>

            <button
              type="button"
              onClick={loadGeofences}
              disabled={loadingGeofences}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm text-slate-300 disabled:opacity-50"
            >
              Refresh
            </button>
          </div>

          {loadingGeofences ? (
            <div className="px-6 py-10 text-center text-slate-500">
              Loading geofences...
            </div>
          ) : geofences.length === 0 ? (
            <div className="px-6 py-10 text-center text-slate-500">
              No geofences created yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {geofences.map((geofence) => (
                <div
                  key={geofence.id}
                  className="px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{geofence.name}</h3>

                      <span
                        className={`px-2 py-1 rounded-full text-xs border ${
                          geofence.active
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                            : "bg-slate-500/10 border-slate-500/20 text-slate-400"
                        }`}
                      >
                        {geofence.active ? "ACTIVE" : "INACTIVE"}
                      </span>
                    </div>

                    <div className="text-sm text-slate-500 mt-2">
                      Center: {geofence.centerLatitude}
                      {" , "}
                      {geofence.centerLongitude}
                      {" • "}
                      Radius: {geofence.radiusMeters}m
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(geofence.id)}
                    disabled={deletingId === geofence.id}
                    className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 disabled:opacity-50 text-sm"
                  >
                    {deletingId === geofence.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Geofences;

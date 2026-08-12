import { useEffect, useState } from "react";

import { getVehicles, updateVehicle } from "../services/vehicleApi";

import type { Vehicle } from "../types/vehicle";

const VehicleLocation = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(
    null,
  );

  const [latitude, setLatitude] = useState("");

  const [longitude, setLongitude] = useState("");

  const [speed, setSpeed] = useState("0");

  const [loading, setLoading] = useState(true);

  const [updating, setUpdating] = useState(false);

  const [message, setMessage] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);

  /* -------------------------------- */
  /* Load vehicles */
  /* -------------------------------- */

  const loadVehicles = async () => {
    try {
      setLoading(true);

      const data = await getVehicles();

      setVehicles(data);

      if (selectedVehicleId === null && data.length > 0) {
        setSelectedVehicleId(data[0].id);

        setLatitude(String(data[0].latitude ?? ""));

        setLongitude(String(data[0].longitude ?? ""));

        setSpeed(String(data[0].speed ?? 0));
      }
    } catch (err) {
      console.error("Failed to load vehicles:", err);

      setError("Failed to load vehicles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  /* -------------------------------- */
  /* Select vehicle */
  /* -------------------------------- */

  const handleVehicleChange = (id: number) => {
    setSelectedVehicleId(id);

    const vehicle = vehicles.find((item) => item.id === id);

    if (!vehicle) {
      return;
    }

    setLatitude(String(vehicle.latitude ?? ""));

    setLongitude(String(vehicle.longitude ?? ""));

    setSpeed(String(vehicle.speed ?? 0));

    setMessage(null);
    setError(null);
  };

  /* -------------------------------- */
  /* Update location */
  /* -------------------------------- */

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setMessage(null);
    setError(null);

    if (selectedVehicleId === null) {
      setError("Select a vehicle first.");

      return;
    }

    const lat = Number(latitude);

    const lng = Number(longitude);

    const currentSpeed = Number(speed);

    if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
      setError("Latitude must be between -90 and 90.");

      return;
    }

    if (!Number.isFinite(lng) || lng < -180 || lng > 180) {
      setError("Longitude must be between -180 and 180.");

      return;
    }

    if (!Number.isFinite(currentSpeed) || currentSpeed < 0) {
      setError("Speed must be 0 or greater.");

      return;
    }

    const vehicle = vehicles.find((item) => item.id === selectedVehicleId);

    if (!vehicle) {
      setError("Selected vehicle was not found.");

      return;
    }

    try {
      setUpdating(true);

      await updateVehicle(selectedVehicleId, {
        vehicleNumber: vehicle.vehicleNumber,

        type: vehicle.type,

        status: vehicle.status,

        latitude: lat,

        longitude: lng,

        speed: currentSpeed,
      });

      setMessage("Vehicle location updated successfully.");

      await loadVehicles();
    } catch (err) {
      console.error("Failed to update vehicle location:", err);

      setError("Failed to update vehicle location.");
    } finally {
      setUpdating(false);
    }
  };

  /* -------------------------------- */
  /* Preset location */
  /* -------------------------------- */

  const setPreset = (presetLatitude: number, presetLongitude: number) => {
    setLatitude(String(presetLatitude));

    setLongitude(String(presetLongitude));

    setMessage(null);
    setError(null);
  };

  const selectedVehicle = vehicles.find(
    (vehicle) => vehicle.id === selectedVehicleId,
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] text-white">
      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}

        <div className="mb-8">
          <p className="text-cyan-400 text-sm font-medium mb-2">
            LIVE VEHICLE CONTROL
          </p>

          <h1 className="text-3xl md:text-4xl font-bold">Vehicle Location</h1>

          <p className="text-slate-400 mt-2">
            Update a vehicle's location to test real-time fleet tracking.
          </p>
        </div>

        {/* Messages */}

        {message && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
            {error}
          </div>
        )}

        {loading ? (
          <div className="bg-[#0d1b2a] border border-slate-800 rounded-2xl p-10 text-center text-slate-500">
            Loading vehicles...
          </div>
        ) : vehicles.length === 0 ? (
          <div className="bg-[#0d1b2a] border border-slate-800 rounded-2xl p-10 text-center">
            <div className="text-4xl mb-3">🚚</div>

            <h2 className="text-lg font-semibold">No vehicles found</h2>

            <p className="text-slate-500 mt-2">
              Create a vehicle before updating its location.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* -------------------------------- */}
            {/* Vehicle selection */}
            {/* -------------------------------- */}

            <section className="bg-[#0d1b2a] border border-slate-800 rounded-2xl p-6">
              <h2 className="text-lg font-semibold">Select Vehicle</h2>

              <p className="text-sm text-slate-500 mt-1 mb-6">
                Choose the vehicle whose location you want to update.
              </p>

              <div className="space-y-3">
                {vehicles.map((vehicle) => (
                  <button
                    key={vehicle.id}
                    type="button"
                    onClick={() => handleVehicleChange(vehicle.id)}
                    className={`w-full text-left p-4 rounded-xl border transition ${
                      selectedVehicleId === vehicle.id
                        ? "bg-cyan-500/10 border-cyan-500/40"
                        : "bg-[#07111f] border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{vehicle.vehicleNumber}</p>

                        <p className="text-xs text-slate-500 mt-1">
                          {vehicle.type}
                        </p>
                      </div>

                      <span
                        className={`text-xs ${
                          vehicle.status === "ACTIVE"
                            ? "text-emerald-400"
                            : vehicle.status === "MAINTENANCE"
                              ? "text-amber-400"
                              : "text-slate-500"
                        }`}
                      >
                        {vehicle.status}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* -------------------------------- */}
            {/* Location form */}
            {/* -------------------------------- */}

            <section className="bg-[#0d1b2a] border border-slate-800 rounded-2xl p-6">
              <h2 className="text-lg font-semibold">Update Location</h2>

              {selectedVehicle && (
                <p className="text-sm text-slate-500 mt-1 mb-6">
                  Updating{" "}
                  <span className="text-cyan-400">
                    {selectedVehicle.vehicleNumber}
                  </span>
                </p>
              )}

              <form onSubmit={handleUpdate} className="space-y-5">
                {/* Latitude */}

                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    Latitude
                  </label>

                  <input
                    type="number"
                    step="any"
                    value={latitude}
                    onChange={(event) => setLatitude(event.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-[#07111f] border border-slate-700 text-white outline-none focus:border-cyan-500 transition"
                  />
                </div>

                {/* Longitude */}

                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    Longitude
                  </label>

                  <input
                    type="number"
                    step="any"
                    value={longitude}
                    onChange={(event) => setLongitude(event.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-[#07111f] border border-slate-700 text-white outline-none focus:border-cyan-500 transition"
                  />
                </div>

                {/* Speed */}

                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    Speed (km/h)
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={speed}
                    onChange={(event) => setSpeed(event.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-[#07111f] border border-slate-700 text-white outline-none focus:border-cyan-500 transition"
                  />
                </div>

                {/* Presets */}

                <div>
                  <p className="text-sm text-slate-400 mb-3">Test Locations</p>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPreset(19.076, 72.8777)}
                      className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition"
                    >
                      Mumbai Center
                    </button>

                    <button
                      type="button"
                      onClick={() => setPreset(19.0765, 72.8782)}
                      className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition"
                    >
                      Nearby
                    </button>
                  </div>
                </div>

                {/* Current */}

                <div className="bg-[#07111f] border border-slate-800 rounded-xl p-4">
                  <p className="text-xs text-slate-500">Current coordinates</p>

                  <p className="text-sm text-cyan-400 mt-2">
                    {latitude || "-"}
                    {" , "}
                    {longitude || "-"}
                  </p>
                </div>

                {/* Submit */}

                <button
                  type="submit"
                  disabled={updating}
                  className="w-full px-4 py-3 rounded-lg bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {updating ? "Updating..." : "Update Vehicle Location"}
                </button>
              </form>
            </section>
          </div>
        )}

        {/* Warning */}

        <div className="mt-6 p-5 rounded-xl bg-amber-500/5 border border-amber-500/10">
          <p className="text-sm text-amber-400 font-medium">Geofence testing</p>

          <p className="text-xs text-slate-500 mt-2">
            This screen currently updates the vehicle through your existing
            <code className="mx-1 text-slate-400">
              PUT /api/vehicles/{`{id}`}
            </code>
            endpoint. ENTRY/EXIT detection must be implemented in the backend
            before moving a vehicle will generate geofence events.
          </p>
        </div>
      </main>
    </div>
  );
};

export default VehicleLocation;

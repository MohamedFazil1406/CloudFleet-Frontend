import { useEffect, useState } from "react";

import {
  createVehicle,
  deleteVehicle,
  getVehicles,
  updateVehicle,
} from "../services/vehicleApi";

import type { Vehicle, VehicleRequest, VehicleStatus } from "../types/vehicle";

const emptyForm: VehicleRequest = {
  vehicleNumber: "",
  type: "TRUCK",
  status: "ACTIVE",
  latitude: 19.076,
  longitude: 72.8777,
  speed: 0,
};

const Vehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  const [form, setForm] = useState<VehicleRequest>(emptyForm);

  const [editingId, setEditingId] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [success, setSuccess] = useState<string | null>(null);

  /* -------------------------------- */
  /* Load vehicles */
  /* -------------------------------- */

  const loadVehicles = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getVehicles();

      setVehicles(Array.isArray(data) ? data : []);
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
  /* Form change */
  /* -------------------------------- */

  const updateField = <K extends keyof VehicleRequest>(
    field: K,
    value: VehicleRequest[K],
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  /* -------------------------------- */
  /* Reset form */
  /* -------------------------------- */

  const resetForm = () => {
    setForm({
      ...emptyForm,
    });

    setEditingId(null);
  };

  /* -------------------------------- */
  /* Submit */
  /* -------------------------------- */

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError(null);
    setSuccess(null);

    if (!form.vehicleNumber.trim()) {
      setError("Vehicle number is required.");
      return;
    }

    if (form.latitude < -90 || form.latitude > 90) {
      setError("Latitude must be between -90 and 90.");
      return;
    }

    if (form.longitude < -180 || form.longitude > 180) {
      setError("Longitude must be between -180 and 180.");
      return;
    }

    if (form.speed < 0) {
      setError("Speed cannot be negative.");
      return;
    }

    try {
      setSaving(true);

      if (editingId !== null) {
        await updateVehicle(editingId, form);

        setSuccess("Vehicle updated successfully.");
      } else {
        await createVehicle(form);

        setSuccess("Vehicle created successfully.");
      }

      resetForm();

      await loadVehicles();
    } catch (err) {
      console.error("Failed to save vehicle:", err);

      setError("Failed to save vehicle. Check the backend response.");
    } finally {
      setSaving(false);
    }
  };

  /* -------------------------------- */
  /* Edit */
  /* -------------------------------- */

  const handleEdit = (vehicle: Vehicle) => {
    setEditingId(vehicle.id);

    setForm({
      vehicleNumber: vehicle.vehicleNumber,

      type: vehicle.type,

      status: vehicle.status,

      latitude: vehicle.latitude ?? 0,

      longitude: vehicle.longitude ?? 0,

      speed: vehicle.speed ?? 0,
    });

    setError(null);
    setSuccess(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* -------------------------------- */
  /* Delete */
  /* -------------------------------- */

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this vehicle?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError(null);

      await deleteVehicle(id);

      setSuccess("Vehicle deleted successfully.");

      if (editingId === id) {
        resetForm();
      }

      await loadVehicles();
    } catch (err) {
      console.error("Failed to delete vehicle:", err);

      setError("Failed to delete vehicle.");
    }
  };

  /* -------------------------------- */
  /* Status style */
  /* -------------------------------- */

  const getStatusStyle = (status: VehicleStatus) => {
    switch (status) {
      case "ACTIVE":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";

      case "MAINTENANCE":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";

      case "INACTIVE":
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] text-white">
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* -------------------------------- */}
        {/* Header */}
        {/* -------------------------------- */}

        <div className="mb-8">
          <p className="text-cyan-400 text-sm font-medium mb-2">
            FLEET MANAGEMENT
          </p>

          <h1 className="text-3xl md:text-4xl font-bold">Vehicles</h1>

          <p className="text-slate-400 mt-2">
            Register and manage your fleet vehicles.
          </p>
        </div>

        {/* -------------------------------- */}
        {/* Messages */}
        {/* -------------------------------- */}

        {success && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
            {error}
          </div>
        )}

        {/* -------------------------------- */}
        {/* Vehicle Form */}
        {/* -------------------------------- */}

        <section className="bg-[#0d1b2a] border border-slate-800 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold">
                {editingId !== null ? "Edit Vehicle" : "Register Vehicle"}
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Enter vehicle information and its current location.
              </p>
            </div>

            {editingId !== null && (
              <button
                type="button"
                onClick={resetForm}
                className="text-sm text-slate-400 hover:text-white transition"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {/* Vehicle Number */}

            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Vehicle Number
              </label>

              <input
                type="text"
                value={form.vehicleNumber}
                onChange={(event) =>
                  updateField("vehicleNumber", event.target.value)
                }
                placeholder="MH-01-AB-1234"
                className="w-full px-4 py-3 rounded-lg bg-[#07111f] border border-slate-700 text-white placeholder:text-slate-600 outline-none focus:border-cyan-500 transition"
              />
            </div>

            {/* Type */}

            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Vehicle Type
              </label>

              <select
                value={form.type}
                onChange={(event) => updateField("type", event.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-[#07111f] border border-slate-700 text-white outline-none focus:border-cyan-500 transition"
              >
                <option value="TRUCK">Truck</option>

                <option value="VAN">Van</option>

                <option value="CAR">Car</option>

                <option value="BIKE">Bike</option>

                <option value="BUS">Bus</option>
              </select>
            </div>

            {/* Status */}

            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Status
              </label>

              <select
                value={form.status}
                onChange={(event) =>
                  updateField("status", event.target.value as VehicleStatus)
                }
                className="w-full px-4 py-3 rounded-lg bg-[#07111f] border border-slate-700 text-white outline-none focus:border-cyan-500 transition"
              >
                <option value="ACTIVE">Active</option>

                <option value="INACTIVE">Inactive</option>

                <option value="MAINTENANCE">Maintenance</option>
              </select>
            </div>

            {/* Latitude */}

            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Latitude
              </label>

              <input
                type="number"
                step="any"
                value={form.latitude}
                onChange={(event) =>
                  updateField("latitude", Number(event.target.value))
                }
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
                value={form.longitude}
                onChange={(event) =>
                  updateField("longitude", Number(event.target.value))
                }
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
                value={form.speed}
                onChange={(event) =>
                  updateField("speed", Number(event.target.value))
                }
                className="w-full px-4 py-3 rounded-lg bg-[#07111f] border border-slate-700 text-white outline-none focus:border-cyan-500 transition"
              />
            </div>

            {/* Submit */}

            <div className="md:col-span-2 lg:col-span-3 flex justify-end gap-3">
              {editingId !== null && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
              )}

              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 rounded-lg bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {saving
                  ? "Saving..."
                  : editingId !== null
                    ? "Update Vehicle"
                    : "Register Vehicle"}
              </button>
            </div>
          </form>
        </section>

        {/* -------------------------------- */}
        {/* Vehicle List */}
        {/* -------------------------------- */}

        <section className="bg-[#0d1b2a] border border-slate-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Fleet Vehicles</h2>

                <p className="text-sm text-slate-500 mt-1">
                  {vehicles.length} vehicle
                  {vehicles.length !== 1 ? "s" : ""} registered
                </p>
              </div>

              <button
                type="button"
                onClick={loadVehicles}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition text-sm"
              >
                Refresh
              </button>
            </div>
          </div>

          {loading ? (
            <div className="px-6 py-16 text-center text-slate-500">
              Loading vehicles...
            </div>
          ) : vehicles.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="text-4xl mb-3">🚚</div>

              <h3 className="text-slate-300 font-medium">
                No vehicles registered
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Register your first vehicle using the form above.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#07111f]">
                  <tr className="text-xs uppercase tracking-wider text-slate-500">
                    <th className="px-6 py-4">Vehicle</th>

                    <th className="px-6 py-4">Type</th>

                    <th className="px-6 py-4">Status</th>

                    <th className="px-6 py-4">Location</th>

                    <th className="px-6 py-4">Speed</th>

                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {vehicles.map((vehicle) => (
                    <tr
                      key={vehicle.id}
                      className="border-t border-slate-800 hover:bg-slate-800/30 transition"
                    >
                      {/* Vehicle */}

                      <td className="px-6 py-4">
                        <div className="font-medium text-white">
                          {vehicle.vehicleNumber}
                        </div>

                        <div className="text-xs text-slate-500 mt-1">
                          ID: {vehicle.id}
                        </div>
                      </td>

                      {/* Type */}

                      <td className="px-6 py-4 text-slate-300">
                        {vehicle.type}
                      </td>

                      {/* Status */}

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full border text-xs font-medium ${getStatusStyle(
                            vehicle.status,
                          )}`}
                        >
                          {vehicle.status}
                        </span>
                      </td>

                      {/* Location */}

                      <td className="px-6 py-4">
                        {vehicle.latitude !== null &&
                        vehicle.longitude !== null ? (
                          <div className="text-sm">
                            <div className="text-slate-300">
                              {vehicle.latitude}
                            </div>

                            <div className="text-xs text-slate-500">
                              {vehicle.longitude}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-500">No location</span>
                        )}
                      </td>

                      {/* Speed */}

                      <td className="px-6 py-4 text-slate-300">
                        {vehicle.speed ?? 0} km/h
                      </td>

                      {/* Actions */}

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(vehicle)}
                            className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 text-xs transition"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(vehicle.id)}
                            className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 text-xs transition"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Vehicles;

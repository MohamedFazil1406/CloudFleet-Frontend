import { useEffect, useState } from "react";
import { getVehicles } from "../services/vehicleApi";
import type { Vehicle } from "../types/dashboard";

const Vehicles = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadVehicles = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await getVehicles();

                setVehicles(data);
            } catch (err) {
                console.error(
                    "Failed to load vehicles:",
                    err
                );

                setError("Failed to load vehicles");
            } finally {
                setLoading(false);
            }
        };

        loadVehicles();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
                <div className="text-center">

                    <div className="w-10 h-10 border-4 border-slate-700 border-t-cyan-400 rounded-full animate-spin mx-auto" />

                    <p className="text-slate-400 mt-4">
                        Loading vehicles...
                    </p>

                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6">
                <div className="text-center">

                    <div className="w-12 h-12 mx-auto rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center text-xl">
                        !
                    </div>

                    <h2 className="text-xl font-semibold text-white mt-4">
                        Unable to load vehicles
                    </h2>

                    <p className="text-slate-500 mt-2">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="mt-6 px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 font-medium hover:bg-cyan-400 transition"
                    >
                        Try Again
                    </button>

                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] text-white">

            <main className="max-w-7xl mx-auto px-6 py-8">

                {/* Header */}
                <div className="mb-8">

                    <p className="text-cyan-400 text-sm font-medium mb-2">
                        FLEET MANAGEMENT
                    </p>

                    <h1 className="text-3xl md:text-4xl font-bold">
                        Vehicles
                    </h1>

                    <p className="text-slate-400 mt-2">
                        Monitor and manage your fleet vehicles.
                    </p>

                </div>

                {/* Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">

                    <SummaryCard
                        title="Total Vehicles"
                        value={vehicles.length}
                        icon="🚚"
                    />

                    <SummaryCard
                        title="Active"
                        value={
                            vehicles.filter(
                                (vehicle) =>
                                    vehicle.status?.toLowerCase() ===
                                    "active"
                            ).length
                        }
                        icon="✓"
                    />

                    <SummaryCard
                        title="With Location"
                        value={
                            vehicles.filter(
                                (vehicle) =>
                                    vehicle.latitude != null &&
                                    vehicle.longitude != null
                            ).length
                        }
                        icon="📍"
                    />

                </div>

                {/* Vehicle table */}
                <section className="bg-[#0d1b2a] border border-slate-800 rounded-2xl overflow-hidden">

                    <div className="px-6 py-5 border-b border-slate-800">
                        <h2 className="text-lg font-semibold">
                            Fleet Vehicles
                        </h2>

                        <p className="text-sm text-slate-500 mt-1">
                            {vehicles.length} vehicles registered
                        </p>
                    </div>

                    {vehicles.length === 0 ? (

                        <div className="px-6 py-16 text-center">

                            <div className="text-4xl">
                                🚚
                            </div>

                            <h3 className="text-slate-300 font-medium mt-4">
                                No vehicles found
                            </h3>

                            <p className="text-sm text-slate-500 mt-2">
                                Registered vehicles will appear here.
                            </p>

                        </div>

                    ) : (

                        <div className="overflow-x-auto">

                            <table className="w-full text-left">

                                <thead className="bg-[#0a1725]">

                                <tr className="text-xs uppercase tracking-wider text-slate-500">

                                    <th className="px-6 py-4">
                                        ID
                                    </th>

                                    <th className="px-6 py-4">
                                        Vehicle
                                    </th>

                                    <th className="px-6 py-4">
                                        Status
                                    </th>

                                    <th className="px-6 py-4">
                                        Latitude
                                    </th>

                                    <th className="px-6 py-4">
                                        Longitude
                                    </th>

                                </tr>

                                </thead>

                                <tbody>

                                {vehicles.map((vehicle) => (

                                    <tr
                                        key={vehicle.id}
                                        className="border-t border-slate-800 hover:bg-slate-800/30 transition"
                                    >

                                        <td className="px-6 py-4 text-slate-500">
                                            #{vehicle.id}
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-200">
                                                {vehicle.vehicleNumber ??
                                                    `Vehicle #${vehicle.id}`}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <StatusBadge
                                                status={vehicle.status}
                                            />
                                        </td>

                                        <td className="px-6 py-4 text-slate-400 font-mono text-sm">
                                            {vehicle.latitude ?? "-"}
                                        </td>

                                        <td className="px-6 py-4 text-slate-400 font-mono text-sm">
                                            {vehicle.longitude ?? "-"}
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

/* -------------------------------- */
/* Summary Card */
/* -------------------------------- */

interface SummaryCardProps {
    title: string;
    value: number;
    icon: string;
}

const SummaryCard = ({
                         title,
                         value,
                         icon,
                     }: SummaryCardProps) => {
    return (
        <div className="bg-[#0d1b2a] border border-slate-800 rounded-2xl p-6">

            <div className="flex items-center justify-between">

                <p className="text-sm text-slate-400">
                    {title}
                </p>

                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                    {icon}
                </div>

            </div>

            <p className="text-3xl font-bold text-cyan-400 mt-5">
                {value}
            </p>

        </div>
    );
};

/* -------------------------------- */
/* Status Badge */
/* -------------------------------- */

interface StatusBadgeProps {
    status?: string;
}

const StatusBadge = ({
                         status,
                     }: StatusBadgeProps) => {
    const active =
        status?.toLowerCase() === "active";

    return (
        <span
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs border ${
                active
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                    : "bg-slate-800 border-slate-700 text-slate-400"
            }`}
        >
            <span
                className={`w-1.5 h-1.5 rounded-full ${
                    active
                        ? "bg-emerald-400"
                        : "bg-slate-500"
                }`}
            />

            {status ?? "Unknown"}
        </span>
    );
};

export default Vehicles;
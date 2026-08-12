import { useEffect, useState } from "react";
import { getDashboard } from "../services/dashboardApi";
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

                const data = await getDashboard();

                setVehicles(data.vehicles);
            } catch (err) {
                console.error("Failed to load vehicles:", err);
                setError("Failed to load vehicles");
            } finally {
                setLoading(false);
            }
        };

        loadVehicles();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#07111f] flex items-center justify-center">
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
            <div className="min-h-screen bg-[#07111f] flex items-center justify-center px-6">
                <div className="bg-[#0d1b2a] border border-red-500/20 rounded-2xl p-8 text-center">
                    <div className="text-red-400 text-4xl mb-4">
                        !
                    </div>

                    <h2 className="text-xl font-semibold text-white">
                        Unable to load vehicles
                    </h2>

                    <p className="text-slate-400 mt-2">
                        {error}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#07111f] text-white">

            {/* Header */}
            <header className="border-b border-slate-800/80 bg-[#091624]">
                <div className="max-w-7xl mx-auto px-6 py-5">

                    <p className="text-cyan-400 text-sm font-medium">
                        FLEET
                    </p>

                    <h1 className="text-3xl font-bold mt-1">
                        Vehicles
                    </h1>

                    <p className="text-slate-400 mt-2">
                        Monitor all registered vehicles in your fleet.
                    </p>

                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">

                {/* Summary */}
                <div className="bg-[#0d1b2a] border border-slate-800 rounded-2xl p-6 mb-6">

                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-sm text-slate-500">
                                Total Vehicles
                            </p>

                            <p className="text-4xl font-bold text-cyan-400 mt-2">
                                {vehicles.length}
                            </p>
                        </div>

                        <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 text-xl">
                            🚚
                        </div>

                    </div>

                </div>

                {/* Vehicle Table */}
                <div className="bg-[#0d1b2a] border border-slate-800 rounded-2xl overflow-hidden">

                    <div className="px-6 py-5 border-b border-slate-800">

                        <h2 className="text-lg font-semibold">
                            Vehicle List
                        </h2>

                        <p className="text-sm text-slate-500 mt-1">
                            Current vehicle information
                        </p>

                    </div>

                    {vehicles.length === 0 ? (

                        <div className="px-6 py-16 text-center">

                            <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-800 flex items-center justify-center text-2xl">
                                🚚
                            </div>

                            <h3 className="text-lg font-medium text-slate-300 mt-5">
                                No vehicles found
                            </h3>

                            <p className="text-slate-500 text-sm mt-2 max-w-md mx-auto">
                                There are currently no vehicles registered in
                                CloudFleet.
                            </p>

                        </div>

                    ) : (

                        <div className="overflow-x-auto">

                            <table className="w-full">

                                <thead className="bg-[#0a1725]">

                                <tr className="text-left text-xs uppercase tracking-wider text-slate-500">

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

                                        <td className="px-6 py-4 font-medium">
                                            {vehicle.vehicleNumber ?? "-"}
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

                </div>

            </main>
        </div>
    );
};

interface StatusBadgeProps {
    status?: string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {

    const active = status?.toLowerCase() === "active";

    return (
        <span
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs border ${
                active
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-slate-800 text-slate-400 border-slate-700"
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
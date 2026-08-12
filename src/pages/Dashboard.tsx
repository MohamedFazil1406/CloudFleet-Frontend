import { useEffect, useState } from "react";

import { getDashboard } from "../services/dashboardApi";
import type { DashboardResponse } from "../types/dashboard";

import { useWebSocket } from "../hooks/useWebSocket";
import ConnectionStatus from "../components/ConnectionStatus";
import FleetMap from "../components/FleetMap";

const Dashboard = () => {
    const [dashboard, setDashboard] =
        useState<DashboardResponse | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    /*
     * WebSocket connection
     */
    const { connected } = useWebSocket({
        onMessage: (message) => {
            console.log("Realtime update:", message);

            /*
             * We will handle vehicle location,
             * vehicle status and alerts here next.
             */
        },
    });

    /*
     * Load dashboard data
     */
    useEffect(() => {
        const loadDashboard = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await getDashboard();

                setDashboard(data);
            } catch (err) {
                console.error(
                    "Failed to load dashboard:",
                    err
                );

                setError("Failed to load dashboard");
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    /*
     * Loading state
     */
    if (loading) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
                <div className="text-center">

                    <div className="w-10 h-10 border-4 border-slate-700 border-t-cyan-400 rounded-full animate-spin mx-auto" />

                    <p className="text-slate-400 mt-4">
                        Loading CloudFleet...
                    </p>

                </div>
            </div>
        );
    }

    /*
     * Error state
     */
    if (error) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6">

                <div className="bg-[#0d1b2a] border border-red-500/20 rounded-2xl p-8 text-center max-w-md">

                    <div className="w-12 h-12 mx-auto rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 text-2xl">
                        !
                    </div>

                    <h2 className="text-xl font-semibold text-white mt-4">
                        Unable to load dashboard
                    </h2>

                    <p className="text-slate-400 mt-2">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            window.location.reload()
                        }
                        className="mt-6 px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 font-medium hover:bg-cyan-400 transition"
                    >
                        Try Again
                    </button>

                </div>

            </div>
        );
    }

    /*
     * No dashboard data
     */
    if (!dashboard) {
        return null;
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] text-white">

            <main className="max-w-7xl mx-auto px-6 py-8">

                {/* ================================= */}
                {/* Page Header */}
                {/* ================================= */}

                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">

                    <div>

                        <p className="text-cyan-400 text-sm font-medium mb-2">
                            OVERVIEW
                        </p>

                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                            Fleet Dashboard
                        </h1>

                        <p className="text-slate-400 mt-2">
                            Monitor vehicles, activity and alerts in real time.
                        </p>

                    </div>

                    <ConnectionStatus
                        connected={connected}
                    />

                </div>

                {/* ================================= */}
                {/* Statistics */}
                {/* ================================= */}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

                    <StatCard
                        title="Total Vehicles"
                        value={dashboard.totalVehicles}
                        icon="🚚"
                        accent="cyan"
                    />

                    <StatCard
                        title="Active Vehicles"
                        value={dashboard.activeVehicles}
                        icon="✓"
                        accent="green"
                    />

                    <StatCard
                        title="Inactive Vehicles"
                        value={dashboard.inactiveVehicles}
                        icon="◷"
                        accent="amber"
                    />

                    <StatCard
                        title="Total Alerts"
                        value={dashboard.totalAlerts}
                        icon="!"
                        accent="red"
                    />

                </div>

                {/* ================================= */}
                {/* Fleet Map */}
                {/* ================================= */}

                <div className="mt-8">

                    <FleetMap
                        vehicles={dashboard.vehicles}
                    />

                </div>

                {/* ================================= */}
                {/* Vehicles */}
                {/* ================================= */}

                <section className="mt-8 bg-[#0d1b2a] border border-slate-800 rounded-2xl overflow-hidden shadow-xl shadow-black/10">

                    {/* Section Header */}

                    <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">

                        <div>

                            <h2 className="text-lg font-semibold">
                                Vehicles
                            </h2>

                            <p className="text-sm text-slate-500 mt-1">
                                Current fleet status
                            </p>

                        </div>

                        <span className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 text-sm">
                            {dashboard.totalVehicles} total
                        </span>

                    </div>

                    {/* Vehicle Content */}

                    {dashboard.vehicles.length === 0 ? (

                        <EmptyState
                            icon="🚚"
                            title="No vehicles available"
                            description="Vehicles will appear here once they are registered."
                        />

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

                                {dashboard.vehicles.map(
                                    (vehicle) => (
                                        <tr
                                            key={vehicle.id}
                                            className="border-t border-slate-800 hover:bg-slate-800/30 transition"
                                        >

                                            <td className="px-6 py-4 text-slate-500">
                                                #{vehicle.id}
                                            </td>

                                            <td className="px-6 py-4 font-medium text-slate-200">
                                                {vehicle.vehicleNumber ??
                                                    "-"}
                                            </td>

                                            <td className="px-6 py-4">

                                                <StatusBadge
                                                    status={
                                                        vehicle.status
                                                    }
                                                />

                                            </td>

                                            <td className="px-6 py-4 text-slate-400 font-mono text-sm">
                                                {vehicle.latitude ??
                                                    "-"}
                                            </td>

                                            <td className="px-6 py-4 text-slate-400 font-mono text-sm">
                                                {vehicle.longitude ??
                                                    "-"}
                                            </td>

                                        </tr>
                                    )
                                )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </section>

                {/* ================================= */}
                {/* Recent Alerts */}
                {/* ================================= */}

                <section className="mt-6 bg-[#0d1b2a] border border-slate-800 rounded-2xl overflow-hidden shadow-xl shadow-black/10">

                    {/* Alert Header */}

                    <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">

                        <div>

                            <h2 className="text-lg font-semibold">
                                Recent Alerts
                            </h2>

                            <p className="text-sm text-slate-500 mt-1">
                                Latest fleet notifications
                            </p>

                        </div>

                        <span className="px-3 py-1 rounded-lg bg-red-500/10 text-red-400 text-sm">
                            {dashboard.totalAlerts} alerts
                        </span>

                    </div>

                    {/* Alerts Content */}

                    {dashboard.recentAlerts.length === 0 ? (

                        <EmptyState
                            icon="✓"
                            title="No recent alerts"
                            description="Everything looks good. New alerts will appear here."
                        />

                    ) : (

                        <div>

                            {dashboard.recentAlerts.map(
                                (alert) => (

                                    <div
                                        key={alert.id}
                                        className="px-6 py-5 border-b border-slate-800 last:border-b-0 hover:bg-slate-800/20 transition"
                                    >

                                        <div className="flex items-start gap-4">

                                            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center shrink-0">
                                                !
                                            </div>

                                            <div className="flex-1">

                                                <p className="font-medium text-slate-200">
                                                    {alert.message ??
                                                        "Fleet alert"}
                                                </p>

                                                <div className="flex flex-wrap gap-3 mt-2">

                                                    {alert.type && (
                                                        <span className="text-xs px-2.5 py-1 rounded-md bg-slate-800 text-slate-400">
                                                            {
                                                                alert.type
                                                            }
                                                        </span>
                                                    )}

                                                    {alert.createdAt && (
                                                        <span className="text-xs text-slate-500">
                                                            {new Date(
                                                                alert.createdAt
                                                            ).toLocaleString()}
                                                        </span>
                                                    )}

                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </section>

            </main>

        </div>
    );
};

/* ================================= */
/* Stat Card */
/* ================================= */

interface StatCardProps {
    title: string;
    value: number;
    icon: string;
    accent:
        | "cyan"
        | "green"
        | "amber"
        | "red";
}

const StatCard = ({
                      title,
                      value,
                      icon,
                      accent,
                  }: StatCardProps) => {

    const accentStyles = {

        cyan: {
            icon:
                "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
            number: "text-cyan-400",
        },

        green: {
            icon:
                "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
            number: "text-emerald-400",
        },

        amber: {
            icon:
                "bg-amber-500/10 text-amber-400 border-amber-500/20",
            number: "text-amber-400",
        },

        red: {
            icon:
                "bg-red-500/10 text-red-400 border-red-500/20",
            number: "text-red-400",
        },

    };

    const style = accentStyles[accent];

    return (
        <div className="bg-[#0d1b2a] border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition">

            <div className="flex items-center justify-between">

                <p className="text-sm text-slate-400">
                    {title}
                </p>

                <div
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center ${style.icon}`}
                >
                    {icon}
                </div>

            </div>

            <p
                className={`text-4xl font-bold mt-5 ${style.number}`}
            >
                {value}
            </p>

            <p className="text-xs text-slate-600 mt-2">
                Current count
            </p>

        </div>
    );
};

/* ================================= */
/* Status Badge */
/* ================================= */

interface StatusBadgeProps {
    status?: string;
}

const StatusBadge = ({
                         status,
                     }: StatusBadgeProps) => {

    const normalizedStatus =
        status?.toLowerCase();

    if (normalizedStatus === "active") {
        return (
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">

                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />

                Active

            </span>
        );
    }

    return (
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-xs">

            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />

            {status ?? "Unknown"}

        </span>
    );
};

/* ================================= */
/* Empty State */
/* ================================= */

interface EmptyStateProps {
    icon: string;
    title: string;
    description: string;
}

const EmptyState = ({
                        icon,
                        title,
                        description,
                    }: EmptyStateProps) => {

    return (
        <div className="px-6 py-14 text-center">

            <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-800/70 flex items-center justify-center text-2xl">
                {icon}
            </div>

            <h3 className="text-slate-300 font-medium mt-4">
                {title}
            </h3>

            <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
                {description}
            </p>

        </div>
    );
};

export default Dashboard;
import { useEffect, useState } from "react";
import { getAlerts, type Alert } from "../services/alertApi";

const Alerts = () => {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadAlerts = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await getAlerts();

                setAlerts(data);
            } catch (err) {
                console.error("Failed to load alerts:", err);
                setError("Failed to load alerts");
            } finally {
                setLoading(false);
            }
        };

        loadAlerts();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-slate-700 border-t-cyan-400 rounded-full animate-spin mx-auto" />

                    <p className="text-slate-400 mt-4">
                        Loading alerts...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6">
                <div className="bg-[#0d1b2a] border border-red-500/20 rounded-2xl p-8 text-center max-w-md">
                    <div className="w-12 h-12 mx-auto rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 text-xl">
                        !
                    </div>

                    <h2 className="text-xl font-semibold text-white mt-4">
                        Unable to load alerts
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

    const geofenceAlerts = alerts.filter((alert) =>
        alert.type?.toLowerCase().includes("geofence")
    );

    const otherAlerts = alerts.filter(
        (alert) =>
            !alert.type?.toLowerCase().includes("geofence")
    );

    return (
        <div className="min-h-[calc(100vh-4rem)] text-white">
            <main className="max-w-7xl mx-auto px-6 py-8">

                {/* Header */}
                <div className="mb-8">
                    <p className="text-red-400 text-sm font-medium mb-2">
                        MONITORING
                    </p>

                    <h1 className="text-3xl md:text-4xl font-bold">
                        Alerts
                    </h1>

                    <p className="text-slate-400 mt-2">
                        Monitor vehicle and geofence activity.
                    </p>
                </div>

                {/* Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">

                    <SummaryCard
                        title="Total Alerts"
                        value={alerts.length}
                        icon="!"
                    />

                    <SummaryCard
                        title="Geofence Alerts"
                        value={geofenceAlerts.length}
                        icon="📍"
                    />

                    <SummaryCard
                        title="Other Alerts"
                        value={otherAlerts.length}
                        icon="⚠"
                    />

                </div>

                {/* Alerts */}
                <section className="bg-[#0d1b2a] border border-slate-800 rounded-2xl overflow-hidden">

                    <div className="px-6 py-5 border-b border-slate-800">
                        <h2 className="text-lg font-semibold">
                            Alert History
                        </h2>

                        <p className="text-sm text-slate-500 mt-1">
                            Recent fleet notifications and events
                        </p>
                    </div>

                    {alerts.length === 0 ? (
                        <div className="px-6 py-16 text-center">

                            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-2xl">
                                ✓
                            </div>

                            <h3 className="text-slate-300 font-medium mt-4">
                                No alerts
                            </h3>

                            <p className="text-sm text-slate-500 mt-2">
                                Your fleet currently has no recorded alerts.
                            </p>

                        </div>
                    ) : (
                        <div>
                            {alerts.map((alert) => (
                                <AlertRow
                                    key={alert.id}
                                    alert={alert}
                                />
                            ))}
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

                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                    {icon}
                </div>
            </div>

            <p className="text-3xl font-bold text-red-400 mt-5">
                {value}
            </p>

        </div>
    );
};

/* -------------------------------- */
/* Alert Row */
/* -------------------------------- */

interface AlertRowProps {
    alert: Alert;
}

const AlertRow = ({ alert }: AlertRowProps) => {
    const isGeofence = alert.type
        ?.toLowerCase()
        .includes("geofence");

    return (
        <div className="px-6 py-5 border-t border-slate-800 first:border-t-0 hover:bg-slate-800/20 transition">

            <div className="flex items-start gap-4">

                <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isGeofence
                            ? "bg-cyan-500/10 border border-cyan-500/20 text-cyan-400"
                            : "bg-red-500/10 border border-red-500/20 text-red-400"
                    }`}
                >
                    {isGeofence ? "📍" : "!"}
                </div>

                <div className="flex-1 min-w-0">

                    <div className="flex flex-wrap items-center gap-3">

                        <h3 className="font-medium text-slate-200">
                            {alert.message ?? "Fleet alert"}
                        </h3>

                        {alert.type && (
                            <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-400 text-xs">
                                {alert.type}
                            </span>
                        )}

                    </div>

                    <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-500">

                        {alert.vehicleNumber && (
                            <span>
                                Vehicle:{" "}
                                <span className="text-slate-400">
                                    {alert.vehicleNumber}
                                </span>
                            </span>
                        )}

                        {alert.vehicleId !== undefined && (
                            <span>
                                Vehicle ID:{" "}
                                <span className="text-slate-400">
                                    #{alert.vehicleId}
                                </span>
                            </span>
                        )}

                        {alert.createdAt && (
                            <span>
                                {new Date(
                                    alert.createdAt
                                ).toLocaleString()}
                            </span>
                        )}

                    </div>

                </div>

            </div>

        </div>
    );
};

export default Alerts;
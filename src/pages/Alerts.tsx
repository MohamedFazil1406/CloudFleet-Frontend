import { useEffect, useState } from "react";
import { getDashboard } from "../services/dashboardApi";
import type { Alert } from "../types/dashboard";

const Alerts = () => {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadAlerts = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await getDashboard();
                setAlerts(data.recentAlerts);
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
            <div className="min-h-screen bg-[#07111f] flex items-center justify-center">
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
            <div className="min-h-screen bg-[#07111f] flex items-center justify-center">
                <div className="bg-[#0d1b2a] border border-red-500/20 rounded-2xl p-8 text-center">
                    <div className="text-red-400 text-3xl mb-3">
                        !
                    </div>

                    <h2 className="text-white text-xl font-semibold">
                        Unable to load alerts
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
                <div className="max-w-7xl mx-auto px-6 py-6">

                    <p className="text-red-400 text-sm font-medium">
                        MONITORING
                    </p>

                    <h1 className="text-3xl font-bold mt-1">
                        Alerts
                    </h1>

                    <p className="text-slate-400 mt-2">
                        Monitor recent fleet alerts and system events.
                    </p>

                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">

                {/* Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">

                    <div className="bg-[#0d1b2a] border border-slate-800 rounded-2xl p-6">

                        <p className="text-sm text-slate-500">
                            Recent Alerts
                        </p>

                        <p className="text-4xl font-bold text-red-400 mt-2">
                            {alerts.length}
                        </p>

                    </div>

                    <div className="bg-[#0d1b2a] border border-slate-800 rounded-2xl p-6">

                        <p className="text-sm text-slate-500">
                            Status
                        </p>

                        <div className="flex items-center gap-2 mt-4">
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />

                            <span className="text-emerald-400">
                                System Operational
                            </span>
                        </div>

                    </div>

                    <div className="bg-[#0d1b2a] border border-slate-800 rounded-2xl p-6">

                        <p className="text-sm text-slate-500">
                            Monitoring
                        </p>

                        <p className="text-white font-medium mt-4">
                            Real-time
                        </p>

                    </div>

                </div>

                {/* Alerts */}
                <div className="bg-[#0d1b2a] border border-slate-800 rounded-2xl overflow-hidden">

                    <div className="px-6 py-5 border-b border-slate-800">

                        <h2 className="text-lg font-semibold">
                            Recent Alerts
                        </h2>

                        <p className="text-sm text-slate-500 mt-1">
                            Latest events reported by CloudFleet.
                        </p>

                    </div>

                    {alerts.length === 0 ? (

                        <div className="px-6 py-16 text-center">

                            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                <span className="text-emerald-400 text-2xl">
                                    ✓
                                </span>
                            </div>

                            <h3 className="text-lg font-medium text-slate-300 mt-5">
                                No recent alerts
                            </h3>

                            <p className="text-sm text-slate-500 mt-2">
                                Your fleet is currently operating without
                                reported alerts.
                            </p>

                        </div>

                    ) : (

                        <div>

                            {alerts.map((alert) => (

                                <div
                                    key={alert.id}
                                    className="px-6 py-5 border-b border-slate-800 last:border-b-0 hover:bg-slate-800/20 transition"
                                >

                                    <div className="flex items-start gap-4">

                                        <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0">
                                            !
                                        </div>

                                        <div className="flex-1">

                                            <div className="flex flex-wrap items-center gap-3">

                                                <h3 className="font-medium text-slate-200">
                                                    {alert.message ?? "Fleet Alert"}
                                                </h3>

                                                {alert.type && (
                                                    <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-400 text-xs">
                                                        {alert.type}
                                                    </span>
                                                )}

                                            </div>

                                            {alert.createdAt && (
                                                <p className="text-xs text-slate-500 mt-2">
                                                    {new Date(
                                                        alert.createdAt
                                                    ).toLocaleString()}
                                                </p>
                                            )}

                                        </div>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </div>

            </main>
        </div>
    );
};

export default Alerts;
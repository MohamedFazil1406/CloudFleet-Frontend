import { useEffect, useState } from "react";

import { getAlerts } from "../services/alertApi";
import type { Alert } from "../types/alert";

import { useWebSocket } from "../hooks/useWebSocket";
import type { WebSocketMessage } from "../types/websocket";

const Alerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* -------------------------------- */
  /* Load alerts */
  /* -------------------------------- */

  const loadAlerts = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getAlerts();

      setAlerts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load alerts:", err);

      setError("Failed to load alerts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  /* -------------------------------- */
  /* WebSocket */
  /* -------------------------------- */

  const handleWebSocketMessage = (message: WebSocketMessage) => {
    console.log("WebSocket message:", message);

    const messageType = String(message.type).toUpperCase();

    /*
     * Accept alert messages from the backend.
     */
    if (
      messageType !== "ALERT" &&
      messageType !== "GEOFENCE_ALERT" &&
      messageType !== "GEOFENCE_ENTER" &&
      messageType !== "GEOFENCE_EXIT"
    ) {
      return;
    }

    const data = message.data as Partial<Alert>;

    if (!data.vehicleId || !data.geofenceId) {
      return;
    }

    const newAlert: Alert = {
      id: data.id ?? Date.now(),

      vehicleId: data.vehicleId,

      geofenceId: data.geofenceId,

      geofenceName: data.geofenceName ?? "Unknown Geofence",

      type: data.type === "GEOFENCE_EXIT" ? "GEOFENCE_EXIT" : "GEOFENCE_ENTER",

      message: data.message ?? "Geofence alert",

      latitude: data.latitude ?? 0,

      longitude: data.longitude ?? 0,

      createdAt: data.createdAt ?? new Date().toISOString(),
    };

    setAlerts((current) => {
      /*
       * Prevent duplicate alerts if the same
       * alert arrives through multiple events.
       */
      const exists = current.some((alert) => alert.id === newAlert.id);

      if (exists) {
        return current;
      }

      return [newAlert, ...current];
    });
  };

  const { connected } = useWebSocket({
    onMessage: handleWebSocketMessage,
  });

  /* -------------------------------- */
  /* Helpers */
  /* -------------------------------- */

  const isEntry = (type: Alert["type"]) => {
    return type === "GEOFENCE_ENTER";
  };

  const formatDate = (value: string) => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleString();
  };

  /* -------------------------------- */
  /* Statistics */
  /* -------------------------------- */

  const entryCount = alerts.filter(
    (alert) => alert.type === "GEOFENCE_ENTER",
  ).length;

  const exitCount = alerts.filter(
    (alert) => alert.type === "GEOFENCE_EXIT",
  ).length;

  return (
    <div className="min-h-[calc(100vh-4rem)] text-white">
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <p className="text-cyan-400 text-sm font-medium mb-2">MONITORING</p>

            <h1 className="text-3xl md:text-4xl font-bold">Alerts</h1>

            <p className="text-slate-400 mt-2">
              Monitor vehicle geofence entry and exit events.
            </p>
          </div>

          {/* Connection */}

          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
              connected
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                connected ? "bg-emerald-400" : "bg-red-400"
              }`}
            />

            {connected ? "Live" : "Disconnected"}
          </div>
        </div>

        {/* Error */}

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
            {error}
          </div>
        )}

        {/* Statistics */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          <div className="bg-[#0d1b2a] border border-slate-800 rounded-2xl p-6">
            <p className="text-sm text-slate-500">Total Alerts</p>

            <p className="text-3xl font-bold mt-2">{alerts.length}</p>
          </div>

          <div className="bg-[#0d1b2a] border border-emerald-500/10 rounded-2xl p-6">
            <p className="text-sm text-slate-500">Geofence Entries</p>

            <p className="text-3xl font-bold mt-2 text-emerald-400">
              {entryCount}
            </p>
          </div>

          <div className="bg-[#0d1b2a] border border-red-500/10 rounded-2xl p-6">
            <p className="text-sm text-slate-500">Geofence Exits</p>

            <p className="text-3xl font-bold mt-2 text-red-400">{exitCount}</p>
          </div>
        </div>

        {/* Alert list */}

        <section className="bg-[#0d1b2a] border border-slate-800 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
            <div>
              <h2 className="text-lg font-semibold">Recent Alerts</h2>

              <p className="text-sm text-slate-500 mt-1">
                Latest geofence activity
              </p>
            </div>

            <button
              type="button"
              onClick={loadAlerts}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-sm text-slate-300 transition"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="px-6 py-16 text-center text-slate-500">
              Loading alerts...
            </div>
          ) : alerts.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="text-4xl mb-4">🔔</div>

              <h3 className="text-lg font-medium text-slate-300">
                No alerts yet
              </h3>

              <p className="text-sm text-slate-500 mt-2">
                Vehicle geofence events will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {alerts.map((alert) => {
                const entry = isEntry(alert.type);

                return (
                  <div
                    key={alert.id}
                    className="px-6 py-5 hover:bg-slate-800/20 transition"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">
                      <div className="flex gap-4">
                        {/* Event icon */}

                        <div
                          className={`w-11 h-11 shrink-0 rounded-xl flex items-center justify-center text-lg border ${
                            entry
                              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                              : "bg-red-500/10 border-red-500/20 text-red-400"
                          }`}
                        >
                          {entry ? "↘" : "↗"}
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="font-semibold text-white">
                              {alert.message}
                            </h3>

                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                                entry
                                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                  : "bg-red-500/10 border-red-500/20 text-red-400"
                              }`}
                            >
                              {entry ? "ENTRY" : "EXIT"}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3 text-sm">
                            <span className="text-slate-500">
                              Vehicle ID:{" "}
                              <span className="text-slate-300">
                                {alert.vehicleId}
                              </span>
                            </span>

                            <span className="text-slate-500">
                              Geofence:{" "}
                              <span className="text-slate-300">
                                {alert.geofenceName}
                              </span>
                            </span>
                          </div>

                          <div className="text-xs text-slate-600 mt-3">
                            Location: {alert.latitude}
                            {" , "}
                            {alert.longitude}
                          </div>
                        </div>
                      </div>

                      <div className="text-xs text-slate-500 whitespace-nowrap">
                        {formatDate(alert.createdAt)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Alerts;

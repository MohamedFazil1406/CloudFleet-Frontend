import { useEffect, useState } from "react";
import { useWebSocket } from "../hooks/useWebSocket";
import type { WebSocketMessage } from "../types/websocket";

interface Alert {
  id: number | string;
  vehicleId?: number;
  vehicleNumber?: string;
  geofenceId?: number;
  geofenceName?: string;
  type?: string;
  eventType?: string;
  message?: string;
  latitude?: number;
  longitude?: number;
  createdAt?: string;
  occurredAt?: string;
}

const Alerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;

  /*
   * Load existing alerts from backend.
   *
   * This assumes your backend exposes:
   *
   * GET /api/alerts
   *
   * If your actual endpoint is different,
   * only this URL needs to be changed.
   */
  const loadAlerts = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/alerts`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      setAlerts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load alerts:", error);

      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  /*
   * Receive new alerts through WebSocket.
   */
  const handleWebSocketMessage = (message: WebSocketMessage) => {
    console.log("WebSocket alert message:", message);

    /*
     * Support common alert message types.
     */
    const type = String(message.type).toUpperCase();

    if (
      type !== "ALERT" &&
      type !== "GEOFENCE_ALERT" &&
      type !== "GEOFENCE_EVENT" &&
      type !== "ENTRY" &&
      type !== "EXIT"
    ) {
      return;
    }

    const data = message.data as Partial<Alert>;

    const newAlert: Alert = {
      id: data.id ?? `${Date.now()}-${Math.random()}`,

      vehicleId: data.vehicleId,

      vehicleNumber: data.vehicleNumber,

      geofenceId: data.geofenceId,

      geofenceName: data.geofenceName,

      type: data.type ?? type,

      eventType: data.eventType ?? type,

      message:
        data.message ?? `Geofence ${(data.eventType ?? type).toString()} event`,

      latitude: data.latitude,

      longitude: data.longitude,

      createdAt: data.createdAt ?? new Date().toISOString(),

      occurredAt: data.occurredAt ?? new Date().toISOString(),
    };

    /*
     * Put newest alert first.
     */
    setAlerts((current) => [newAlert, ...current]);
  };

  const { connected } = useWebSocket({
    onMessage: handleWebSocketMessage,
  });

  const getEventStyle = (eventType?: string) => {
    const type = eventType?.toUpperCase();

    if (type === "ENTER") {
      return {
        container: "bg-emerald-500/10 border-emerald-500/20",
        text: "text-emerald-400",
        label: "ENTRY",
      };
    }

    if (type === "EXIT") {
      return {
        container: "bg-red-500/10 border-red-500/20",
        text: "text-red-400",
        label: "EXIT",
      };
    }

    return {
      container: "bg-amber-500/10 border-amber-500/20",
      text: "text-amber-400",
      label: eventType ?? "ALERT",
    };
  };

  const formatDate = (date?: string) => {
    if (!date) {
      return "-";
    }

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return date;
    }

    return parsed.toLocaleString();
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] text-white">
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}

        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-cyan-400 text-sm font-medium mb-2">
                MONITORING
              </p>

              <h1 className="text-3xl md:text-4xl font-bold">Alerts</h1>

              <p className="text-slate-400 mt-2">
                Real-time vehicle and geofence alerts.
              </p>
            </div>

            {/* WebSocket status */}

            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm ${
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
        </div>

        {/* Statistics */}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-[#0d1b2a] border border-slate-800 rounded-xl p-5">
            <p className="text-sm text-slate-500">Total Alerts</p>

            <p className="text-3xl font-bold mt-2">{alerts.length}</p>
          </div>

          <div className="bg-[#0d1b2a] border border-slate-800 rounded-xl p-5">
            <p className="text-sm text-slate-500">Entries</p>

            <p className="text-3xl font-bold mt-2 text-emerald-400">
              {
                alerts.filter(
                  (alert) => alert.eventType?.toUpperCase() === "ENTER",
                ).length
              }
            </p>
          </div>

          <div className="bg-[#0d1b2a] border border-slate-800 rounded-xl p-5">
            <p className="text-sm text-slate-500">Exits</p>

            <p className="text-3xl font-bold mt-2 text-red-400">
              {
                alerts.filter(
                  (alert) => alert.eventType?.toUpperCase() === "EXIT",
                ).length
              }
            </p>
          </div>
        </div>

        {/* Alerts */}

        <section className="bg-[#0d1b2a] border border-slate-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Recent Alerts</h2>

              <p className="text-sm text-slate-500 mt-1">
                Live geofence activity
              </p>
            </div>

            <button
              type="button"
              onClick={loadAlerts}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm text-slate-300 transition"
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
              <div className="text-4xl mb-3">🔔</div>

              <h3 className="text-slate-300 font-medium">No alerts yet</h3>

              <p className="text-sm text-slate-500 mt-2">
                Geofence entry and exit events will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {alerts.map((alert) => {
                const style = getEventStyle(alert.eventType);

                return (
                  <div
                    key={alert.id}
                    className="px-6 py-5 hover:bg-slate-800/20 transition"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex gap-4">
                        {/* Icon */}

                        <div
                          className={`w-10 h-10 shrink-0 rounded-lg border flex items-center justify-center ${style.container}`}
                        >
                          {style.label === "ENTRY"
                            ? "↘"
                            : style.label === "EXIT"
                              ? "↗"
                              : "!"}
                        </div>

                        <div>
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="font-medium text-white">
                              {alert.message ?? "Geofence Alert"}
                            </h3>

                            <span
                              className={`px-2 py-1 rounded-md border text-xs font-medium ${style.container} ${style.text}`}
                            >
                              {style.label}
                            </span>
                          </div>

                          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-500">
                            {alert.vehicleNumber && (
                              <span>
                                Vehicle:{" "}
                                <span className="text-slate-300">
                                  {alert.vehicleNumber}
                                </span>
                              </span>
                            )}

                            {alert.vehicleId && (
                              <span>
                                Vehicle ID:{" "}
                                <span className="text-slate-300">
                                  {alert.vehicleId}
                                </span>
                              </span>
                            )}

                            {alert.geofenceName && (
                              <span>
                                Geofence:{" "}
                                <span className="text-slate-300">
                                  {alert.geofenceName}
                                </span>
                              </span>
                            )}
                          </div>

                          {(alert.latitude !== undefined ||
                            alert.longitude !== undefined) && (
                            <p className="text-xs text-slate-600 mt-2">
                              Location: {alert.latitude}
                              {" , "}
                              {alert.longitude}
                            </p>
                          )}
                        </div>
                      </div>

                      <span className="text-xs text-slate-500 whitespace-nowrap">
                        {formatDate(alert.occurredAt ?? alert.createdAt)}
                      </span>
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

import { useEffect, useState } from "react";

import { getGeofenceEvents } from "../services/geofenceEventApi";

import { useWebSocket } from "../hooks/useWebSocket";

import type { WebSocketMessage } from "../types/websocket";

import api from "../services/api";

interface Alert {
  id: number;
  vehicleId: number;
  geofenceId: number;
  geofenceName: string;
  type: "GEOFENCE_ENTER" | "GEOFENCE_EXIT";
  message: string;
  latitude: number;
  longitude: number;
  createdAt: string;
}

interface GeofenceEvent {
  id: number;
  vehicleId: number;
  geofenceId: number;
  geofenceName: string;
  eventType: "ENTER" | "EXIT";
  latitude: number;
  longitude: number;
  occurredAt: string;
}

const Alerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const [events, setEvents] = useState<GeofenceEvent[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  /* -------------------------------- */
  /* Load alerts */
  /* -------------------------------- */

  const loadAlerts = async () => {
    try {
      const response = await api.get<Alert[]>("/alerts");

      setAlerts(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Failed to load alerts:", err);

      setError("Failed to load alerts.");
    }
  };

  /* -------------------------------- */
  /* Load geofence events */
  /* -------------------------------- */

  const loadEvents = async () => {
    try {
      const data = await getGeofenceEvents();

      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load geofence events:", err);
    }
  };

  /* -------------------------------- */
  /* Initial load */
  /* -------------------------------- */

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      await Promise.all([loadAlerts(), loadEvents()]);

      setLoading(false);
    };

    load();
  }, []);

  /* -------------------------------- */
  /* WebSocket */
  /* -------------------------------- */

  const handleWebSocketMessage = (message: WebSocketMessage) => {
    if (message.type !== "ALERT_CREATED" && message.type !== "ALERT_UPDATED") {
      return;
    }

    const newAlert = message.data as Alert;

    if (!newAlert?.id) {
      return;
    }

    /*
     * Add the new alert immediately.
     */
    setAlerts((current) => {
      const exists = current.some((alert) => alert.id === newAlert.id);

      if (exists) {
        return current;
      }

      return [newAlert, ...current];
    });

    /*
     * Refresh events too because
     * an alert represents a geofence
     * ENTER/EXIT transition.
     */
    loadEvents();
  };

  const { connected } = useWebSocket({
    onMessage: handleWebSocketMessage,
  });

  /* -------------------------------- */
  /* Helpers */
  /* -------------------------------- */

  const formatDate = (value: string) => {
    try {
      return new Date(value).toLocaleString();
    } catch {
      return value;
    }
  };

  const getAlertLabel = (type: Alert["type"]) => {
    if (type === "GEOFENCE_ENTER") {
      return "ENTER";
    }

    return "EXIT";
  };

  /* -------------------------------- */
  /* Loading */
  /* -------------------------------- */

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center text-white">
        <div className="text-center">
          <div className="w-9 h-9 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />

          <p className="text-slate-400 mt-4">Loading alerts...</p>
        </div>
      </div>
    );
  }

  /* -------------------------------- */
  /* UI */
  /* -------------------------------- */

  return (
    <div className="min-h-screen text-white">
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <p className="text-cyan-400 text-sm font-medium mb-2">
              REAL-TIME MONITORING
            </p>

            <h1 className="text-3xl font-bold">Alerts</h1>

            <p className="text-slate-400 mt-2">
              Vehicle geofence activity and real-time alerts.
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

            {connected ? "Realtime Online" : "Realtime Offline"}
          </div>
        </div>

        {/* Error */}

        {error && (
          <div className="mb-6 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* ================================= */}
        {/* STAT CARDS */}
        {/* ================================= */}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-[#0d1b2a] border border-slate-800 rounded-xl p-5">
            <p className="text-sm text-slate-500">Total Alerts</p>

            <p className="text-3xl font-bold mt-2">{alerts.length}</p>
          </div>

          <div className="bg-[#0d1b2a] border border-slate-800 rounded-xl p-5">
            <p className="text-sm text-slate-500">Geofence Enters</p>

            <p className="text-3xl font-bold text-emerald-400 mt-2">
              {alerts.filter((alert) => alert.type === "GEOFENCE_ENTER").length}
            </p>
          </div>

          <div className="bg-[#0d1b2a] border border-slate-800 rounded-xl p-5">
            <p className="text-sm text-slate-500">Geofence Exits</p>

            <p className="text-3xl font-bold text-red-400 mt-2">
              {alerts.filter((alert) => alert.type === "GEOFENCE_EXIT").length}
            </p>
          </div>
        </div>

        {/* ================================= */}
        {/* ALERTS */}
        {/* ================================= */}

        <section className="bg-[#0d1b2a] border border-slate-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-800">
            <h2 className="text-lg font-semibold">Recent Alerts</h2>

            <p className="text-sm text-slate-500 mt-1">
              Real-time geofence violations and transitions.
            </p>
          </div>

          {alerts.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-slate-400">No alerts yet.</p>

              <p className="text-sm text-slate-600 mt-2">
                Alerts will appear when vehicles enter or exit an active
                geofence.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {alerts.map((alert) => {
                const isEnter = alert.type === "GEOFENCE_ENTER";

                return (
                  <div
                    key={alert.id}
                    className="px-6 py-5 hover:bg-slate-900/30 transition"
                  >
                    <div className="flex items-start gap-4">
                      {/* Status */}

                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                          isEnter
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {isEnter ? "↑" : "↓"}
                      </div>

                      {/* Content */}

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold">{alert.message}</h3>

                          <span
                            className={`px-2 py-1 rounded-full text-xs border ${
                              isEnter
                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                : "bg-red-500/10 border-red-500/20 text-red-400"
                            }`}
                          >
                            {getAlertLabel(alert.type)}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2 text-sm text-slate-500">
                          <span>Vehicle #{alert.vehicleId}</span>

                          <span>{alert.geofenceName}</span>

                          <span>{formatDate(alert.createdAt)}</span>
                        </div>

                        <p className="text-xs text-slate-600 mt-2">
                          Location: {alert.latitude}
                          {" , "}
                          {alert.longitude}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ================================= */}
        {/* GEOFENCE EVENTS */}
        {/* ================================= */}

        <section className="mt-6 bg-[#0d1b2a] border border-slate-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-800">
            <h2 className="text-lg font-semibold">Geofence Event History</h2>

            <p className="text-sm text-slate-500 mt-1">
              Recorded vehicle ENTER and EXIT events.
            </p>
          </div>

          {events.length === 0 ? (
            <div className="px-6 py-10 text-center text-slate-500">
              No geofence events recorded.
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {events.map((event) => {
                const isEnter = event.eventType === "ENTER";

                return (
                  <div
                    key={event.id}
                    className="px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs border ${
                            isEnter
                              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                              : "bg-red-500/10 border-red-500/20 text-red-400"
                          }`}
                        >
                          {event.eventType}
                        </span>

                        <span className="font-medium">
                          {event.geofenceName}
                        </span>
                      </div>

                      <p className="text-sm text-slate-500 mt-2">
                        Vehicle #{event.vehicleId}
                      </p>
                    </div>

                    <div className="text-sm text-slate-500 md:text-right">
                      <p>{formatDate(event.occurredAt)}</p>

                      <p className="text-xs text-slate-600 mt-1">
                        {event.latitude}
                        {" , "}
                        {event.longitude}
                      </p>
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

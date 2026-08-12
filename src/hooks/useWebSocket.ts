import { useEffect, useRef, useState } from "react";

import {
  connectWebSocket,
  removeWebSocketHandlers,
  isWebSocketConnected,
} from "../services/websocketService";

import type { WebSocketMessage } from "../types/websocket";

interface UseWebSocketOptions {
  onMessage?: (message: WebSocketMessage) => void;
}

export const useWebSocket = ({ onMessage }: UseWebSocketOptions = {}) => {
  const [connected, setConnected] = useState(isWebSocketConnected());

  /*
   * Keep the latest onMessage callback
   * without reconnecting the socket.
   */
  const onMessageRef = useRef(onMessage);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    let mounted = true;

    /*
     * Message handler for this component.
     */
    const handleMessage = (message: WebSocketMessage) => {
      if (!mounted) {
        return;
      }

      onMessageRef.current?.(message);
    };

    /*
     * Connection handler.
     */
    const handleOpen = () => {
      if (!mounted) {
        return;
      }

      console.log("WebSocket connected");

      setConnected(true);
    };

    /*
     * Close handler.
     */
    const handleClose = () => {
      if (!mounted) {
        return;
      }

      console.log("WebSocket disconnected");

      setConnected(false);
    };

    /*
     * Error handler.
     */
    const handleError = (error: unknown) => {
      if (!mounted) {
        return;
      }

      console.error("WebSocket error:", error);

      setConnected(false);
    };

    /*
     * Register this component with
     * the shared STOMP client.
     */
    connectWebSocket(handleMessage, handleOpen, handleClose, handleError);

    /*
     * IMPORTANT:
     *
     * We only remove this component's
     * handlers.
     *
     * We do NOT call:
     *
     * disconnectWebSocket()
     *
     * because Dashboard, Alerts and
     * FleetMap may all use the same
     * connection.
     */
    return () => {
      mounted = false;

      removeWebSocketHandlers(
        handleMessage,
        handleOpen,
        handleClose,
        handleError,
      );
    };
  }, []);

  return {
    connected,
  };
};

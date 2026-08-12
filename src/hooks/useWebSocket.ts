import { useEffect, useRef, useState } from "react";

import {
  connectWebSocket,
  disconnectWebSocket,
} from "../services/websocketService";

import type { WebSocketMessage } from "../types/websocket";

interface UseWebSocketOptions {
  onMessage?: (message: WebSocketMessage) => void;
}

export const useWebSocket = ({ onMessage }: UseWebSocketOptions = {}) => {
  const [connected, setConnected] = useState(false);

  const onMessageRef = useRef(onMessage);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    let active = true;

    const socket = connectWebSocket(
      (message) => {
        if (!active) {
          return;
        }

        if (onMessageRef.current) {
          onMessageRef.current(message);
        }
      },

      () => {
        if (!active) {
          return;
        }

        console.log("WebSocket connected");

        setConnected(true);
      },

      () => {
        if (!active) {
          return;
        }

        console.log("WebSocket disconnected");

        setConnected(false);
      },

      (error) => {
        if (!active) {
          return;
        }

        console.error("WebSocket connection error:", error);

        setConnected(false);
      },
    );

    if (!socket) {
      setConnected(false);
    }

    return () => {
      active = false;

      setConnected(false);

      disconnectWebSocket();
    };
  }, []);

  return {
    connected,
  };
};

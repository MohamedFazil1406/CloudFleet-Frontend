import { Client, type IMessage, type StompSubscription } from "@stomp/stompjs";

import type { WebSocketMessage } from "../types/websocket";

const WS_URL = import.meta.env.VITE_WS_URL;

type MessageHandler = (message: WebSocketMessage) => void;

type ConnectionHandler = () => void;

type ErrorHandler = (error: unknown) => void;

/*
 * One STOMP client for the entire application.
 */
let client: Client | null = null;

let subscription: StompSubscription | null = null;

/*
 * Multiple React components can use
 * the same STOMP connection.
 */
const messageHandlers = new Set<MessageHandler>();

const openHandlers = new Set<ConnectionHandler>();

const closeHandlers = new Set<ConnectionHandler>();

const errorHandlers = new Set<ErrorHandler>();

/*
 * Connect to STOMP WebSocket.
 */
export const connectWebSocket = (
  onMessage?: MessageHandler,
  onOpen?: ConnectionHandler,
  onClose?: ConnectionHandler,
  onError?: ErrorHandler,
): Client | null => {
  if (!WS_URL) {
    console.error("VITE_WS_URL is not configured");

    return null;
  }

  /*
   * Register handlers.
   */
  if (onMessage) {
    messageHandlers.add(onMessage);
  }

  if (onOpen) {
    openHandlers.add(onOpen);
  }

  if (onClose) {
    closeHandlers.add(onClose);
  }

  if (onError) {
    errorHandlers.add(onError);
  }

  /*
   * Already connected.
   */
  if (client && client.connected) {
    onOpen?.();

    return client;
  }

  /*
   * Already connecting.
   */
  if (client && client.active) {
    return client;
  }

  console.log("Creating STOMP WebSocket connection...");

  const newClient = new Client({
    brokerURL: WS_URL,

    reconnectDelay: 5000,

    heartbeatIncoming: 10000,

    heartbeatOutgoing: 10000,

    debug: (message) => {
      console.log("[STOMP]", message);
    },
  });

  /*
   * Store client immediately.
   *
   * This prevents another component from
   * creating another STOMP client while
   * this one is connecting.
   */
  client = newClient;

  /*
   * STOMP connected.
   */
  newClient.onConnect = () => {
    console.log("STOMP connected:", WS_URL);

    /*
     * Subscribe to alerts only once.
     */
    if (!subscription) {
      subscription = newClient.subscribe(
        "/topic/alerts",
        (message: IMessage) => {
          try {
            const parsed = JSON.parse(message.body);

            console.log("Alert received:", parsed);

            /*
             * Backend sends AlertResponse
             * directly to /topic/alerts.
             *
             * Therefore the frontend
             * converts it into the
             * application's message type.
             */
            const websocketMessage: WebSocketMessage = {
              type: "ALERT_CREATED",

              data: parsed,
            };

            messageHandlers.forEach((handler) => {
              handler(websocketMessage);
            });
          } catch (error) {
            console.error("Failed to parse STOMP message:", error);
          }
        },
      );
    }

    openHandlers.forEach((handler) => {
      handler();
    });
  };

  /*
   * STOMP broker error.
   */
  newClient.onStompError = (frame) => {
    console.error("STOMP broker error:", frame.headers["message"], frame.body);

    errorHandlers.forEach((handler) => {
      handler(frame);
    });
  };

  /*
   * WebSocket transport error.
   */
  newClient.onWebSocketError = (event) => {
    console.error("WebSocket error:", event);

    errorHandlers.forEach((handler) => {
      handler(event);
    });
  };

  /*
   * WebSocket closed.
   */
  newClient.onWebSocketClose = (event) => {
    console.log("STOMP WebSocket closed:", event.code, event.reason);

    subscription?.unsubscribe();

    subscription = null;

    closeHandlers.forEach((handler) => {
      handler();
    });
  };

  /*
   * Start STOMP.
   */
  newClient.activate();

  return newClient;
};

/*
 * Remove only the handlers belonging
 * to a specific React component.
 *
 * IMPORTANT:
 * This does NOT close the global
 * WebSocket connection.
 */
export const removeWebSocketHandlers = (
  onMessage?: MessageHandler,
  onOpen?: ConnectionHandler,
  onClose?: ConnectionHandler,
  onError?: ErrorHandler,
): void => {
  if (onMessage) {
    messageHandlers.delete(onMessage);
  }

  if (onOpen) {
    openHandlers.delete(onOpen);
  }

  if (onClose) {
    closeHandlers.delete(onClose);
  }

  if (onError) {
    errorHandlers.delete(onError);
  }
};

/*
 * Completely close the global STOMP
 * connection.
 *
 * Use this only when the application
 * itself needs to disconnect.
 */
export const disconnectWebSocket = async (): Promise<void> => {
  console.log("Disconnecting global STOMP connection...");

  subscription?.unsubscribe();

  subscription = null;

  const currentClient = client;

  client = null;

  if (currentClient) {
    await currentClient.deactivate();
  }
};

/*
 * Check connection state.
 */
export const isWebSocketConnected = (): boolean => {
  return client?.connected ?? false;
};

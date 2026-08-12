import type {
  WebSocketMessage,
  WebSocketMessageType,
} from "../types/websocket";

const WS_URL = import.meta.env.VITE_WS_URL;

let socket: WebSocket | null = null;

type MessageHandler = (message: WebSocketMessage) => void;

type OpenHandler = () => void;
type CloseHandler = () => void;
type ErrorHandler = (error: Event) => void;

let messageHandler: MessageHandler | null = null;

let connectionId = 0;

export const connectWebSocket = (
  onMessage: MessageHandler,
  onOpen?: OpenHandler,
  onClose?: CloseHandler,
  onError?: ErrorHandler,
): WebSocket | null => {
  if (!WS_URL) {
    console.error("VITE_WS_URL is not configured");

    return null;
  }

  /*
   * Reuse an already connected socket.
   */
  if (socket && socket.readyState === WebSocket.OPEN) {
    messageHandler = onMessage;
    return socket;
  }

  /*
   * Reuse a socket that is currently connecting.
   */
  if (socket && socket.readyState === WebSocket.CONNECTING) {
    messageHandler = onMessage;
    return socket;
  }

  /*
   * Create a new connection.
   */
  const currentConnectionId = ++connectionId;

  const newSocket = new WebSocket(WS_URL);

  socket = newSocket;
  messageHandler = onMessage;

  /*
   * Capture callbacks locally.
   *
   * This avoids the TypeScript `never` problem
   * and prevents callbacks from an old socket
   * affecting a newer socket.
   */
  const handleOpen = onOpen;
  const handleClose = onClose;
  const handleError = onError;

  newSocket.onopen = () => {
    if (currentConnectionId !== connectionId) {
      return;
    }

    console.log("WebSocket connected:", WS_URL);

    if (handleOpen) {
      handleOpen();
    }
  };

  newSocket.onmessage = (event) => {
    if (currentConnectionId !== connectionId) {
      return;
    }

    try {
      const parsed: unknown = JSON.parse(event.data);

      if (!parsed || typeof parsed !== "object") {
        console.warn("Invalid WebSocket message:", parsed);

        return;
      }

      const data = parsed as {
        type?: unknown;
        data?: unknown;
      };

      if (typeof data.type !== "string") {
        console.warn("Invalid WebSocket message type:", parsed);

        return;
      }

      const message: WebSocketMessage = {
        type: data.type as WebSocketMessageType,
        data: data.data,
      };

      if (messageHandler) {
        messageHandler(message);
      }
    } catch (error) {
      console.error("Failed to parse WebSocket message:", error);
    }
  };

  newSocket.onerror = (error) => {
    if (currentConnectionId !== connectionId) {
      return;
    }

    console.error("WebSocket error:", error);

    if (handleError) {
      handleError(error);
    }
  };

  newSocket.onclose = (event) => {
    if (currentConnectionId !== connectionId) {
      return;
    }

    console.log(
      "WebSocket disconnected:",
      event.code,
      event.reason || "No reason provided",
    );

    socket = null;
    messageHandler = null;

    if (handleClose) {
      handleClose();
    }
  };

  return newSocket;
};

export const disconnectWebSocket = () => {
  /*
   * Invalidate the current connection
   * before closing it.
   */
  connectionId++;

  const currentSocket = socket;

  socket = null;
  messageHandler = null;

  if (!currentSocket) {
    return;
  }

  if (
    currentSocket.readyState === WebSocket.OPEN ||
    currentSocket.readyState === WebSocket.CONNECTING
  ) {
    currentSocket.close(1000, "Client disconnected");
  }
};

export const sendWebSocketMessage = (message: unknown) => {
  if (!socket) {
    console.warn("WebSocket is not initialized");

    return;
  }

  if (socket.readyState !== WebSocket.OPEN) {
    console.warn("WebSocket is not connected");

    return;
  }

  socket.send(JSON.stringify(message));
};

export const isWebSocketConnected = (): boolean => {
  return socket?.readyState === WebSocket.OPEN;
};

import type {
    WebSocketMessage,
    WebSocketMessageType,
} from "../types/websocket";

const WS_URL = import.meta.env.VITE_WS_URL;

let socket: WebSocket | null = null;

type MessageHandler = (
    message: WebSocketMessage
) => void;

let messageHandler: MessageHandler | null = null;

export const connectWebSocket = (
    onMessage: MessageHandler,
    onOpen?: () => void,
    onClose?: () => void,
    onError?: (error: Event) => void
) => {
    messageHandler = onMessage;

    if (!WS_URL) {
        console.error("VITE_WS_URL is not configured");
        return null;
    }

    if (
        socket &&
        socket.readyState === WebSocket.OPEN
    ) {
        return socket;
    }

    socket = new WebSocket(WS_URL);

    socket.onopen = () => {
        console.log("WebSocket connected:", WS_URL);
        onOpen?.();
    };

    socket.onmessage = (event) => {
        try {
            const parsed = JSON.parse(event.data);

            if (
                !parsed ||
                typeof parsed !== "object" ||
                typeof parsed.type !== "string"
            ) {
                console.warn(
                    "Invalid WebSocket message:",
                    parsed
                );
                return;
            }

            const message: WebSocketMessage = {
                type: parsed.type as WebSocketMessageType,
                data: parsed.data,
            };

            messageHandler?.(message);
        } catch (error) {
            console.error(
                "Failed to parse WebSocket message:",
                error
            );
        }
    };

    socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        onError?.(error);
    };

    socket.onclose = (event) => {
        console.log(
            "WebSocket disconnected:",
            event.code,
            event.reason
        );

        socket = null;
        messageHandler = null;

        onClose?.();
    };

    return socket;
};

export const disconnectWebSocket = () => {
    if (socket) {
        socket.close();
        socket = null;
    }

    messageHandler = null;
};

export const sendWebSocketMessage = (
    message: unknown
) => {
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

export const isWebSocketConnected = () => {
    return socket?.readyState === WebSocket.OPEN;
};
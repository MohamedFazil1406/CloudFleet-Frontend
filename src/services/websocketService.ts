const WS_URL = import.meta.env.VITE_WS_URL;

let socket: WebSocket | null = null;

export const connectWebSocket = (
    onMessage: (data: unknown) => void,
    onOpen?: () => void,
    onClose?: () => void,
    onError?: (error: Event) => void
) => {
    socket = new WebSocket(WS_URL);

    socket.onopen = () => {
        console.log("WebSocket connected");
        onOpen?.();
    };

    socket.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            onMessage(data);
        } catch {
            onMessage(event.data);
        }
    };

    socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        onError?.(error);
    };

    socket.onclose = () => {
        console.log("WebSocket disconnected");
        onClose?.();
    };

    return socket;
};

export const disconnectWebSocket = () => {
    if (socket) {
        socket.close();
        socket = null;
    }
};

export const sendWebSocketMessage = (message: unknown) => {
    if (socket?.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(message));
    } else {
        console.warn("WebSocket is not connected");
    }
};
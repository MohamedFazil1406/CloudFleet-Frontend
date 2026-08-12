import { useEffect, useRef, useState } from "react";
import {
    connectWebSocket,
    disconnectWebSocket,
} from "../services/websocketService";
import type { WebSocketMessage } from "../types/websocket";

interface UseWebSocketOptions {
    onMessage?: (message: WebSocketMessage) => void;
}

export const useWebSocket = ({
                                 onMessage,
                             }: UseWebSocketOptions = {}) => {
    const [connected, setConnected] = useState(false);

    const onMessageRef = useRef(onMessage);

    useEffect(() => {
        onMessageRef.current = onMessage;
    }, [onMessage]);

    useEffect(() => {
        const socket = connectWebSocket(
            (message) => {
                onMessageRef.current?.(message);
            },
            () => {
                setConnected(true);
            },
            () => {
                setConnected(false);
            },
            () => {
                setConnected(false);
            }
        );

        return () => {
            socket?.close();
            disconnectWebSocket();
            setConnected(false);
        };
    }, []);

    return {
        connected,
    };
};
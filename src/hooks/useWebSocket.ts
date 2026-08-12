import { useEffect, useRef, useState } from "react";
import {
    connectWebSocket,
    disconnectWebSocket,
} from "../services/websocketService";

interface UseWebSocketOptions {
    onMessage?: (data: unknown) => void;
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
            (data) => {
                onMessageRef.current?.(data);
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
            socket.close();
            disconnectWebSocket();
            setConnected(false);
        };
    }, []);

    return {
        connected,
    };
};
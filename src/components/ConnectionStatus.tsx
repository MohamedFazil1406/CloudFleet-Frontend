interface ConnectionStatusProps {
    connected: boolean;
}

const ConnectionStatus = ({
                              connected,
                          }: ConnectionStatusProps) => {
    return (
        <span
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium ${
                connected
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                    : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}
        >
            <span
                className={`w-2 h-2 rounded-full ${
                    connected
                        ? "bg-emerald-400 animate-pulse"
                        : "bg-red-400"
                }`}
            />

            {connected ? "Live Updates" : "Realtime Offline"}
        </span>
    );
};

export default ConnectionStatus;
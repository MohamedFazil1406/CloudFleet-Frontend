import { useState } from "react";

const TopBar = () => {
    const [refreshing, setRefreshing] = useState(false);

    const handleRefresh = () => {
        setRefreshing(true);

        window.location.reload();
    };

    return (
        <header className="sticky top-0 z-40 h-16 bg-[#091624]/90 backdrop-blur-md border-b border-slate-800">
            <div className="h-full px-6 flex items-center justify-between">

                {/* Page / Environment */}
                <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-400">
                        CloudFleet
                    </span>

                    <span className="text-slate-700">
                        /
                    </span>

                    <span className="text-sm text-slate-200">
                        Production
                    </span>

                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Online
                    </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">

                    <button
                        type="button"
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-700 bg-slate-800/50 text-slate-300 text-sm hover:bg-slate-800 hover:text-white transition disabled:opacity-50"
                    >
                        <span
                            className={
                                refreshing
                                    ? "animate-spin"
                                    : ""
                            }
                        >
                            ↻
                        </span>

                        Refresh
                    </button>

                    <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-800">
                        <div className="w-7 h-7 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                            <span className="text-cyan-400 text-xs font-semibold">
                                F
                            </span>
                        </div>

                        <span className="text-sm text-slate-300">
                            Admin
                        </span>
                    </div>

                </div>

            </div>
        </header>
    );
};

export default TopBar;
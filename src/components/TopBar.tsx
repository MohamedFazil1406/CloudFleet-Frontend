import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const TopBar = () => {
  const [refreshing, setRefreshing] = useState(false);

  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const handleRefresh = () => {
    setRefreshing(true);
    window.location.reload();
  };

  const handleLogout = () => {
    logout();

    navigate("/login", {
      replace: true,
    });
  };

  const getInitial = () => {
    if (!user?.name) {
      return "U";
    }

    return user.name.charAt(0).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 h-16 bg-[#091624]/90 backdrop-blur-md border-b border-slate-800">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Page / Environment */}

        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-400">CloudFleet</span>

          <span className="text-slate-700">/</span>

          <span className="text-sm text-slate-200">Production</span>

          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Online
          </span>
        </div>

        {/* Actions */}

        <div className="flex items-center gap-3">
          {/* Refresh */}

          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-700 bg-slate-800/50 text-slate-300 text-sm hover:bg-slate-800 hover:text-white transition disabled:opacity-50"
          >
            <span className={refreshing ? "animate-spin" : ""}>↻</span>
            Refresh
          </button>

          {/* User */}

          <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-800">
            <div className="w-7 h-7 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <span className="text-cyan-400 text-xs font-semibold">
                {getInitial()}
              </span>
            </div>

            <div className="flex flex-col leading-tight">
              <span className="text-sm text-slate-300">
                {user?.name ?? "User"}
              </span>

              <span className="text-[10px] text-slate-500 uppercase">
                {user?.role ?? "OPERATOR"}
              </span>
            </div>
          </div>

          {/* Logout */}

          <button
            type="button"
            onClick={handleLogout}
            className="px-3 py-2 rounded-lg border border-red-500/20 bg-red-500/5 text-red-400 text-sm hover:bg-red-500/10 hover:text-red-300 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopBar;

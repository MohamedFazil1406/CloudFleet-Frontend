import { NavLink } from "react-router-dom";

const Sidebar = () => {
    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-[#091624] border-r border-slate-800 z-50">
            {/* Logo */}
            <div className="h-20 px-6 flex items-center border-b border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                        <span className="text-cyan-400 text-xl">
                            ◈
                        </span>
                    </div>

                    <div>
                        <h1 className="text-white font-bold text-lg">
                            CloudFleet
                        </h1>

                        <p className="text-xs text-slate-500">
                            Fleet Management
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-2">

                <NavItem
                    to="/dashboard"
                    icon="▣"
                    label="Dashboard"
                />

                <NavItem
                    to="/vehicles"
                    icon="🚚"
                    label="Vehicles"
                />

                <NavItem
                    to="/alerts"
                    icon="!"
                    label="Alerts"
                />

                <NavItem
                    to="/settings"
                    icon="⚙"
                    label="Settings"
                />

            </nav>

            {/* Bottom Status */}
            <div className="absolute bottom-0 left-0 right-0 p-4">

                <div className="rounded-xl bg-slate-800/50 border border-slate-800 p-4">

                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />

                        <span className="text-sm text-emerald-400">
                            System Online
                        </span>
                    </div>

                    <p className="text-xs text-slate-500 mt-2">
                        Production environment
                    </p>

                </div>

            </div>
        </aside>
    );
};

interface NavItemProps {
    to: string;
    icon: string;
    label: string;
}

const NavItem = ({
                     to,
                     icon,
                     label,
                 }: NavItemProps) => {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                    isActive
                        ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`
            }
        >
            <span className="w-6 text-center">
                {icon}
            </span>

            <span className="font-medium text-sm">
                {label}
            </span>
        </NavLink>
    );
};

export default Sidebar;
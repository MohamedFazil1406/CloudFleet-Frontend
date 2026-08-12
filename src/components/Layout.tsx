import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const Layout = () => {
    return (
        <div className="min-h-screen bg-[#07111f]">
            <Sidebar />

            <main className="ml-64 min-h-screen">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

const Layout = () => {
  return (
    <div className="min-h-screen bg-[#07111f] text-white">
      <Sidebar />

      <div className="ml-64 min-h-screen">
        <TopBar />

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;

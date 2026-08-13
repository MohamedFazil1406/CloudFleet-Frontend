import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  const location = useLocation();

  /*
   * Wait until authentication state
   * has been restored from localStorage.
   */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#07111f] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />

          <p className="text-slate-400 mt-4 text-sm">Loading CloudFleet...</p>
        </div>
      </div>
    );
  }

  /*
   * User is not authenticated.
   */
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  /*
   * User is authenticated.
   */
  return <Outlet />;
};

export default ProtectedRoute;

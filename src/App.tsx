import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import Vehicles from "./pages/Vehicles";
import Alerts from "./pages/Alerts";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Geofences from "./pages/Geofences";
import VehicleLocation from "./pages/VehicleLocation";
import Login from "./pages/Login";
import Register from "./pages/Register";

import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* ========================= */}
          {/* PUBLIC ROUTES              */}
          {/* ========================= */}

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          {/* ========================= */}
          {/* PROTECTED ROUTES           */}
          {/* ========================= */}

          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              <Route path="/dashboard" element={<Dashboard />} />

              <Route path="/vehicles" element={<Vehicles />} />

              <Route path="/alerts" element={<Alerts />} />

              <Route path="/geofences" element={<Geofences />} />

              <Route path="/vehicle-location" element={<VehicleLocation />} />

              <Route path="/settings" element={<Settings />} />

              <Route path="*" element={<NotFound />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Vehicles from "./pages/Vehicles";
import Alerts from "./pages/Alerts";
import Settings from "./pages/Settings";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>

                    <Route
                        path="/"
                        element={<Navigate to="/dashboard" replace />}
                    />

                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/vehicles"
                        element={<Vehicles />}
                    />

                    <Route
                        path="/alerts"
                        element={<Alerts />}
                    />

                    <Route
                        path="/settings"
                        element={<Settings />}
                    />

                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
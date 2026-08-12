import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Vehicles from "./pages/Vehicles";
import Alerts from "./pages/Alerts";

const App = () => {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-[#07111f]">

                <Routes>

                    {/* Dashboard */}
                    <Route
                        path="/"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                    {/* Vehicles */}
                    <Route
                        path="/vehicles"
                        element={<Vehicles />}
                    />

                    {/* Alerts */}
                    <Route
                        path="/alerts"
                        element={<Alerts />}
                    />

                    {/* Unknown route */}
                    <Route
                        path="*"
                        element={
                            <Navigate
                                to="/dashboard"
                                replace
                            />
                        }
                    />

                </Routes>

            </div>
        </BrowserRouter>
    );
};

export default App;
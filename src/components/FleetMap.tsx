import {
    MapContainer,
    Marker,
    Popup,
    TileLayer,
} from "react-leaflet";
import L from "leaflet";

import type { Vehicle } from "../types/dashboard";

import "leaflet/dist/leaflet.css";

/* -------------------------------- */
/* Map configuration */
/* -------------------------------- */

const DEFAULT_CENTER: [number, number] = [
    19.076,
    72.8777,
];

/* -------------------------------- */
/* Leaflet marker icon */
/* -------------------------------- */

const vehicleIcon = new L.Icon({
    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",

    iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",

    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",

    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

/* -------------------------------- */
/* Props */
/* -------------------------------- */

interface FleetMapProps {
    vehicles: Vehicle[];
}

/* -------------------------------- */
/* Component */
/* -------------------------------- */

const FleetMap = ({ vehicles }: FleetMapProps) => {
    const vehiclesWithLocation = vehicles.filter(
        (vehicle) =>
            vehicle.latitude !== null &&
            vehicle.latitude !== undefined &&
            vehicle.longitude !== null &&
            vehicle.longitude !== undefined
    );

    return (
        <section className="bg-[#0d1b2a] border border-slate-800 rounded-2xl overflow-hidden shadow-xl shadow-black/10">

            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                <div>
                    <h2 className="text-lg font-semibold text-white">
                        Fleet Map
                    </h2>

                    <p className="text-sm text-slate-500 mt-1">
                        Vehicle locations
                    </p>
                </div>

                <div className="flex items-center gap-3">

                    <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs">
                        <span className="w-2 h-2 rounded-full bg-cyan-400" />

                        {vehiclesWithLocation.length} located
                    </span>

                    <span className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 text-xs">
                        {vehicles.length} total
                    </span>

                </div>

            </div>

            {/* Map */}
            <div className="h-[500px]">

                <MapContainer
                    center={DEFAULT_CENTER}
                    zoom={11}
                    scrollWheelZoom={true}
                    className="h-full w-full"
                >

                    <TileLayer
                        attribution="&copy; OpenStreetMap contributors"
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* Vehicle markers */}
                    {vehiclesWithLocation.map((vehicle) => (
                        <Marker
                            key={vehicle.id}
                            position={[
                                vehicle.latitude!,
                                vehicle.longitude!,
                            ]}
                            icon={vehicleIcon}
                        >
                            <Popup>

                                <div className="min-w-[190px]">

                                    <h3 className="font-semibold text-base">
                                        {vehicle.vehicleNumber ??
                                            `Vehicle #${vehicle.id}`}
                                    </h3>

                                    <div className="mt-3 space-y-2 text-sm">

                                        <div>
                                            <span className="text-gray-500">
                                                Status:
                                            </span>{" "}
                                            <strong>
                                                {vehicle.status ??
                                                    "Unknown"}
                                            </strong>
                                        </div>

                                        <div>
                                            <span className="text-gray-500">
                                                Latitude:
                                            </span>{" "}
                                            {vehicle.latitude}
                                        </div>

                                        <div>
                                            <span className="text-gray-500">
                                                Longitude:
                                            </span>{" "}
                                            {vehicle.longitude}
                                        </div>

                                    </div>

                                </div>

                            </Popup>
                        </Marker>
                    ))}

                </MapContainer>

            </div>

            {/* No location data */}
            {vehicles.length > 0 &&
                vehiclesWithLocation.length === 0 && (
                    <div className="px-6 py-4 border-t border-slate-800 bg-amber-500/5">

                        <p className="text-sm text-amber-400">
                            Vehicles are available, but no latitude
                            or longitude data is currently available.
                        </p>

                    </div>
                )}

            {/* No vehicles */}
            {vehicles.length === 0 && (
                <div className="px-6 py-12 border-t border-slate-800 text-center">

                    <div className="text-3xl">
                        🚚
                    </div>

                    <h3 className="text-slate-300 font-medium mt-3">
                        No vehicles available
                    </h3>

                    <p className="text-sm text-slate-500 mt-1">
                        Vehicles will appear on the map when they are registered.
                    </p>

                </div>
            )}

        </section>
    );
};

export default FleetMap;
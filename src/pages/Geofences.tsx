import { useState } from "react";
import {
    MapContainer,
    Marker,
    Polygon,
    Popup,
    TileLayer,
    useMapEvents,
} from "react-leaflet";

import {
    createGeofence,
    type GeofenceCategory,
} from "../services/geofenceApi";

import "leaflet/dist/leaflet.css";

const DEFAULT_CENTER: [number, number] = [
    19.076,
    72.8777,
];

interface MapClickHandlerProps {
    onPointAdd: (point: [number, number]) => void;
}

const MapClickHandler = ({
                             onPointAdd,
                         }: MapClickHandlerProps) => {
    useMapEvents({
        click(event) {
            onPointAdd([
                event.latlng.lat,
                event.latlng.lng,
            ]);
        },
    });

    return null;
};

const Geofences = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const [category, setCategory] =
        useState<GeofenceCategory>("delivery_zone");

    const [coordinates, setCoordinates] = useState<
        [number, number][]
    >([]);

    const [loading, setLoading] = useState(false);

    const [message, setMessage] =
        useState<string | null>(null);

    const [error, setError] =
        useState<string | null>(null);

    const addPoint = (point: [number, number]) => {
        setCoordinates((previous) => [
            ...previous,
            point,
        ]);

        setMessage(null);
        setError(null);
    };

    const clearPoints = () => {
        setCoordinates([]);
        setMessage(null);
        setError(null);
    };

    const closePolygon = () => {
        if (coordinates.length < 3) {
            setError(
                "Select at least 3 points before closing the geofence."
            );
            return;
        }

        const firstPoint = coordinates[0];

        const lastPoint =
            coordinates[coordinates.length - 1];

        if (
            firstPoint[0] === lastPoint[0] &&
            firstPoint[1] === lastPoint[1]
        ) {
            return;
        }

        setCoordinates((previous) => [
            ...previous,
            firstPoint,
        ]);

        setError(null);
    };

    const handleSubmit = async (
        event: React.FormEvent
    ) => {
        event.preventDefault();

        setMessage(null);
        setError(null);

        if (!name.trim()) {
            setError("Geofence name is required.");
            return;
        }

        if (coordinates.length < 4) {
            setError(
                "Create a closed polygon with at least 4 coordinate points."
            );
            return;
        }

        const first = coordinates[0];

        const last =
            coordinates[coordinates.length - 1];

        const isClosed =
            first[0] === last[0] &&
            first[1] === last[1];

        if (!isClosed) {
            setError(
                "Close the polygon before creating the geofence."
            );
            return;
        }

        try {
            setLoading(true);

            await createGeofence({
                name: name.trim(),
                description:
                    description.trim() || undefined,
                coordinates,
                category,
            });

            setMessage(
                "Geofence created successfully."
            );

            setName("");
            setDescription("");
            setCategory("delivery_zone");
            setCoordinates([]);
        } catch (err) {
            console.error(
                "Failed to create geofence:",
                err
            );

            setError(
                "Failed to create geofence. Please check the backend."
            );
        } finally {
            setLoading(false);
        }
    };

    const polygonReady =
        coordinates.length >= 4 &&
        coordinates[0][0] ===
        coordinates[coordinates.length - 1][0] &&
        coordinates[0][1] ===
        coordinates[coordinates.length - 1][1];

    return (
        <div className="min-h-[calc(100vh-4rem)] text-white">

            <main className="max-w-7xl mx-auto px-6 py-8">

                {/* Header */}

                <div className="mb-8">

                    <p className="text-cyan-400 text-sm font-medium mb-2">
                        GEO-FENCE MANAGEMENT
                    </p>

                    <h1 className="text-3xl md:text-4xl font-bold">
                        Create Geofence
                    </h1>

                    <p className="text-slate-400 mt-2">
                        Draw a boundary on the map to create a
                        vehicle monitoring zone.
                    </p>

                </div>

                {/* Layout */}

                <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">

                    {/* Form */}

                    <section className="bg-[#0d1b2a] border border-slate-800 rounded-2xl p-6">

                        <h2 className="text-lg font-semibold">
                            Geofence Details
                        </h2>

                        <p className="text-sm text-slate-500 mt-1 mb-6">
                            Enter the information for this zone.
                        </p>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >

                            {/* Name */}

                            <div>

                                <label className="block text-sm text-slate-400 mb-2">
                                    Name
                                </label>

                                <input
                                    type="text"
                                    value={name}
                                    onChange={(event) =>
                                        setName(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Mumbai Delivery Zone"
                                    className="w-full px-4 py-3 rounded-lg bg-[#07111f] border border-slate-700 text-white placeholder:text-slate-600 outline-none focus:border-cyan-500 transition"
                                />

                            </div>

                            {/* Description */}

                            <div>

                                <label className="block text-sm text-slate-400 mb-2">
                                    Description
                                </label>

                                <textarea
                                    value={description}
                                    onChange={(event) =>
                                        setDescription(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Describe this geofence..."
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-lg bg-[#07111f] border border-slate-700 text-white placeholder:text-slate-600 outline-none focus:border-cyan-500 transition resize-none"
                                />

                            </div>

                            {/* Category */}

                            <div>

                                <label className="block text-sm text-slate-400 mb-2">
                                    Category
                                </label>

                                <select
                                    value={category}
                                    onChange={(event) =>
                                        setCategory(
                                            event.target
                                                .value as GeofenceCategory
                                        )
                                    }
                                    className="w-full px-4 py-3 rounded-lg bg-[#07111f] border border-slate-700 text-white outline-none focus:border-cyan-500 transition"
                                >
                                    <option value="delivery_zone">
                                        Delivery Zone
                                    </option>

                                    <option value="restricted_zone">
                                        Restricted Zone
                                    </option>

                                    <option value="toll_zone">
                                        Toll Zone
                                    </option>

                                    <option value="customer_area">
                                        Customer Area
                                    </option>
                                </select>

                            </div>

                            {/* Point count */}

                            <div className="bg-[#07111f] border border-slate-800 rounded-lg p-4">

                                <div className="flex justify-between">

                                    <span className="text-sm text-slate-400">
                                        Points
                                    </span>

                                    <span className="text-cyan-400 font-medium">
                                        {coordinates.length}
                                    </span>

                                </div>

                                <div className="flex justify-between mt-2">

                                    <span className="text-sm text-slate-400">
                                        Polygon
                                    </span>

                                    <span
                                        className={
                                            polygonReady
                                                ? "text-emerald-400 text-sm"
                                                : "text-amber-400 text-sm"
                                        }
                                    >
                                        {polygonReady
                                            ? "Closed"
                                            : "Not closed"}
                                    </span>

                                </div>

                            </div>

                            {/* Messages */}

                            {message && (
                                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
                                    {message}
                                </div>
                            )}

                            {error && (
                                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Actions */}

                            <div className="flex gap-3">

                                <button
                                    type="button"
                                    onClick={clearPoints}
                                    className="flex-1 px-4 py-3 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
                                >
                                    Clear
                                </button>

                                <button
                                    type="button"
                                    onClick={closePolygon}
                                    disabled={
                                        coordinates.length < 3
                                    }
                                    className="flex-1 px-4 py-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                >
                                    Close Polygon
                                </button>

                            </div>

                            <button
                                type="submit"
                                disabled={
                                    loading ||
                                    !polygonReady
                                }
                                className="w-full px-4 py-3 rounded-lg bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed transition"
                            >
                                {loading
                                    ? "Creating..."
                                    : "Create Geofence"}
                            </button>

                        </form>

                    </section>

                    {/* Map */}

                    <section className="bg-[#0d1b2a] border border-slate-800 rounded-2xl overflow-hidden">

                        <div className="px-6 py-5 border-b border-slate-800">

                            <div className="flex items-center justify-between">

                                <div>
                                    <h2 className="text-lg font-semibold">
                                        Draw Boundary
                                    </h2>

                                    <p className="text-sm text-slate-500 mt-1">
                                        Click on the map to add boundary
                                        points.
                                    </p>
                                </div>

                                <span className="px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs">
                                    {coordinates.length} points
                                </span>

                            </div>

                        </div>

                        <div className="h-[600px]">

                            <MapContainer
                                center={DEFAULT_CENTER}
                                zoom={11}
                                scrollWheelZoom
                                className="h-full w-full"
                            >

                                <TileLayer
                                    attribution="&copy; OpenStreetMap contributors"
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />

                                <MapClickHandler
                                    onPointAdd={addPoint}
                                />

                                {/* Polygon */}

                                {coordinates.length >= 3 && (
                                    <Polygon
                                        positions={
                                            coordinates
                                        }
                                        pathOptions={{
                                            color: "#06b6d4",
                                            fillColor:
                                                "#06b6d4",
                                            fillOpacity: 0.15,
                                            weight: 3,
                                        }}
                                    />
                                )}

                                {/* Point markers */}

                                {coordinates.map(
                                    (point, index) => (
                                        <Marker
                                            key={`${point[0]}-${point[1]}-${index}`}
                                            position={
                                                point
                                            }
                                        >
                                            <Popup>
                                                <div>
                                                    <strong>
                                                        Point{" "}
                                                        {index +
                                                            1}
                                                    </strong>

                                                    <p className="text-sm mt-1">
                                                        Lat:{" "}
                                                        {
                                                            point[0]
                                                        }
                                                    </p>

                                                    <p className="text-sm">
                                                        Lng:{" "}
                                                        {
                                                            point[1]
                                                        }
                                                    </p>
                                                </div>
                                            </Popup>
                                        </Marker>
                                    )
                                )}

                            </MapContainer>

                        </div>

                    </section>

                </div>

            </main>

        </div>
    );
};

export default Geofences;
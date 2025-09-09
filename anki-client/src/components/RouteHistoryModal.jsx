// src/components/RouteHistoryModal.jsx
import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import { getAgentRouteByDate } from "../api";

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Helper to move map to last marker
function FlyToMarker({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, map.getZoom());
  }, [position, map]);
  return null;
}

export default function RouteHistoryModal({ open, onClose, route = [], agent, live, loading }) {
  const [routeByDate, setRouteByDate] = useState(null);
  const [date, setDate] = useState("");
  const [loadingDate, setLoadingDate] = useState(false);

  const currentRoute = routeByDate || route;
  const lastPosition = currentRoute.length ? currentRoute[currentRoute.length - 1] : null;

  const handleDateChange = async (e) => {
    const selected = e.target.value;
    setDate(selected);

    if (!selected) {
      setRouteByDate(null);
      return;
    }

    setLoadingDate(true);
    try {
      const { data } = await getAgentRouteByDate(agent.agentId, selected);
      if (data.success) {
        setRouteByDate(data.data.map(loc => [loc.lat, loc.lng]));
      } else {
        setRouteByDate([]); // Ensure empty array if no data
      }
    } catch (err) {
      console.error("Error fetching route by date:", err);
      setRouteByDate([]);
    } finally {
      setLoadingDate(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-4">
          <Dialog.Title className="text-xl font-semibold mb-4">
            {agent.name} ({agent.agentId}) {live ? "📍 Live" : "🗺️ Route History"}
          </Dialog.Title>

          {/* Date picker */}
          <div className="mb-4">
            <label className="mr-2 font-medium">Filter by Date:</label>
            <input
              type="date"
              value={date}
              onChange={handleDateChange}
              className="border px-2 py-1 rounded-lg"
            />
          </div>

          {/* Map / Loading / No data */}
          <div className="w-full h-[500px] flex items-center justify-center">
            {(loading || loadingDate) ? (
              <div className="flex flex-col items-center space-y-3">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-slate-500">Loading route...</p>
              </div>
            ) : currentRoute.length > 0 ? (
              <MapContainer
                key={agent.agentId + currentRoute.length}
                center={lastPosition || [0, 0]}
                zoom={13}
                style={{ width: "100%", height: "100%" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Polyline positions={currentRoute} color={live ? "green" : "blue"} />
                <Marker position={lastPosition} />
                <FlyToMarker position={lastPosition} />
              </MapContainer>
            ) : date ? (
              <p className="text-slate-500">No route history for the selected date.</p>
            ) : (
              <p className="text-slate-500">No route data available.</p>
            )}
          </div>

          {/* Close button */}
          <div className="mt-4 text-right">
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

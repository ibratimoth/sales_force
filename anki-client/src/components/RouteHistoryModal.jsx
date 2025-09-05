// src/components/RouteHistoryModal.jsx
import { useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";

// Leaflet marker icon fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Helper to move map to latest marker
function FlyToMarker({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, map.getZoom());
  }, [position, map]);
  return null;
}

export default function RouteHistoryModal({ open, onClose, route = [], agent, live }) {
  const lastPosition = route.length ? route[route.length - 1] : null;

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-4">
          <Dialog.Title className="text-xl font-semibold mb-4">
            {agent.name} ({agent.agentId}) {live ? "📍 Live" : "🗺️ Route History"}
          </Dialog.Title>

          <div className="w-full h-[500px]">
            <MapContainer
              center={lastPosition || [0, 0]}
              zoom={13}
              style={{ width: "100%", height: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              {route.length > 0 && (
                <>
                  <Polyline positions={route} color={live ? "green" : "blue"} />
                  <Marker position={lastPosition} />
                  <FlyToMarker position={lastPosition} />
                </>
              )}
            </MapContainer>
          </div>

          <div className="mt-4 text-right">
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-lg"
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

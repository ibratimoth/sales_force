import { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

export default function AgentNoteModal({ isOpen, onClose, onSubmit, note }) {
  const [form, setForm] = useState({ locationName: "", activityDone: "" });
  const [gps, setGps] = useState({ lat: null, lng: null, status: "pending" });

  useEffect(() => {
    if (note) {
      setForm({ locationName: note.location_name, activityDone: note.activity_done });
      setGps({ lat: note.lat, lng: note.lng, status: "captured" });
    } else {
      setForm({ locationName: "", activityDone: "" });
      setGps({ lat: null, lng: null, status: "pending" });

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => setGps({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            status: "captured",
          }),
          () => setGps((prev) => ({ ...prev, status: "error" })),
          { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
        );
      } else setGps((prev) => ({ ...prev, status: "error" }));
    }
  }, [note, isOpen]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ 
      locationName: form.locationName,
      activityDone: form.activityDone,
      lat: gps.lat,
      lng: gps.lng
    });
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => {}}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel
              className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <Dialog.Title className="text-xl font-semibold mb-4">
                {note ? "Edit Note" : "Add Note"}
              </Dialog.Title>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  name="locationName"
                  value={form.locationName}
                  onChange={handleChange}
                  placeholder="Location Name"
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <textarea
                  name="activityDone"
                  value={form.activityDone}
                  onChange={handleChange}
                  placeholder="Activity Done"
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <div className="text-sm text-gray-600">
                  {gps.status === "pending" && "📍 Capturing location..."}
                  {gps.status === "captured" && (
                    <span className="text-green-600">
                      ✅ Location captured (Lat: {gps.lat?.toFixed(4)}, Lng: {gps.lng?.toFixed(4)})
                    </span>
                  )}
                  {gps.status === "error" && <span className="text-red-600">❌ Failed to capture location</span>}
                </div>

                <div className="flex justify-end space-x-2 mt-4">
                  <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-gray-800">
                    Cancel
                  </button>
                  <button type="submit" disabled={gps.status !== "captured"} className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 text-white">
                    Save
                  </button>
                </div>
              </form>

              <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">✕</button>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}

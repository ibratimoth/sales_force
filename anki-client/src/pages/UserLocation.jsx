import { useEffect, useState, useRef } from "react";
import Layout from "../components/Layout";
import io from "socket.io-client";
import {
  checkIn,
  checkOut,
  addLocation,
  isCheckedIn,
  getAgentNotes,
  createAgentNote,
  updateAgentNote,
  deleteAgentNote,
} from "../api";
import { useSelector } from "react-redux";
import AgentNoteModal from "../components/AgentNoteModal";
import toast from "react-hot-toast";
import NProgress from "nprogress";

const API_BASE = "https://salesforceapi.rigel.co.tz";

export default function AgentPage() {
  const { user } = useSelector((state) => state.auth);
  const agentId = user?.id;
  const agent_name = user?.name;

  const [checkedIn, setCheckedIn] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const [notes, setNotes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  const socketRef = useRef(null);
  const locationIntervalRef = useRef(null);

  useEffect(() => {
    if (!agentId) return;
    (async () => {
      try {
        const { data } = await isCheckedIn(agentId);
        setCheckedIn(Boolean(data.data));
      } catch (err) {
        console.error("Error checking status:", err);
      }
    })();
  }, [agentId]);

  const loadNotes = async () => {
    if (!agentId) return;
    try {
      const { data } = await getAgentNotes(agentId);
      if (data.success) setNotes(data.data);
    } catch (err) {
      console.error("Error fetching notes:", err);
    }
  };

  useEffect(() => {
    loadNotes();
  }, [agentId]);

  const startTracking = () => {
    if (!navigator.geolocation) {
      setStatusMsg("❌ Geolocation not supported.");
      return;
    }

    socketRef.current = io(API_BASE, { withCredentials: true });

    locationIntervalRef.current = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          const timestamp = Date.now();

          try {
            await addLocation(agentId, latitude, longitude);
            if (socketRef.current) {
              socketRef.current.emit("agentLocationUpdate", {
                agentId,
                lat: latitude,
                lng: longitude,
                timestamp,
              });
            }
          } catch (err) {
            console.error("Error sending location:", err);
          }
        },
        (err) => console.error("Geo error:", err),
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
      );
    }, 10000);
  };

  const stopTracking = () => {
    if (locationIntervalRef.current) clearInterval(locationIntervalRef.current);
    if (socketRef.current) socketRef.current.disconnect();
    locationIntervalRef.current = null;
    socketRef.current = null;
  };

  // ------------------- Updated functions with NProgress + toast -------------------

  const handleCheckIn = async () => {
    try {
      NProgress.start();
      const { data } = await checkIn(agentId);
      if (data.success) {
        setCheckedIn(true);
        setStatusMsg("✅ Checked in successfully. Tracking started.");
        toast.success("Checked in successfully!");
        startTracking();
      } else {
        setStatusMsg("❌ " + data.message);
        toast.error(data.message);
      }
    } catch (err) {
      console.error("Check-in error:", err);
      setStatusMsg("❌ Server error during check-in.");
      toast.error("Server error during check-in");
    } finally {
      NProgress.done();
    }
  };

  const handleCheckOut = async () => {
    try {
      NProgress.start();
      const { data } = await checkOut(agentId);
      if (data.success) {
        setCheckedIn(false);
        setStatusMsg("✅ Checked out. Tracking stopped.");
        toast.success("Checked out successfully!");
        stopTracking();
      } else {
        setStatusMsg("❌ " + data.message);
        toast.error(data.message);
      }
    } catch (err) {
      console.error("Check-out error:", err);
      setStatusMsg("❌ Server error during check-out.");
      toast.error("Server error during check-out");
    } finally {
      NProgress.done();
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!confirm("Are you sure you want to delete this note?")) return;
    try {
      NProgress.start();
      const { data } = await deleteAgentNote(noteId);
      if (data.success) {
        setNotes((prev) => prev.filter((n) => n.id !== noteId));
        toast.success("Note deleted successfully!");
      } else {
        toast.error(data.message || "Failed to delete note");
      }
    } catch (err) {
      console.error("Error deleting note:", err);
      toast.error("Error deleting note");
    } finally {
      NProgress.done();
    }
  };

  const handleSaveNote = async ({ locationName, activityDone, lat, lng }) => {
    if (!lat || !lng) {
      alert("⚠ You must allow location access to save a note.");
      return;
    }

    const payload = { agentId, locationName, activityDone, lat, lng };

    try {
      NProgress.start();
      if (selectedNote) {
        const { data } = await updateAgentNote(selectedNote.id, payload);
        if (data.success) {
          setNotes((prev) =>
            prev.map((n) => (n.id === selectedNote.id ? data.data : n))
          );
          toast.success("Note updated successfully!");
        } else {
          toast.error(data.message || "Failed to update note");
        }
      } else {
        const { data } = await createAgentNote(payload);
        if (data.success) {
          setNotes((prev) => [...prev, data.data]);
          toast.success("Note created successfully!");
        } else {
          toast.error(data.message || "Failed to create note");
        }
      }
    } catch (err) {
      console.error("Error saving note:", err);
      toast.error("Error saving note");
    } finally {
      NProgress.done();
    }
  };
  // -----------------------------------------------------------------------

  useEffect(() => {
    return () => stopTracking();
  }, []);

  if (!agentId)
    return (
      <Layout>
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-red-600 font-semibold">
            ⚠ No logged-in agent found.
          </p>
        </div>
      </Layout>
    );

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl font-semibold text-slate-800 mb-6">
          Agent Dashboard
        </h1>

        <p className="mb-4 text-slate-600">
          Agent Name: <strong>{agent_name}</strong>
        </p>

        <div className="space-x-4 mb-6">
          {!checkedIn ? (
            <button
              onClick={handleCheckIn}
              className="px-4 py-2 bg-green-600 text-white rounded-lg"
            >
              ✅ Check In
            </button>
          ) : (
            <button
              onClick={handleCheckOut}
              className="px-4 py-2 bg-red-600 text-white rounded-lg"
            >
              ⛔ Check Out
            </button>
          )}
        </div>

        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Notes</h2>
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            + Add Note
          </button>
        </div>

        <ul className="divide-y divide-slate-200">
          {notes.length === 0 && <p className="text-slate-500">No notes yet.</p>}
          {notes.map((note) => (
            <li
              key={note.id}
              className="p-3 flex justify-between items-center hover:bg-slate-100 transition cursor-pointer"
            >
              <div>
                <p className="font-medium">{note.location_name}</p>
                <p className="text-slate-500 text-sm">{note.activity_done}</p>
                <p className="text-slate-400 text-xs">
                  📍 Lat: {note.lat}, Lng: {note.lng}
                </p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => setSelectedNote(note) || setModalOpen(true)}
                  className="px-2 py-1 bg-yellow-400 rounded text-white hover:bg-yellow-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="px-2 py-1 bg-red-600 rounded text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>

        <AgentNoteModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          note={selectedNote}
          onSubmit={handleSaveNote}
        />
      </div>
    </Layout>
  );
}

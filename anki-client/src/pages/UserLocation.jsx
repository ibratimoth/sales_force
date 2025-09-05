// src/pages/AgentPage.js
import { useEffect, useState, useRef } from "react";
import Layout from "../components/Layout";
import io from "socket.io-client";
import { checkIn, checkOut, addLocation, isCheckedIn } from "../api";
import { useSelector } from "react-redux";

const API_BASE = "http://localhost:3000"; // backend base URL

export default function AgentPage() {
  const { user } = useSelector((state) => state.auth); // Logged-in user
  const agentId = user?.id;
  const agent_name = user?.name;

  const [checkedIn, setCheckedIn] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const socketRef = useRef(null);
  const locationIntervalRef = useRef(null);

  // 🔹 On mount → check if already checked in
  useEffect(() => {
    if (!agentId) return;

    const loadStatus = async () => {
      try {
        const { data } = await isCheckedIn(agentId);
        setCheckedIn(Boolean(data.data));
      } catch (err) {
        console.error("Error checking status:", err);
      }
    };
    loadStatus();
  }, [agentId]);

  // 🔹 Start location updates
  const startTracking = () => {
    if (!navigator.geolocation) {
      setStatusMsg("❌ Geolocation not supported by this browser.");
      return;
    }

    socketRef.current = io(API_BASE, { withCredentials: true });

    locationIntervalRef.current = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          const timestamp = Date.now();

          try {
            // Save in DB
            await addLocation(agentId, latitude, longitude);

            // Emit to socket
            if (socketRef.current) {
              socketRef.current.emit("agentLocationUpdate", {
                agentId,
                lat: latitude,
                lng: longitude,
                timestamp,
              });
            }

            console.log("📍 Location sent:", latitude, longitude);
          } catch (err) {
            console.error("Error sending location:", err);
          }
        },
        (err) => console.error("Geo error:", err),
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
      );
    }, 10000); // every 10s
  };

  // 🔹 Stop location updates
  const stopTracking = () => {
    if (locationIntervalRef.current) {
      clearInterval(locationIntervalRef.current);
      locationIntervalRef.current = null;
    }
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  };

  // 🔹 Handle check-in
  const handleCheckIn = async () => {
    try {
      const { data } = await checkIn(agentId);
      if (data.success) {
        setCheckedIn(true);
        setStatusMsg("✅ Checked in successfully. Tracking started.");
        startTracking();
      } else {
        setStatusMsg("❌ " + data.message);
      }
    } catch (err) {
      console.error("Check-in error:", err);
      setStatusMsg("❌ Server error during check-in.");
    }
  };

  // 🔹 Handle check-out
  const handleCheckOut = async () => {
    try {
      const { data } = await checkOut(agentId);
      if (data.success) {
        setCheckedIn(false);
        setStatusMsg("✅ Checked out. Tracking stopped.");
        stopTracking();
      } else {
        setStatusMsg("❌ " + data.message);
      }
    } catch (err) {
      console.error("Check-out error:", err);
      setStatusMsg("❌ Server error during check-out.");
    }
  };

  // 🔹 Cleanup on unmount
  useEffect(() => {
    return () => stopTracking();
  }, []);

  if (!agentId) {
    return (
      <Layout>
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-red-600 font-semibold">⚠ No logged-in agent found.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl font-semibold text-slate-800 mb-6">
          Agent Dashboard
        </h1>

        <p className="mb-4 text-slate-600">Agent Name: <strong>{agent_name}</strong></p>

        <div className="space-x-4">
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

        {statusMsg && <p className="mt-4 text-slate-700">{statusMsg}</p>}
      </div>
    </Layout>
  );
}

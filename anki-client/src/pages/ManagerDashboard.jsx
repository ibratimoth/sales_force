// src/pages/ManagerDashboard.js
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import io from "socket.io-client";
import { getAgentsByStatus, getAgentRoute } from "../api";
import RouteHistoryModal from "../components/RouteHistoryModal";

const API_BASE = "http://localhost:3000";

export default function ManagerDashboard() {
  const [tab, setTab] = useState("checkedIn"); // "checkedIn" | "checkedOut"
  const [agents, setAgents] = useState([]); // all agents
  const [routes, setRoutes] = useState({}); // { agentId: [[lat,lng], ...] }
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  /** Fetch all agents grouped by status */
useEffect(() => {
  const fetchAgents = async () => {
    try {
      const { data } = await getAgentsByStatus();
      if (data.success) {
        // Combine checkedIn and checkedOut
        const allRecords = [...data.data.checkedIn, ...data.data.checkedOut];

        // Create a map to keep the latest record per agent
        const latestByAgent = {};

        allRecords.forEach(record => {
          const agentId = record.agent_id;
          const existing = latestByAgent[agentId];

          // Determine the timestamp to compare: use checkout_time if exists, else checkin_time
          const recordTime = record.checkout_time
            ? new Date(record.checkout_time).getTime()
            : new Date(record.checkin_time).getTime();

          const existingTime = existing
            ? existing.checkout_time
              ? new Date(existing.checkout_time).getTime()
              : new Date(existing.checkin_time).getTime()
            : 0;

          // Keep the latest record
          if (!existing || recordTime > existingTime) {
            latestByAgent[agentId] = record;
          }
        });

        // Map latest records to dashboard agent format
        const mappedAgents = Object.values(latestByAgent).map(record => ({
          agentId: record.agent_id,
          name: `${record.user2.first_name} ${record.user2.last_name}`,
          checkinTime: record.checkin_time,
          checkoutTime: record.checkout_time,
          checkedIn: !record.checkout_time, // if checkout_time exists => false, else true
        }));

        setAgents(mappedAgents);
      }
    } catch (err) {
      console.error("Error fetching agents:", err);
    }
  };

  fetchAgents();
}, []);


  /** Socket for live location updates */
  useEffect(() => {
    const socket = io(API_BASE, { withCredentials: true });

    socket.on("connect", () => {
      console.log("Manager connected:", socket.id);
    });

    socket.on("locationUpdate", ({ agentId, lat, lng, timestamp }) => {
      setAgents(prev =>
        prev.map(a =>
          a.agentId === agentId ? { ...a, lat, lng, timestamp } : a
        )
      );

      setRoutes(prev => ({
        ...prev,
        [agentId]: prev[agentId]
          ? [...prev[agentId], [lat, lng]]
          : [[lat, lng]],
      }));
    });

    return () => socket.disconnect();
  }, []);

  /** Open modal for route history */
  const openModal = async agent => {
    setSelectedAgent(agent);

    if (!agent.checkedIn) {
      // Fetch route history for checked-out agents
      try {
        const { data } = await getAgentRoute(agent.agentId);
        if (data.success) {
          setRoutes(prev => ({
            ...prev,
            [agent.agentId]: data.data.map(loc => [loc.lat, loc.lng]),
          }));
        }
      } catch (err) {
        console.error("Error fetching route:", agent.agentId, err);
      }
    }

    setModalOpen(true);
  };

  /** Agents filtered by selected tab */
  const displayedAgents = agents.filter(a =>
    tab === "checkedIn" ? a.checkedIn : !a.checkedIn
  );

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl font-semibold text-slate-800 mb-4">
          Manager Dashboard
        </h1>

        {/* Tabs */}
        <div className="flex space-x-4 mb-4">
          <button
            className={`px-4 py-2 rounded-lg ${
              tab === "checkedIn"
                ? "bg-blue-600 text-white"
                : "bg-slate-200 text-slate-700"
            }`}
            onClick={() => setTab("checkedIn")}
          >
            Checked In
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              tab === "checkedOut"
                ? "bg-blue-600 text-white"
                : "bg-slate-200 text-slate-700"
            }`}
            onClick={() => setTab("checkedOut")}
          >
            Checked Out
          </button>
        </div>

        {/* Agent List */}
        <ul className="mb-6 divide-y divide-slate-200">
          {displayedAgents.length === 0 && (
            <p className="text-slate-500">No agents found.</p>
          )}
          {displayedAgents.map(agent => (
            <li
              key={agent.agentId + agent.checkinTime} // unique key even if same agent multiple times
              className="cursor-pointer p-3 hover:bg-slate-100 transition"
              onClick={() => openModal(agent)}
            >
              <span className="font-medium text-slate-800">{agent.name}</span>{" "}
              <span className="text-slate-500">({agent.agentId})</span>
              {agent.checkinTime && (
                <span className="text-slate-400 text-sm ml-2">
                  {new Date(agent.checkinTime).toLocaleTimeString()}
                </span>
              )}
            </li>
          ))}
        </ul>

        {/* Route Modal */}
        {modalOpen && selectedAgent && (
          <RouteHistoryModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            route={routes[selectedAgent.agentId] || []}
            agent={selectedAgent}
            live={selectedAgent.checkedIn}
          />
        )}
      </div>
    </Layout>
  );
}

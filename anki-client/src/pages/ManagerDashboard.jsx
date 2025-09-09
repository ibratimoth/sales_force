// src/pages/ManagerDashboard.js
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import io from "socket.io-client";
import { getAgentsByStatus, getAgentRoute } from "../api";
import RouteHistoryModal from "../components/RouteHistoryModal";

const API_BASE = "https://salesforceapi.rigel.co.tz";

export default function ManagerDashboard() {
  const [tab, setTab] = useState("checkedIn");
  const [agents, setAgents] = useState([]);
  const [routes, setRoutes] = useState({});
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingRoute, setLoadingRoute] = useState(false); // ✅ new

  /** Fetch all agents grouped by status */
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const { data } = await getAgentsByStatus();
        if (data.success) {
          const allRecords = [...data.data.checkedIn, ...data.data.checkedOut];
          const latestByAgent = {};

          allRecords.forEach(record => {
            const agentId = record.agent_id;
            const existing = latestByAgent[agentId];

            const recordTime = record.checkout_time
              ? new Date(record.checkout_time).getTime()
              : new Date(record.checkin_time).getTime();

            const existingTime = existing
              ? existing.checkout_time
                ? new Date(existing.checkout_time).getTime()
                : new Date(existing.checkin_time).getTime()
              : 0;

            if (!existing || recordTime > existingTime) {
              latestByAgent[agentId] = record;
            }
          });

          const mappedAgents = Object.values(latestByAgent).map(record => ({
            agentId: record.agent_id,
            name: `${record.user2.first_name} ${record.user2.last_name}`,
            checkinTime: record.checkin_time,
            checkoutTime: record.checkout_time,
            checkedIn: !record.checkout_time,
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

    // 🔹 Live location updates
    socket.on("locationUpdate", ({ agentId, lat, lng, timestamp }) => {
      setAgents(prev =>
        prev.map(a =>
          a.agentId === agentId
            ? { ...a, lat, lng, timestamp }
            : a
        )
      );

      setRoutes(prev => ({
        ...prev,
        [agentId]: prev[agentId]
          ? [...prev[agentId], [lat, lng]]
          : [[lat, lng]],
      }));
    });

    // 🔹 Agent checked in
    socket.on("agentCheckIn", ({ agentId }) => {
      setAgents(prev => {
        const exists = prev.find(a => a.agentId === agentId);

        if (exists) {
          // ✅ Update existing
          return prev.map(a =>
            a.agentId === agentId
              ? { ...a, checkedIn: true, checkoutTime: null }
              : a
          );
        } else {
          // ✅ Fetch new agent info and add
          (async () => {
            try {
              const { data } = await getAgentsByStatus();
              if (data.success) {
                const record = [...data.data.checkedIn, ...data.data.checkedOut]
                  .find(r => r.agent_id === agentId);

                if (record) {
                  const newAgent = {
                    agentId: record.agent_id,
                    name: `${record.user2.first_name} ${record.user2.last_name}`,
                    checkinTime: record.checkin_time,
                    checkoutTime: record.checkout_time,
                    checkedIn: !record.checkout_time,
                  };

                  setAgents(current => [...current, newAgent]);
                }
              }
            } catch (err) {
              console.error("Error fetching new agent:", err);
            }
          })();

          return prev; // temporary return, async will add later
        }
      });
    });

    // 🔹 Agent checked out
    socket.on("agentCheckOut", ({ agentId }) => {
      setAgents(prev =>
        prev.map(a =>
          a.agentId === agentId
            ? { ...a, checkedIn: false, checkoutTime: new Date().toISOString() }
            : a
        )
      );
    });

    return () => socket.disconnect();
  }, []);

  /** Open modal for route history */
  const openModal = async agent => {
    setSelectedAgent(agent);
    setModalOpen(true);

    if (!agent.checkedIn) {
      setLoadingRoute(true); // ✅ show loading
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
      } finally {
        setLoadingRoute(false); // ✅ stop loading
      }
    }
  };

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
            className={`px-4 py-2 rounded-lg ${tab === "checkedIn"
              ? "bg-blue-600 text-white"
              : "bg-slate-200 text-slate-700"
              }`}
            onClick={() => setTab("checkedIn")}
          >
            Checked In
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${tab === "checkedOut"
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
              key={agent.agentId + agent.checkinTime}
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
            loading={loadingRoute} // ✅ pass loading
          />
        )}
      </div>
    </Layout>
  );
}

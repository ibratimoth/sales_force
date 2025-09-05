export default function AgentPopup({ agent }) {
  return (
    <div>
      <strong>{agent.name}</strong>
      <br />
      <span className="text-xs text-slate-600">ID: {agent.agentId}</span>
      <br />
      Status: {agent.checkedIn ? "🟢 Checked-in" : "🔴 Checked-out"}
      <br />
      Lat: {agent.lat}, Lng: {agent.lng}
      <br />
      Last Update: {agent.timestamp ? new Date(agent.timestamp).toLocaleTimeString() : "N/A"}
    </div>
  );
}

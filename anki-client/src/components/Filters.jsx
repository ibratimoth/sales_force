import { useState, useEffect } from "react";
export default function Filters({ agents, onFilterChange }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  useEffect(() => {
    const filtered = agents.filter(a => {
      const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        status === "all" ? true : status === "checkedIn" ? a.checkedIn : !a.checkedIn;
      return matchesSearch && matchesStatus;
    });
    onFilterChange(filtered);
  }, [search, status, agents, onFilterChange]);

  return (
    <div className="flex gap-2 mb-4">
      <input
        type="text"
        placeholder="Search agent..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="px-2 py-1 border rounded"
      />
      <select value={status} onChange={e => setStatus(e.target.value)} className="px-2 py-1 border rounded">
        <option value="all">All</option>
        <option value="checkedIn">Checked-in</option>
        <option value="checkedOut">Checked-out</option>
      </select>
    </div>
  );
}

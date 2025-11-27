import React, { useState, useEffect } from "react";
import API from "../api";

export default function AddEventForm({ siteId, onAdd }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sites, setSites] = useState([]);
  const [localSite, setLocalSite] = useState(siteId || "");
  const [selectedSite, setSelectedSite] = useState(siteId || "");


  useEffect(() => {
    const data = API.get("/heritage/sites/").then(res => setSites(res.data)).catch(err => console.error(err));
    console.log(sites);
    
    
  }, []);

  useEffect(() => {
  if (sites.length && !selectedSite) {
    setSelectedSite(sites[0].id.toString());
  }
}, [sites]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const payload = { site: siteId, title, details: description, date };
      console.log(localSite);
      
      const res = await API.post(`/heritage/sites/${localSite}/events/add/`, payload);
      onAdd(res.data);
      setTitle("");
      setDescription("");
      setDate("");
    } catch (err) {
      setError("Failed to add event.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 p-4 border rounded bg-white shadow max-w-md">
      <h2 className="text-xl mb-4 font-semibold">Add Event</h2>

      {error && <p className="text-red-600 mb-2">{error}</p>}

      <label className="block mb-2">Title</label>
      <input
        type="text"
        className="w-full mb-4 border px-3 py-2 rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <label className="block mb-2">Description</label>
      <textarea
        className="w-full mb-4 border px-3 py-2 rounded"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <label className="block mb-2">Date</label>
      <input
        type="date"
        className="w-full mb-4 border px-3 py-2 rounded"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />

      <label className="block mb-2">Site</label>
      <select
        value={localSite}
        onChange={e => setLocalSite(e.target.value)}
        className="w-full mb-4 border px-3 py-2 rounded"
        required
      >
        {sites.map(site => (
          <option key={site.id} value={site.id}>{site.name}</option>
        ))}
      </select>

      <button
        type="submit"
        disabled={loading}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
      >
        {loading ? "Adding..." : "Add Event"}
      </button>
    </form>
  );
}

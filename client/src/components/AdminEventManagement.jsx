import React, { useEffect, useState } from "react";
import API from "../api";
import AddEventForm from "./AddEventForm";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function AdminEventManagement() {
  const [events, setEvents] = useState([]);
  const [sites, setSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState(null);
  const [error, setError] = useState(null);

  // Set default selected site once sites are loaded
  useEffect(() => {
    if (sites.length && !selectedSite) {
      setSelectedSite(sites[0].id.toString());
    }
  }, [sites]);

  // Load all sites and upcoming events on mount
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [sitesRes, eventsRes] = await Promise.all([
          API.get("/heritage/sites/"),
          API.get("/heritage/events/upcoming/"),
        ]);
        setSites(sitesRes.data);
        setEvents(eventsRes.data);
        console.log(eventsRes.data);
        
      } catch (err) {
        setError("Failed to load events");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Add new event to state
  const handleAddEvent = (newEvent) => {
    setEvents((prev) => [newEvent, ...prev]);
    setShowAddModal(false);
  };

  // Prepare for editing an event
  const handleEditClick = (event) => {
    setEditingId(event.id);
    setEditData(event);
    setSelectedSite(event.site.toString());
  };

  // Update event handler
  async function handleUpdateEvent(eventId, updatedFields) {
    try {
      const res = await API.patch(
        `/heritage/sites/${updatedFields.site}/events/${eventId}/`,
        {
          title: updatedFields.title,
          date: updatedFields.date,
          details: updatedFields.details,
        }
      );
      setEvents((prev) =>
        prev.map((evt) => (evt.id === eventId ? res.data : evt))
      );
      setEditingId(null);
      setEditData(null);
    } catch (err) {
      alert("Failed to update event");
      console.error(err);
    }
  }

  // Delete event handler
  async function handleDeleteEvent(event) {
    if (!window.confirm(`Are you sure you want to delete the event "${event.title}"?`))
      return;

    try {
      await API.delete(`/heritage/sites/${event.site}/events/${event.id}/`);
      setEvents((prev) => prev.filter((e) => e.id !== event.id));
    } catch (err) {
      alert("Delete failed!");
      console.error(err);
    }
  }

  // Filter events by selected site
  const filteredEvents = selectedSite
    ? events.filter((e) => e.site === parseInt(selectedSite))
    : events;

  return (
    <div className="w-full relative p-6 bg-gray-50 min-h-screen">
      {/* Add Event Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="bg-white rounded-xl shadow-lg max-w-lg w-full max-h-[90vh] overflow-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-4 text-2xl font-bold text-gray-600 hover:text-black z-10"
              onClick={() => setShowAddModal(false)}
              aria-label="Close Add Event Modal"
            >
              ✕
            </button>
            <AddEventForm siteId={selectedSite} onAdd={handleAddEvent} />
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      {editingId && editData && (
        <div
          className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center"
          onClick={() => {
            setEditingId(null);
            setEditData(null);
          }}
        >
          <div
            className="bg-white rounded-xl shadow-lg max-w-lg w-full max-h-[90vh] overflow-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-4 text-2xl font-bold text-gray-600 hover:text-black z-10"
              onClick={() => {
                setEditingId(null);
                setEditData(null);
              }}
              aria-label="Close Edit Event Modal"
            >
              ✕
            </button>
            <EditEventForm
              event={editData}
              sites={sites}
              onUpdate={handleUpdateEvent}
              onCancel={() => {
                setEditingId(null);
                setEditData(null);
              }}
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900">All Heritage Events</h2>
        <div className="flex gap-2 items-center">
          <select
            className="border border-gray-300 rounded px-3 py-2"
            value={selectedSite}
            onChange={(e) => setSelectedSite(e.target.value)}
          >
            <option value="">All Sites</option>
            {sites.map((site) => (
              <option key={site.id} value={site.id.toString()}>
                {site.name}
              </option>
            ))}
          </select>
          <button
            className="bg-indigo-600 text-white px-5 py-2 rounded shadow font-semibold hover:bg-indigo-700 transition"
            onClick={() => setShowAddModal(true)}
            disabled={!selectedSite}
            title={selectedSite ? "Add event to selected site" : "Select a site first"}
          >
            + Add Event
          </button>
        </div>
      </div>

      {error && <div className="mb-4 text-center text-red-600 font-semibold">{error}</div>}

      {loading ? (
        <div className="my-20 text-center text-gray-500 text-xl">Loading events...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className="py-3 px-4 text-left font-semibold">Event</th>
                <th className="py-3 px-4 text-left font-semibold">Site</th>
                <th className="py-3 px-4 text-left font-semibold">Date</th>
                <th className="py-3 px-4 text-left font-semibold">Description</th>
                <th className="py-3 px-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {false ? (
                <tr>
                  <td colSpan="5" className="py-6 text-center text-gray-500">
                    No events found.
                  </td>
                </tr>
              ) : (
                events.map((ev) => {
                  const siteObj = sites.find((s) => s.id === ev.site) || {};
                  return (
                    <tr
                      key={ev.id}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4 font-semibold">{ev.title}</td>
                      <td className="py-3 px-4">{siteObj.name}</td>
                      <td className="py-3 px-4">{ev.date?.slice(0, 10)}</td>
                      <td className="py-3 px-4 whitespace-pre-wrap max-w-[300px] truncate">{ev.details}</td>
                      <td className="py-3 px-4 text-center space-x-2">
                        <button
                          className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800"
                          onClick={() => handleEditClick(ev)}
                          aria-label={`Edit ${ev.title}`}
                        >
                          <FaEdit />
                          Edit
                        </button>
                        <button
                          className="inline-flex items-center gap-1 text-red-600 hover:text-red-800"
                          onClick={() => handleDeleteEvent(ev)}
                          aria-label={`Delete ${ev.title}`}
                        >
                          <FaTrash />
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ----------------
// EditEventForm Component (unchanged logic, just clean imports)

export function EditEventForm({ event, sites, onUpdate, onCancel }) {
  const [title, setTitle] = useState(event.title || "");
  const [details, setDetails] = useState(event.details || "");
  const [date, setDate] = useState(event.date?.slice(0, 10) || "");
  const [site, setSite] = useState(event.site || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onUpdate(event.id, { title, details, date, site });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Edit Event</h2>

      <label className="block mb-1 font-medium">Title</label>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="w-full p-2 mb-4 border border-gray-300 rounded"
        type="text"
      />

      <label className="block mb-1 font-medium">Description</label>
      <textarea
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded"
        rows={4}
      />

      <label className="block mb-1 font-medium">Date</label>
      <input
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
        className="w-full p-2 mb-4 border border-gray-300 rounded"
        type="date"
      />

      <label className="block mb-1 font-medium">Site</label>
      <select
        value={site}
        onChange={(e) => setSite(e.target.value)}
        required
        className="w-full p-2 mb-6 border border-gray-300 rounded"
      >
        {sites.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className={`flex-grow bg-indigo-600 text-white p-3 rounded-lg font-semibold transition ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-700"
          }`}
        >
          {loading ? "Saving..." : "Update"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-grow bg-gray-200 text-gray-800 p-3 rounded-lg font-semibold hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

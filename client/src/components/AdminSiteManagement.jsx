import React, { useEffect, useState } from "react";
import AddHeritageSiteForm from "./AddHeritageSiteForm";
import API from "../api";
import { FaTrash, FaEdit } from "react-icons/fa";

export default function AdminSiteManagement() {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState(null);
  const [error, setError] = useState(null);

  async function handleDelete(siteId) {
  if (!window.confirm("Are you sure you want to delete this site?")) {
    return;
  }
  try {
    await API.delete(`/heritage/sites/${siteId}/`);
    setSites((prevSites) => prevSites.filter(site => site.id !== siteId));
  } catch (err) {
    alert("Failed to delete the site. Please try again.");
    console.error(err);
  }
}

  const fetchSites = async () => {
    setLoading(true);
    try {
      const res = await API.get("/heritage/sites/");
      setSites(res.data);
    } catch (err) {
      setError("Failed to load sites");
      setSites([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSites();
  }, []);

  // Modal handler
  function handleAddSiteForm(newSite) {
    setSites(prev => [newSite, ...prev]);
    setShowAddModal(false);
  }

  // Edit handler
  function handleEditClick(site) {
    setEditingId(site.id);
    setEditData(site);
  }

  async function handleUpdateSite(siteId, updatedFields) {
    try {
      const formData = new FormData();
      for (const key in updatedFields) {
        if (key === "tags") {
          updatedFields.tags.forEach(tag => formData.append("tags", tag));
        } else if (updatedFields[key] !== null && updatedFields[key] !== "") {
          formData.append(key, updatedFields[key]);
        }
      }
      const res = await API.patch(`/heritage/sites/${siteId}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSites(prev =>
        prev.map(s => (s.id === siteId ? res.data : s))
      );
      setEditingId(null);
      setEditData(null);
    } catch (err) {
      alert("Failed to update site");
      console.error(err);
    }
  }

  return (
    <div className="w-full relative">
      {/* Add Modal */}
      {showAddModal && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
    style={{ backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)" }}
  >
    <div
      className="relative bg-white rounded-xl shadow-lg max-w-2xl w-full mx-4 my-8 overflow-y-auto max-h-[90vh]"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="absolute top-2 right-4 text-lg font-bold text-gray-600 hover:text-black z-10"
        onClick={() => setShowAddModal(false)}
        aria-label="Close"
      >
        ✕
      </button>
      <div className="p-6">
        <AddHeritageSiteForm onAdd={handleAddSiteForm} />
      </div>
    </div>
  </div>
)}

{editingId && editData && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
    style={{ backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)" }}
  >
    <div
      className="relative bg-white rounded-xl shadow-lg max-w-2xl w-full mx-4 my-8 overflow-y-auto max-h-[90vh]"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="absolute top-2 right-4 text-lg font-bold text-gray-600 hover:text-black z-10"
        onClick={() => {
          setEditingId(null);
          setEditData(null);
        }}
        aria-label="Close"
      >
        ✕
      </button>
      <div className="p-6">
        <EditHeritageSiteForm
          site={editData}
          onUpdate={(fields) => handleUpdateSite(editingId, fields)}
          onCancel={() => {
            setEditingId(null);
            setEditData(null);
          }}
        />
      </div>
    </div>
  </div>
)}


      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">All Heritage Sites</h2>
        <button
          className="bg-indigo-600 text-white px-5 py-2 rounded shadow font-semibold hover:bg-indigo-700 transition"
          onClick={() => setShowAddModal(true)}
        >
          + Add Heritage Site
        </button>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      {loading ? (
        <div className="text-gray-500 my-8 text-center">Loading sites...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-4 text-left">Site</th>
                <th className="py-2 px-4 text-left">Location</th>
                <th className="py-2 px-4 text-left">Type</th>
                <th className="py-2 px-4 text-left">Rating</th>
                <th className="py-2 px-4 text-left">Tags</th>
                <th className="py-2 px-4 text-left">Status</th>
                <th className="py-2 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {sites.map(site => (
                <tr key={site.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4 font-bold">{site.name}</td>
                  <td className="py-2 px-4 text-gray-700">{site.city}, {site.state}</td>
                  <td className="py-2 px-4">{site.site_type}</td>
                  <td className="py-2 px-4">{site.rating}</td>
                  <td className="py-2 px-4">
                    {site.tags?.map(tag => (
                      <span key={tag.id} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium mr-1">{tag.name}</span>
                    ))}
                  </td>
                  <td className="py-2 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${site.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {site.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-2 px-4 text-right flex space-x-4 justify-end">
  <button
    onClick={() => handleDelete(site.id)}
    className="text-red-600 hover:text-red-800 cursor-pointer"
    title="Delete"
    aria-label={`Delete ${site.name}`}
  >
    <FaTrash size={18} />
  </button>
  <button
    onClick={() => handleEdit(site)}
    className="text-indigo-600 hover:text-indigo-800 cursor-pointer"
    title="Edit"
    aria-label={`Edit ${site.name}`}
  >
    <FaEdit size={18} /> {/* assuming FaEdit is imported */}
  </button>
</td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Helper form for editing: pre-fill, same fields as AddHeritageSiteForm
function EditHeritageSiteForm({ site, onUpdate, onCancel }) {
  const [form, setForm] = useState({
    name: site.name || "",
    description: site.description || "",
    detailed_description: site.detailed_description || "",
    state: site.state || "",
    city: site.city || "",
    latitude: site.latitude || "",
    longitude: site.longitude || "",
    established_year: site.established_year || "",
    site_type: site.site_type || "TEMPLE",
    tags: (site.tags || []).map((tag) => tag.id),
    architect: site.architect || "",
    style: site.style || "",
    built: site.built || "",
    conservation_structural_integrity: site.conservation_structural_integrity || "",
    conservation_preservation_quality: site.conservation_preservation_quality || "",
    rating: site.rating || "",
    image: null, // only send if new file selected
    is_active: site.is_active ?? true,
    visitor_timings: site.visitor_timings || "",
    visitor_fee: site.visitor_fee || "",
    visitor_best_time: site.visitor_best_time || "",
    visitor_duration: site.visitor_duration || "",
    timeline: site.timeline ? JSON.stringify(site.timeline, null, 2) : "",
  });

  const [allTags, setAllTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load all available tags for selection
  useEffect(() => {
    API.get("/heritage/tags/")
      .then((res) => setAllTags(res.data))
      .catch(() => setAllTags([]));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    } else if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleTagsChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions);
    const values = selectedOptions.map((option) => option.value);
    setForm((prev) => ({ ...prev, tags: values }));
  };

  const validateJSON = (jsonString) => {
    if (!jsonString.trim()) return true; // empty is allowed
    try {
      JSON.parse(jsonString);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateJSON(form.timeline)) {
      setError("Timeline must be valid JSON.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();

      for (const key in form) {
        if (key === "tags") {
          form[key].forEach((tag) => formData.append("tags", tag));
        } else if (key === "timeline") {
          formData.append("timeline", form.timeline.trim() ? form.timeline : "[]");
        } else if (form[key] !== null && form[key] !== "" && form[key] !== false) {
          formData.append(key, form[key]);
        }
      }

      await onUpdate(formData);
    } catch (err) {
      setError("Failed to update heritage site.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6 max-h-[90vh] overflow-auto">
      

      <h2 className="text-2xl font-semibold mb-6">Edit Heritage Site</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Name</label>
          <input name="name" type="text" value={form.name} onChange={handleChange} required className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea name="description" rows={3} value={form.description} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block font-medium mb-1">Detailed Description</label>
          <textarea name="detailed_description" rows={5} value={form.detailed_description} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block font-medium mb-1">City</label>
            <input name="city" type="text" value={form.city} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>

          <div className="flex-1">
            <label className="block font-medium mb-1">State</label>
            <input name="state" type="text" value={form.state} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block font-medium mb-1">Latitude</label>
            <input name="latitude" type="number" step="0.000001" value={form.latitude} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>

          <div className="flex-1">
            <label className="block font-medium mb-1">Longitude</label>
            <input name="longitude" type="number" step="0.000001" value={form.longitude} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">Established Year</label>
          <input name="established_year" type="number" value={form.established_year} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block font-medium mb-1">Site Type</label>
          <select name="site_type" value={form.site_type} onChange={handleChange} className="w-full p-2 border rounded">
            {["NATURAL HERITAGE", "ARCHEAOLOGICAL SITE", "TEMPLE", "MONUMENT", "FORT", "PALACE"].map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Tags</label>
          <select multiple name="tags" value={form.tags} onChange={handleTagsChange} className="w-full p-2 border rounded h-32 overflow-auto">
            {allTags.map((tag) => (
              <option key={tag.id} value={tag.id}>{tag.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Architect</label>
          <input name="architect" type="text" value={form.architect} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block font-medium mb-1">Style</label>
          <input name="style" type="text" value={form.style} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block font-medium mb-1">Built (e.g. 1631-1653)</label>
          <input name="built" type="text" value={form.built} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block font-medium mb-1">Structural Integrity (%)</label>
            <input
              name="conservation_structural_integrity"
              type="number"
              min="0"
              max="100"
              value={form.conservation_structural_integrity}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex-1">
            <label className="block font-medium mb-1">Preservation Quality (%)</label>
            <input
              name="conservation_preservation_quality"
              type="number"
              min="0"
              max="100"
              value={form.conservation_preservation_quality}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">Rating (0 - 5)</label>
          <input
            name="rating"
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={form.rating}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Image</label>
          <input name="image" type="file" accept="image/*" onChange={handleChange} className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block font-medium mb-1">Visitor Timings</label>
          <input name="visitor_timings" type="text" value={form.visitor_timings} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block font-medium mb-1">Entry Fee</label>
          <input name="visitor_fee" type="text" value={form.visitor_fee} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block font-medium mb-1">Best Time to Visit</label>
          <input name="visitor_best_time" type="text" value={form.visitor_best_time} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block font-medium mb-1">Duration</label>
          <input name="visitor_duration" type="text" value={form.visitor_duration} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block font-medium mb-1">Historical Timeline (JSON)</label>
          <textarea
            rows={5}
            name="timeline"
            value={form.timeline}
            onChange={handleChange}
            placeholder='[{"year":"1631","event":"Construction begins"}]'
            className="w-full p-2 border rounded font-mono"
          />
        </div>

        <div className="flex items-center gap-2 mt-4">
          <input
            id="active"
            name="is_active"
            type="checkbox"
            checked={form.is_active}
            onChange={handleChange}
            className="h-4 w-4"
          />
          <label htmlFor="active" className="text-sm font-medium">Active</label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}

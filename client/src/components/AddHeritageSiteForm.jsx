import React, { useState, useEffect } from "react";
import API from "../api";

export default function AddHeritageSiteForm({ onAdd }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    detailed_description: "",
    city: "",
    state: "",
    latitude: "",
    longitude: "",
    established_year: "",
    site_type: "TEMPLE",
    tags: [],
    architect: "",
    style: "",
    built: "",
    conservation_structural_integrity: "",
    conservation_preservation_quality: "",
    rating: "",
    image: null,
    is_active: true,
    visitor_timings: "",
    visitor_fee: "",
    visitor_best_time: "",
    visitor_duration: "",
    timeline: "",
  });

  // Resources stored as array of {file, title, filetype, size_mb, access}
  const [resources, setResources] = useState([]);

  const [allTags, setAllTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const SITE_TYPES = [
    "NATURAL HERITAGE",
    "ARCHEAOLOGICAL SITE",
    "TEMPLE",
    "MONUMENT",
    "FORT",
    "PALACE",
  ];

  const resourceFileTypes = ["PDF", "ZIP"];
  const resourceAccessOptions = ["Public", "Researcher"];

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
    const selected = Array.from(e.target.selectedOptions).map((opt) => opt.value);
    setForm((prev) => ({ ...prev, tags: selected }));
  };

  // Add resources files (multiple file input)
  const handleAddResources = (e) => {
    const files = e.target.files;
    if (!files.length) return;
    const newResources = Array.from(files).map((file) => ({
      file,
      title: file.name,
      filetype: file.name.endsWith(".zip") ? "ZIP" : "PDF",
      size_mb: (file.size / (1024 * 1024)).toFixed(2),
      access: "Public",
    }));
    setResources((prev) => [...prev, ...newResources]);
    e.target.value = null;
  };

  const updateResource = (index, field, value) => {
    setResources((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const removeResource = (index) => {
    setResources((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let timelineJson = [];
    if (form.timeline) {
      try {
        timelineJson = JSON.parse(form.timeline);
      } catch {
        setError("Timeline must be valid JSON.");
        setLoading(false);
        return;
      }
    }

    try {
      // Prepare heritage site data
      const formData = new FormData();
      for (const key in form) {
        if (
          ["tags", "timeline", "image"].includes(key) ||
          form[key] === "" ||
          form[key] === null
        )
          continue;
        formData.append(key, form[key]);
      }

      // Append tags multiple times
      form.tags.forEach((tag) => formData.append("tags", tag));

      // Append timeline json string
      formData.append("timeline", JSON.stringify(timelineJson));

      // Append image file
      if (form.image) formData.append("image", form.image);

      // Create Heritage Site
      const res = await API.post("/heritage/sites/add/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newSite = res.data;

      // Now post all resources one by one, linked to newSite.id
      for (const resource of resources) {
        const resourceData = new FormData();
        resourceData.append("title", resource.title);
        resourceData.append("file", resource.file);
        resourceData.append("filetype", resource.filetype);
        resourceData.append("size_mb", resource.size_mb);
        resourceData.append("access", resource.access);

        await API.post(`/heritage/sites/${newSite.id}/resources/add/`, resourceData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      onAdd(newSite);

      // Reset form and resources
      setForm({
        name: "",
        description: "",
        detailed_description: "",
        city: "",
        state: "",
        latitude: "",
        longitude: "",
        established_year: "",
        site_type: "TEMPLE",
        tags: [],
        architect: "",
        style: "",
        built: "",
        conservation_structural_integrity: "",
        conservation_preservation_quality: "",
        rating: "",
        image: null,
        is_active: true,
        visitor_timings: "",
        visitor_fee: "",
        visitor_best_time: "",
        visitor_duration: "",
        timeline: "",
      });
      setResources([]);
    } catch (err) {
      setError("Failed to add heritage site or resources.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow overflow-auto max-h-[80vh]"
    >
      <h2 className="text-2xl font-semibold mb-6">Add New Heritage Site</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* Basic Info */}
      <label className="block mb-2 font-medium">Name</label>
      <input
        name="name"
        type="text"
        value={form.name}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded mb-4"
      />

      <label className="block mb-2 font-medium">Description</label>
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        rows={4}
        className="w-full p-2 border rounded mb-4"
      />

      <label className="block mb-2 font-medium">Detailed Description</label>
      <textarea
        name="detailed_description"
        value={form.detailed_description}
        onChange={handleChange}
        rows={6}
        className="w-full p-2 border rounded mb-4"
      />

      {/* Location */}
      <div className="flex gap-4 mb-4">
        <input
          name="city"
          placeholder="City"
          type="text"
          value={form.city}
          onChange={handleChange}
          className="flex-1 p-2 border rounded"
        />

        <input
          name="state"
          placeholder="State"
          type="text"
          value={form.state}
          onChange={handleChange}
          className="flex-1 p-2 border rounded"
        />
      </div>

      <div className="flex gap-4 mb-4">
        <input
          name="latitude"
          placeholder="Latitude"
          type="number"
          step="0.000001"
          value={form.latitude}
          onChange={handleChange}
          className="flex-1 p-2 border rounded"
        />

        <input
          name="longitude"
          placeholder="Longitude"
          type="number"
          step="0.000001"
          value={form.longitude}
          onChange={handleChange}
          className="flex-1 p-2 border rounded"
        />
      </div>

      {/* Established Year */}
      <label className="block mb-2 font-medium">Established Year</label>
      <input
        name="established_year"
        type="number"
        value={form.established_year}
        onChange={handleChange}
        className="w-full p-2 border rounded mb-4"
      />

      {/* Site Type */}
      <label className="block mb-2 font-medium">Site Type</label>
      <select
        name="site_type"
        value={form.site_type}
        onChange={handleChange}
        className="w-full p-2 border rounded mb-4"
      >
        {SITE_TYPES.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      {/* Tags */}
      <label className="block mb-2 font-medium">Tags</label>
      <select
        multiple
        name="tags"
        value={form.tags}
        onChange={handleTagsChange}
        className="w-full h-32 p-2 border rounded mb-4 overflow-scroll"
      >
        {allTags.map((tag) => (
          <option key={tag.id} value={tag.id}>
            {tag.name}
          </option>
        ))}
      </select>

      {/* Additional Info */}
      <label className="block mb-2 font-medium">Architect</label>
      <input
        name="architect"
        type="text"
        value={form.architect}
        onChange={handleChange}
        className="w-full p-2 border rounded mb-4"
      />

      <label className="block mb-2 font-medium">Style</label>
      <input
        name="style"
        type="text"
        value={form.style}
        onChange={handleChange}
        className="w-full p-2 border rounded mb-4"
      />

      <label className="block mb-2 font-medium">Built</label>
      <input
        name="built"
        type="text"
        value={form.built}
        onChange={handleChange}
        className="w-full p-2 border rounded mb-4"
      />

      <div className="flex gap-4 mb-4">
        <input
          name="conservation_structural_integrity"
          placeholder="Structural Integrity (%)"
          type="number"
          min={0}
          max={100}
          value={form.conservation_structural_integrity}
          onChange={handleChange}
          className="flex-1 p-2 border rounded"
        />
        <input
          name="conservation_preservation_quality"
          placeholder="Preservation Quality (%)"
          type="number"
          min={0}
          max={100}
          value={form.conservation_preservation_quality}
          onChange={handleChange}
          className="flex-1 p-2 border rounded"
        />
      </div>

      <label className="block mb-2 font-medium">Rating</label>
      <input
        name="rating"
        type="number"
        min={0}
        max={5}
        step="0.1"
        value={form.rating}
        onChange={handleChange}
        className="w-full p-2 border rounded mb-4"
      />

      <label className="block mb-2 font-medium">Image</label>
      <input
        name="image"
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="mb-6"
      />

      <label className="block mb-2 font-medium">Visitor Timings</label>
      <input
        name="visitor_timings"
        type="text"
        value={form.visitor_timings}
        onChange={handleChange}
        className="w-full p-2 border rounded mb-4"
      />

      <label className="block mb-2 font-medium">Entry Fee</label>
      <input
        name="visitor_fee"
        type="text"
        value={form.visitor_fee}
        onChange={handleChange}
        className="w-full p-2 border rounded mb-4"
      />

      <label className="block mb-2 font-medium">Best Time to Visit</label>
      <input
        name="visitor_best_time"
        type="text"
        value={form.visitor_best_time}
        onChange={handleChange}
        className="w-full p-2 border rounded mb-4"
      />

      <label className="block mb-2 font-medium">Duration</label>
      <input
        name="visitor_duration"
        type="text"
        value={form.visitor_duration}
        onChange={handleChange}
        className="w-full p-2 border rounded mb-4"
      />

      <label className="block mb-2 font-medium">Historical Timeline (JSON)</label>
      <textarea
        name="timeline"
        value={form.timeline}
        onChange={handleChange}
        rows={5}
        placeholder='[{"year": "1600", "event": "Built"}, {"year": "1650", "event": "Restored"}]'
        className="w-full p-2 border rounded mb-4 font-mono text-xs"
      />

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3">Add Heritage Resources</h3>
        <input
          type="file"
          accept=".pdf,.zip"
          multiple
          onChange={handleAddResources}
          className="mb-3"
        />

        {resources.length === 0 && (
          <p className="text-gray-600">No resources added yet.</p>
        )}

        {resources.map((resource, idx) => (
          <div
            key={idx}
            className="border p-3 rounded mb-2 flex flex-col gap-2 shadow-sm"
          >
            <input
              type="text"
              value={resource.title}
              onChange={(e) => updateResource(idx, "title", e.target.value)}
              placeholder="Resource Title"
              className="border p-2 rounded"
            />

            <select
              value={resource.filetype}
              onChange={(e) => updateResource(idx, "filetype", e.target.value)}
              className="border p-2 rounded w-32"
            >
              {['PDF', 'ZIP'].map((ft) => (
                <option key={ft} value={ft}>{ft}</option>
              ))}
            </select>

            <input
              type="text"
              value={resource.access}
              onChange={(e) => updateResource(idx, "access", e.target.value)}
              placeholder="Access (e.g., Public)"
              className="border p-2 rounded"
            />

            <div className="text-gray-600 text-sm">
              Size: {resource.size_mb} MB
            </div>

            <button
              type="button"
              className="text-red-600 hover:underline self-start"
              onClick={() => {
                setResources((prev) => prev.filter((_, i) => i !== idx));
              }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <label className="inline-flex items-center mb-6">
        <input
          name="is_active"
          type="checkbox"
          checked={form.is_active}
          onChange={handleChange}
          className="mr-2"
        />
        Active
      </label>

      <button
        type="submit"
        disabled={loading}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add Heritage Site"}
      </button>
    </form>
  );
}

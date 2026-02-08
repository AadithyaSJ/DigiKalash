import React, { useState, useEffect } from "react";
import API from "../api";
import { FiUploadCloud, FiType, FiTag, FiDollarSign, FiBox, FiClipboard, FiImage } from "react-icons/fi";

function AddProductForm({ authToken, onProductAdded }) {
  const [categories, setCategories] = useState([]);
  const [sites, setSites] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const [form, setForm] = useState({
    name: "",
    short_description: "",
    description: "",
    sku: "",
    product_type: "physical",
    price: "",
    inventory: 1,
    category: "",
    site: "",
    main_image: null,
    images: [],
    digital_file: null,
    video_url: "",
    featured: false,
    available: true,
    is_active: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchOptions() {
      try {
        const [catRes, siteRes] = await Promise.all([
          API.get("/marketplace/categories/"),
          API.get("/heritage/sites/")
        ]);
        setCategories(catRes.data);
        setSites(siteRes.data);
      } catch (err) {
        console.error("Failed to load options", err);
      } finally {
        setLoadingOptions(false);
      }
    }
    fetchOptions();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      name === "images" ? setForm({ ...form, images: files }) : setForm({ ...form, [name]: files[0] });
    } else if (type === "checkbox") {
      setForm({ ...form, [name]: checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === "images" && value && value.length) {
        Array.from(value).forEach(file => data.append("images", file));
      } else if (value !== null && value !== "" && value !== undefined) {
        data.append(key, value);
      }
    });

    API.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;

    try {
      await API.post("/marketplace/products/", data);
      setSuccess(true);
      if (onProductAdded) onProductAdded();
      // Optional: Reset form here
    } catch (err) {
      setError("Failed to add product. Please check all required fields.");
    } finally {
      setLoading(false);
    }
  };

  if (loadingOptions) return <div className="text-center py-6 text-gray-500">Loading options...</div>;

  if (success) return (
    <div className="text-center py-10">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-3xl mx-auto mb-4">
        ✓
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">Product Listed Successfully!</h3>
      <p className="text-gray-600 mb-6">Your product is now pending review or live on the marketplace.</p>
      <button
        onClick={() => { setSuccess(false); setForm({ ...form, name: '' }); }}
        className="text-indigo-600 font-bold hover:underline"
      >
        Add Another Product
      </button>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded text-red-700 font-medium">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <section>
        <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4 flex items-center gap-2">
          <FiType className="text-indigo-600" /> Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="label">Product Name *</label>
            <input name="name" type="text" required value={form.name} onChange={handleChange} className="input-field" placeholder="e.g., Handcrafted Clay Pot" />
          </div>
          <div className="md:col-span-2">
            <label className="label">Short Description</label>
            <input name="short_description" type="text" value={form.short_description} onChange={handleChange} className="input-field" placeholder="Brief summary for listings..." />
          </div>
          <div className="md:col-span-2">
            <label className="label">Detailed Description</label>
            <textarea name="description" rows="4" value={form.description} onChange={handleChange} className="input-field" placeholder="Full details, materials, history..." />
          </div>
        </div>
      </section>

      {/* Pricing & Inventory */}
      <section>
        <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4 flex items-center gap-2">
          <FiDollarSign className="text-indigo-600" /> Pricing & Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="label">Price (₹) *</label>
            <input name="price" type="number" required step="0.01" value={form.price} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="label">Inventory *</label>
            <input name="inventory" type="number" required min="0" value={form.inventory} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="label">Product Type *</label>
            <select name="product_type" required value={form.product_type} onChange={handleChange} className="input-field">
              <option value="physical">Physical Item</option>
              <option value="digital">Digital Download</option>
            </select>
          </div>
          <div>
            <label className="label">Category *</label>
            <select name="category" required value={form.category} onChange={handleChange} className="input-field">
              <option value="">Select...</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Heritage Site *</label>
            <select name="site" required value={form.site} onChange={handleChange} className="input-field">
              <option value="">Select...</option>
              {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">SKU (Optional)</label>
            <input name="sku" type="text" value={form.sku} onChange={handleChange} className="input-field" />
          </div>
        </div>
      </section>

      {/* Media */}
      <section>
        <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4 flex items-center gap-2">
          <FiImage className="text-indigo-600" /> Media
        </h3>
        <div className="space-y-4">
          <div>
            <label className="label">Main Image</label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FiUploadCloud className="text-3xl text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Click to upload main image</p>
                </div>
                <input name="main_image" type="file" accept="image/*" onChange={handleChange} className="hidden" />
              </label>
            </div>
          </div>
          <div>
            <label className="label">Gallery Images</label>
            <input name="images" type="file" accept="image/*" multiple onChange={handleChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
          </div>
          {form.product_type === 'digital' && (
            <div>
              <label className="label">Digital File</label>
              <input name="digital_file" type="file" onChange={handleChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
            </div>
          )}
        </div>
      </section>

      {/* Settings */}
      <div className="flex gap-6 pt-4">
        {['featured', 'available', 'is_active'].map(field => (
          <label key={field} className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" name={field} checked={form[field]} onChange={handleChange} className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500" />
            <span className="capitalize text-gray-700 font-medium">{field.replace('_', ' ')}</span>
          </label>
        ))}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all disabled:opacity-70 disabled:hover:translate-y-0"
      >
        {loading ? "Submitting Product..." : "Submit Product"}
      </button>

      <style jsx>{`
        .label { @apply block text-sm font-bold text-gray-700 mb-1; }
        .input-field { @apply w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white; }
      `}</style>
    </form>
  );
}

export default AddProductForm;

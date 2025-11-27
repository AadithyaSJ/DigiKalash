import React, { useState, useEffect } from "react";
import API from "../api";

function AddProductForm({ authToken, onProductAdded }) {
  const [categories, setCategories] = useState([]);
  const [sites, setSites] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingSites, setLoadingSites] = useState(true);
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

  useEffect(() => {
    async function fetchFormOptions() {
      try {
        const catRes = await API.get("/marketplace/categories/");
        setCategories(catRes.data);
      } catch {
        setCategories([]);
      }
      setLoadingCategories(false);

      try {
        const siteRes = await API.get("/heritage/sites/");
        setSites(siteRes.data);
      } catch {
        setSites([]);
      }
      setLoadingSites(false);
    }
    fetchFormOptions();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      if (name === "images") {
        setForm((prev) => ({ ...prev, images: files }));
      } else {
        setForm((prev) => ({ ...prev, [name]: files[0] }));
      }
    } else if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const data = new FormData();
    for (const [key, value] of Object.entries(form)) {
      if (key === "images" && value && value.length > 0) {
        for (let i = 0; i < value.length; i++) {
          data.append("images", value[i]);
        }
      } else if (value !== null && value !== undefined && value !== "") {
        data.append(key, value);
      }
    }

    API.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;

    try {
      const res = await API.post("/marketplace/products/", data);
      onProductAdded();
    } catch (err) {
      setError("Failed to add product. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loadingCategories || loadingSites)
    return (
      <p className="text-center text-gray-500 text-lg mt-10">Loading form data...</p>
    );

  return (
    <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
      {error && (
        <p className="text-red-600 font-semibold text-center">{error}</p>
      )}
      <div>
        <label className="block font-medium mb-1" htmlFor="name">
          Product Name *
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={form.name}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block font-medium mb-1" htmlFor="short_description">
          Short Description
        </label>
        <input
          id="short_description"
          name="short_description"
          type="text"
          value={form.short_description}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block font-medium mb-1" htmlFor="description">
          Detailed Description
        </label>
        <textarea
          id="description"
          name="description"
          rows="4"
          value={form.description}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        ></textarea>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-1" htmlFor="sku">
            SKU (optional)
          </label>
          <input
            id="sku"
            name="sku"
            type="text"
            value={form.sku}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block font-medium mb-1" htmlFor="video_url">
            Video URL (optional)
          </label>
          <input
            id="video_url"
            name="video_url"
            type="url"
            value={form.video_url}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block font-medium mb-1" htmlFor="price">
            Price (₹) *
          </label>
          <input
            id="price"
            name="price"
            required
            type="number"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block font-medium mb-1" htmlFor="inventory">
            Inventory *
          </label>
          <input
            id="inventory"
            name="inventory"
            required
            type="number"
            min="0"
            value={form.inventory}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block font-medium mb-1" htmlFor="product_type">
            Product Type *
          </label>
          <select
            id="product_type"
            name="product_type"
            required
            value={form.product_type}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="physical">Physical</option>
            <option value="digital">Digital</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-1" htmlFor="category">
            Category *
          </label>
          <select
            id="category"
            name="category"
            required
            value={form.category}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1" htmlFor="site">
            Heritage Site *
          </label>
          <select
            id="site"
            name="site"
            required
            value={form.site}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select Heritage Site</option>
            {sites.map((site) => (
              <option key={site.id} value={site.id}>
                {site.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block font-medium mb-1" htmlFor="main_image">
          Main Image
        </label>
        <input
          id="main_image"
          name="main_image"
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="w-full"
        />
      </div>

      <div>
        <label className="block font-medium mb-1" htmlFor="images">
          Additional Images
        </label>
        <input
          id="images"
          name="images"
          type="file"
          accept="image/*"
          multiple
          onChange={handleChange}
          className="w-full"
        />
      </div>

      <div>
        <label className="block font-medium mb-1" htmlFor="digital_file">
          Digital File
        </label>
        <input
          id="digital_file"
          name="digital_file"
          type="file"
          onChange={handleChange}
          className="w-full"
        />
      </div>

      <div className="flex items-center space-x-6 my-6">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="featured"
            checked={form.featured}
            onChange={handleChange}
            className="form-checkbox"
          />
          <span>Featured</span>
        </label>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="available"
            checked={form.available}
            onChange={handleChange}
            className="form-checkbox"
          />
          <span>Available</span>
        </label>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="is_active"
            checked={form.is_active}
            onChange={handleChange}
            className="form-checkbox"
          />
          <span>Active</span>
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition"
      >
        {loading ? "Submitting..." : "Submit Product"}
      </button>
    </form>
  );
}

export default AddProductForm;

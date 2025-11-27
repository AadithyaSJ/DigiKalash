import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiBookmark, FiShare2, FiMapPin, FiFilter } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import API from "../api";

const STATE_OPTIONS = ["All States", "Karnataka", "Rajasthan", "Odisha", "Tamil Nadu"];
const ERA_OPTIONS = ["All Eras", "Medieval", "Ancient", "Modern"];
const CATEGORY_OPTIONS = ["All Categories", "Palace", "Temple", "Fort", "Site", "Monument"];

function HeritageSitesPage() {
  const [sites, setSites] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("name");
  const [view, setView] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);

  // Filters
  const [filterState, setFilterState] = useState("All States");
  const [filterEra, setFilterEra] = useState("All Eras");
  const [filterCategory, setFilterCategory] = useState("All Categories");
  const [filterUnesco, setFilterUnesco] = useState(false);
  const [filterAccessible, setFilterAccessible] = useState(false);
  const [filterVerified, setFilterVerified] = useState(false);

  useEffect(() => {
    API.get("/heritage/sites/").then((res) => setSites(res.data));
  }, []);

  function clearFilters() {
    setFilterState("All States");
    setFilterEra("All Eras");
    setFilterCategory("All Categories");
    setFilterUnesco(false);
    setFilterAccessible(false);
    setFilterVerified(false);
  }

  // Filtering logic
  const filteredSites = sites
    .filter(site => 
      (!search ||
        site.name.toLowerCase().includes(search.toLowerCase()) ||
        (site.city && site.city.toLowerCase().includes(search.toLowerCase())) ||
        (site.state && site.state.toLowerCase().includes(search.toLowerCase())) ||
        (site.description && site.description.toLowerCase().includes(search.toLowerCase()))
      ) &&
      (filterState === "All States" || site.state === filterState) &&
      (filterEra === "All Eras" || (site.era && site.era === filterEra)) &&
      (filterCategory === "All Categories" || (site.site_type && site.site_type === filterCategory)) &&
      (!filterUnesco || site.is_unesco) &&
      (!filterAccessible || site.is_accessible) &&
      (!filterVerified || site.is_verified)
    )
    .sort((a, b) => sort === "name" ? a.name.localeCompare(b.name) : 0);

  return (
    <div className="w-full px-10 py-8 max-w-7xl mx-auto">
      {/* Top Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        {/* Search */}
        <div className="flex items-center gap-2 flex-grow max-w-lg">
          <input
            type="text"
            placeholder="Search sites by name, location, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-black shadow-sm bg-white"
          />
          <button
            className={`px-4 py-2 flex items-center gap-2 rounded-xl bg-white border border-gray-300 hover:bg-gray-100 shadow-sm transition${showFilters ? " ring-2 ring-black" : ""}`}
            onClick={() => setShowFilters((prev) => !prev)}
          >
            <FiFilter />
            <span className="hidden sm:inline text-sm font-medium">Filters</span>
          </button>
        </div>
        {/* Sort */}
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-600">
            {filteredSites.length} sites found
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-300 bg-white shadow-sm text-gray-700 text-sm font-medium"
          >
            <option value="name">Sort by Name</option>
          </select>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="w-full bg-white border border-gray-200 rounded-xl px-6 py-4 mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 items-center">
          {/* State */}
          <div>
            <label className="block text-md font-semibold mb-1">State</label>
            <select
              value={filterState}
              onChange={e => setFilterState(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-50 border border-gray-200"
            >
              {STATE_OPTIONS.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>
          {/* Era */}
          <div>
            <label className="block text-md font-semibold mb-1">Era</label>
            <select
              value={filterEra}
              onChange={e => setFilterEra(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-50 border border-gray-200"
            >
              {ERA_OPTIONS.map(era => (
                <option key={era} value={era}>{era}</option>
              ))}
            </select>
          </div>
          {/* Category */}
          <div>
            <label className="block text-md font-semibold mb-1">Category</label>
            <select
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-50 border border-gray-200"
            >
              {CATEGORY_OPTIONS.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          {/* Special Filters */}
          <div>
            <label className="block text-md font-semibold mb-2">Special Filters</label>
            <div className="mb-1">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filterUnesco}
                  onChange={e => setFilterUnesco(e.target.checked)}
                  className="accent-blue-700"
                />
                UNESCO Sites Only
              </label>
            </div>
            <div className="mb-1">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filterAccessible}
                  onChange={e => setFilterAccessible(e.target.checked)}
                  className="accent-gray-700"
                />
                Accessible
              </label>
            </div>
            <div className="mb-1">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filterVerified}
                  onChange={e => setFilterVerified(e.target.checked)}
                  className="accent-green-700"
                />
                Verified Only
              </label>
            </div>
            <button
              className="mt-3 px-4 py-2 text-black rounded-xl border bg-gray-100 hover:bg-gray-200 transition font-semibold"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* Grid View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredSites.map(site => (
          <div
            key={site.id}
            className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 transition flex flex-col overflow-hidden"
          >
            <div className="relative">
              <img
                src={site.image || "/default-sites.jpg"}
                alt={site.name}
                className="h-48 w-full object-cover"
              />
              {/* Bookmark icon */}
              <div className="absolute top-3 left-3">
                <FiBookmark className="text-gray-700 opacity-70" />
              </div>
              {/* Rating */}
              {site.rating && (
                <div className="absolute top-3 right-3 flex items-center bg-white px-2 py-0.5 rounded-md shadow">
                  <FaStar className="text-yellow-500 mr-1" /> 
                  <span className="font-bold text-gray-700 text-sm">{site.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
            <div className="p-5 flex flex-col flex-grow">
              <h3 className="font-bold text-lg mb-1">{site.name}</h3>
              <p className="text-gray-500 text-sm flex items-center mb-2">
                <FiMapPin className="mr-1" />
                {site.city && site.state
                  ? `${site.city}, ${site.state}`
                  : site.city
                  ? site.city
                  : site.state
                  ? site.state
                  : ""}
              </p>
              <p className="text-gray-600 text-sm line-clamp-2 mb-3">{site.description}</p>
              {/* Site Type Chip */}
              <div className="inline-block mb-2 px-3 py-1 bg-gray-100 rounded-full text-xs font-semibold text-gray-700">
                {site.site_type}
              </div>
              {/* CTA */}
              <Link
                to={`/sites/${site.id}`}
                className="bg-black text-white w-full py-2 rounded-xl font-medium text-center hover:bg-gray-900 transition"
              >
                View Details
              </Link>
              {/* Footer */}
              <div className="flex items-center justify-between text-xs text-gray-500 mt-3">
                <span>{site.upcoming_events} upcoming events</span>
                <FiShare2 className="text-base cursor-pointer hover:text-black" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HeritageSitesPage;

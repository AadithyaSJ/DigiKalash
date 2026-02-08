import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiFilter, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import API from "../api";
import FeaturedSiteCard from "../components/FeaturedSiteCard";

const STATE_OPTIONS = ["All States", "Karnataka", "Rajasthan", "Odisha", "Tamil Nadu", "Maharashtra", "Kerala"];
const ERA_OPTIONS = ["All Eras", "Medieval", "Ancient", "Modern", "Colonial"];
const CATEGORY_OPTIONS = ["All Categories", "Palace", "Temple", "Fort", "Monument", "Museum", "Archaeological Site"];

function HeritageSitesPage() {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    state: "All States",
    era: "All Eras",
    category: "All Categories",
    unesco: false,
    accessible: false,
    verified: false
  });

  useEffect(() => {
    API.get("/heritage/sites/")
      .then((res) => setSites(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const clearFilters = () => {
    setFilters({
      state: "All States",
      era: "All Eras",
      category: "All Categories",
      unesco: false,
      accessible: false,
      verified: false
    });
  };

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredSites = sites.filter(site => {
    const matchesSearch = !search ||
      site.name.toLowerCase().includes(search.toLowerCase()) ||
      (site.city && site.city.toLowerCase().includes(search.toLowerCase())) ||
      (site.state && site.state.toLowerCase().includes(search.toLowerCase()));

    const matchesState = filters.state === "All States" || site.state === filters.state;
    const matchesEra = filters.era === "All Eras" || (site.era && site.era === filters.era);
    const matchesCategory = filters.category === "All Categories" || (site.site_type && site.site_type === filters.category);
    const matchesUnesco = !filters.unesco || site.is_unesco;
    const matchesAccessible = !filters.accessible || site.is_accessible;
    const matchesVerified = !filters.verified || site.is_verified;

    return matchesSearch && matchesState && matchesEra && matchesCategory && matchesUnesco && matchesAccessible && matchesVerified;
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header & Search */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
            Explore Heritage Sites
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Discover the architectural marvels and historical treasures of India.
          </p>

          <div className="relative max-w-2xl mx-auto flex items-center">
            <FiSearch className="absolute left-4 text-gray-400 text-xl" />
            <input
              type="text"
              placeholder="Search by name, city, or state..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-none shadow-lg shadow-gray-200/50 focus:ring-2 focus:ring-indigo-500 outline-none text-lg"
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`absolute right-2 px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-colors ${showFilters ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              <FiFilter />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-8"
            >
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-900">Filter Options</h3>
                  <button onClick={clearFilters} className="text-sm text-indigo-600 font-semibold hover:underline">
                    Reset All
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">State</label>
                    <select
                      value={filters.state}
                      onChange={(e) => updateFilter("state", e.target.value)}
                      className="w-full p-2 rounded-lg border border-gray-200 focus:border-indigo-500 outline-none"
                    >
                      {STATE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Category</label>
                    <select
                      value={filters.category}
                      onChange={(e) => updateFilter("category", e.target.value)}
                      className="w-full p-2 rounded-lg border border-gray-200 focus:border-indigo-500 outline-none"
                    >
                      {CATEGORY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Era</label>
                    <select
                      value={filters.era}
                      onChange={(e) => updateFilter("era", e.target.value)}
                      className="w-full p-2 rounded-lg border border-gray-200 focus:border-indigo-500 outline-none"
                    >
                      {ERA_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Features</label>
                    <div className="space-y-2">
                      {[
                        { key: "unesco", label: "UNESCO World Heritage" },
                        { key: "accessible", label: "Accessible" },
                        { key: "verified", label: "Verified Only" }
                      ].map((feature) => (
                        <label key={feature.key} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters[feature.key]}
                            onChange={(e) => updateFilter(feature.key, e.target.checked)}
                            className="rounded text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-sm text-gray-700">{feature.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="bg-white h-96 rounded-2xl animate-pulse shadow-sm" />
            ))}
          </div>
        ) : filteredSites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredSites.map(site => (
              <FeaturedSiteCard key={site.id} site={site} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-block p-4 rounded-full bg-gray-100 text-gray-400 mb-4 text-4xl">
              <FiSearch />
            </div>
            <h3 className="text-xl font-bold text-gray-900">No sites found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search or filters.</p>
            <button onClick={clearFilters} className="mt-4 text-indigo-600 font-semibold hover:underline">
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default HeritageSitesPage;

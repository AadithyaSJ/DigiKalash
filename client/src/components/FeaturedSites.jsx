import React, { useEffect, useState } from "react";
import FeaturedSiteCard from "./FeaturedSiteCard";
import API from "../api";
import { Link } from "react-router-dom";

function FeaturedSites() {
  const [sites, setSites] = useState([]);

  useEffect(() => {
    API.get("/heritage/sites/")
      .then(res => setSites(res.data.slice(0, 4)))
      .catch(err => console.error(err));
  }, []);

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
        <div>
          <span className="text-indigo-600 font-bold tracking-wider uppercase text-sm">Explore History</span>
          <h2 className="text-4xl font-display font-bold text-gray-900 mt-2">Featured Heritage Sites</h2>
        </div>
        <Link to="/sites" className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors flex items-center gap-1">
          View collection &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {sites.length > 0 ? (
          sites.map(site => (
            <FeaturedSiteCard site={site} key={site.id} />
          ))
        ) : (
          // Skeletons or empty state
          [1, 2, 3, 4].map(i => (
            <div key={i} className="h-80 bg-gray-100 rounded-2xl animate-pulse"></div>
          ))
        )}
      </div>
    </section>
  );
}
export default FeaturedSites;

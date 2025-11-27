import React, { useEffect, useState } from "react";
import FeaturedSiteCard from "./FeaturedSiteCard";
import API from "../api";

function FeaturedSites() {
  const [sites, setSites] = useState([]);
  useEffect(() => {
    API.get("/heritage/sites/").then(res => setSites(res.data.slice(0, 4)));
  }, []);
  return (
    <section className="py-12 max-w-screen-xl mx-auto">
      <h2 className="text-4xl font-extrabold text-center mb-3">Featured Heritage Sites</h2>
      <p className="text-gray-600 text-center mb-8">
        Discover India's most magnificent heritage sites, from ancient temples to majestic forts
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {sites.map(site => (
          <FeaturedSiteCard site={site} key={site.id} />
        ))}
      </div>
    </section>
  );
}
export default FeaturedSites;

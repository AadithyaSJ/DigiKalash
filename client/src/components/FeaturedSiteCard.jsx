import React from "react";
import { Link } from "react-router-dom";
import { FiBookmark, FiShare2, FiMapPin } from "react-icons/fi";

export default function FeaturedSiteCard({ site }) {
  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-2xl transition flex flex-col pb-4 relative overflow-hidden">
      {/* Top badges and bookmark */}
      <div className="absolute left-4 top-5 z-20">
        <FiBookmark className="text-xl text-black opacity-70" />
      </div>
      <div className="absolute right-4 top-5 z-20 flex gap-2">
        {site.is_unesco && (
          <span className="bg-blue-700 text-white px-2 py-1 rounded text-xs font-semibold">UNESCO</span>
        )}
        {site.is_verified && (
          <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">Verified</span>
        )}
      </div>
      <img
        src={site.image || "/default-sites.jpg"}
        alt={site.name}
        className="h-44 w-full object-cover mb-3 rounded-t-2xl"
      />
      <div className="px-5 pt-2 flex flex-col flex-grow">
        <h3 className="font-bold text-lg">{site.name}</h3>
        <p className="text-gray-500 text-sm flex items-center mb-1">
          <FiMapPin className="mr-1" />
          {site.city}, {site.state}
        </p>
        <p className="text-gray-600 text-sm line-clamp-2 mb-2">{site.description}</p>
        {/* Tag pills */}
        <div className="flex flex-wrap gap-2 mb-3">
          {site.tags && site.tags.map(tag => (
            <span key={tag} className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs font-semibold">{tag}</span>
          ))}
        </div>
        <Link
          to={`/heritage/sites/${site.id}`}
          className="bg-black text-white w-full py-2 rounded-lg font-bold text-center mb-3 hover:bg-gray-900 transition"
        >
          View Details
        </Link>
        {/* Events Count */}
        <div className="flex items-center justify-between text-xs text-gray-500 mt-auto">
          <span>{site.upcoming_events} upcoming events</span>
          <FiShare2 className="text-base cursor-pointer hover:text-black" />
        </div>
      </div>
    </div>
  );
}

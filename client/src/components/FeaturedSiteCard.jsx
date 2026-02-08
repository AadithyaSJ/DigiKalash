import React from "react";
import { Link } from "react-router-dom";
import { FiBookmark, FiMapPin, FiArrowRight } from "react-icons/fi";
import { motion } from "framer-motion";

export default function FeaturedSiteCard({ site }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full"
    >
      <div className="relative h-64 overflow-hidden">
        <img
          src={site.image || "/default-sites.jpg"}
          alt={site.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        <div className="absolute top-4 right-4 flex gap-2">
          {site.is_unesco && (
            <span className="bg-blue-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm border border-white/20">
              UNESCO
            </span>
          )}
        </div>

        <button
          className="absolute top-4 left-4 p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-red-500 transition-all"
          aria-label="Bookmark"
        >
          <FiBookmark />
        </button>

        <div className="absolute bottom-4 left-4 right-4 text-white translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex items-center gap-1 text-xs font-medium text-gray-200 mb-1">
            <FiMapPin />
            <span>{site.city}, {site.state}</span>
          </div>
          <h3 className="font-display font-bold text-xl leading-tight shadow-black drop-shadow-md">
            {site.name}
          </h3>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex flex-wrap gap-2 mb-4">
          {site.tags && site.tags.slice(0, 3).map(tag => (
            <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium border border-gray-200">
              {tag}
            </span>
          ))}
        </div>

        <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed flex-grow">
          {site.description}
        </p>

        <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
          <span className="text-xs font-medium text-gray-500">
            {site.upcoming_events > 0 ? `${site.upcoming_events} Upcoming Events` : "No upcoming events"}
          </span>
          <Link
            to={`/sites/${site.id}`}
            className="text-indigo-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all"
          >
            Explore <FiArrowRight />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

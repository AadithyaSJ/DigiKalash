import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api";
import { FiMapPin, FiClock, FiDollarSign, FiCalendar, FiDownload, FiExternalLink, FiChevronLeft } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function HeritageSiteDetailPage() {
  const { siteId } = useParams();
  const [site, setSite] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [siteRes, eventRes] = await Promise.all([
          API.get(`/heritage/sites/${siteId}/`),
          API.get(`/heritage/sites/${siteId}/events/`),
        ]);
        setSite(siteRes.data);
        setEvents(eventRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [siteId]);

  if (loading) return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
    </div>
  );

  if (!site) return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <h2 className="text-2xl font-bold text-gray-800">Site Not Found</h2>
      <Link to="/sites" className="mt-4 text-indigo-600 hover:underline">Back to Sites</Link>
    </div>
  );

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "history", label: "History" },
    { id: "resources", label: "Resources" },
    { id: "visit", label: "Visit Info" }
  ];

  return (
    <div className="w-full bg-white min-h-screen">

      {/* Hero Section */}
      <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
        <img
          src={site.image || "/default-sites.jpg"}
          alt={site.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />

        <div className="absolute top-24 left-6 z-20">
          <Link to="/sites" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-black/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium">
            <FiChevronLeft /> Back to Sites
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 z-20">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-3 mb-4">
              {site.is_unesco && <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase">UNESCO World Heritage</span>}
              {site.is_verified && <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase">Verified</span>}
              <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-semibold">{site.site_type}</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-2 leading-tight">
              {site.name}
            </h1>

            <div className="flex items-center text-white/90 text-lg md:text-xl font-light">
              <FiMapPin className="mr-2" />
              {site.city}, {site.state}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-12">

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">

          {/* Tabs Navigation */}
          <div className="flex gap-8 border-b border-gray-100 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 text-lg font-medium whitespace-nowrap relative ${activeTab === tab.id ? "text-indigo-600" : "text-gray-500 hover:text-gray-800"
                  }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="underline"
                    className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 rounded-t-full"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[300px]">
            <AnimatePresence mode="wait">
              {activeTab === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {site.detailed_description || site.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">Architectural Style</h4>
                      <p className="text-gray-600">{site.style || "Not specified"}</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">Era / Period</h4>
                      <p className="text-gray-600">{site.era || "Not specified"}</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">Built In</h4>
                      <p className="text-gray-600">{site.built || "Unknown"}</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">Conservation Status</h4>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${site.conservation_structural_integrity || 70}%` }} />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Structural Integrity: {site.conservation_structural_integrity || 70}%</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "history" && (
                <motion.div
                  key="history"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <h3 className="text-2xl font-bold mb-6">Historical Timeline</h3>
                  {site.timeline && Object.keys(site.timeline).length > 0 ? (
                    <div className="border-l-2 border-indigo-100 ml-4 space-y-8">
                      {Object.entries(site.timeline).map(([year, event], i) => (
                        <div key={i} className="relative pl-8">
                          <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-indigo-600 border-4 border-white shadow-sm" />
                          <span className="block text-indigo-600 font-bold mb-1">{year}</span>
                          <p className="text-gray-700">{event}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 bg-gray-50 rounded-xl">
                      <p className="text-gray-500">No detailed timeline available for this site.</p>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "resources" && (
                <motion.div
                  key="resources"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <h3 className="text-2xl font-bold mb-4">Research & Downloads</h3>
                  {site.resources && site.resources.length > 0 ? (
                    site.resources.map(res => (
                      <div key={res.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-white hover:shadow-md border border-gray-100 transition-all gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl">
                            <FiDownload />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">{res.title}</h4>
                            <p className="text-sm text-gray-500">{res.filetype?.toUpperCase()} • {res.size_mb} MB</p>
                          </div>
                        </div>
                        <a
                          href={res.file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold text-sm text-center hover:bg-indigo-700 transition"
                        >
                          Download
                        </a>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No downloadable resources available yet.</p>
                  )}
                </motion.div>
              )}

              {activeTab === "visit" && (
                <motion.div
                  key="visit"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <div className="p-6 bg-orange-50 rounded-2xl border border-orange-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-orange-100 text-orange-600 rounded-lg"><FiClock /></div>
                      <h4 className="font-bold text-gray-900">Opening Hours</h4>
                    </div>
                    <p className="text-gray-700">{site.visitor_timings || "Open daily 9:00 AM - 5:00 PM"}</p>
                  </div>

                  <div className="p-6 bg-green-50 rounded-2xl border border-green-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-green-100 text-green-600 rounded-lg"><FiDollarSign /></div>
                      <h4 className="font-bold text-gray-900">Entry Fee</h4>
                    </div>
                    <p className="text-gray-700">{site.visitor_fee || "Free entry"}</p>
                  </div>

                  <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><FiCalendar /></div>
                      <h4 className="font-bold text-gray-900">Best Time to Visit</h4>
                    </div>
                    <p className="text-gray-700">{site.visitor_best_time || "October to March"}</p>
                  </div>

                  <div className="p-6 bg-purple-50 rounded-2xl border border-purple-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><FiMapPin /></div>
                      <h4 className="font-bold text-gray-900">Location</h4>
                    </div>
                    <a
                      href={`https://maps.google.com/?q=${site.name}, ${site.city}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-600 font-medium hover:underline flex items-center gap-1"
                    >
                      View on Google Maps <FiExternalLink />
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-8">
          {/* Upcoming Events Widget */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-xl mb-4 text-gray-900">Upcoming Events</h3>
            {events.length > 0 ? (
              <div className="space-y-4">
                {events.slice(0, 3).map(event => (
                  <div key={event.id} className="flex gap-3 items-start p-3 rounded-lg hover:bg-gray-50 transition">
                    <div className="w-12 h-12 rounded-lg bg-indigo-100 flex flex-col items-center justify-center flex-shrink-0 text-indigo-700">
                      <span className="text-xs font-bold uppercase">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                      <span className="text-lg font-bold leading-none">{new Date(event.date).getDate()}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 line-clamp-1">{event.title}</h4>
                      <p className="text-sm text-gray-500">{new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                ))}
                <Link to="/events" className="block w-full py-2 text-center text-indigo-600 font-semibold text-sm hover:underline mt-2">View all events</Link>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No upcoming events at this location.</p>
            )}
          </div>

          {/* Call to Action */}
          <div className="bg-gray-900 rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-bold text-xl mb-2">Have you visited?</h3>
              <p className="text-gray-300 text-sm mb-4">Share your experience and photos with the community to earn badges.</p>
              <button className="w-full py-3 bg-white text-gray-900 rounded-xl font-bold hover:bg-gray-100 transition">
                Write a Review
              </button>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600 rounded-full blur-3xl opacity-50 -mr-10 -mt-10" />
          </div>
        </div>

      </div>
    </div>
  );
}

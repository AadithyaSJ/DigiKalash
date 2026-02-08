import React, { useEffect, useState } from "react";
import API from "../api";
import { useParams, Link } from "react-router-dom";
import { FiCalendar, FiClock, FiMapPin, FiChevronLeft, FiInfo, FiCheckCircle } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function HeritageEventsPage() {
  const { siteId } = useParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await API.get(`/heritage/sites/${siteId}/events/`);
        setEvents(res.data);
      } catch (err) {
        setError("Failed to load events.");
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, [siteId]);

  if (loading) return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
    </div>
  );

  if (error) return <div className="text-center mt-10 text-red-600 font-bold">{error}</div>;

  const today = new Date();
  const upcoming = events.filter((e) => new Date(e.date) >= today).sort((a, b) => new Date(a.date) - new Date(b.date));
  const past = events.filter((e) => new Date(e.date) < today).sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">

        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link to={`/sites/${siteId}`} className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1 mb-2">
              <FiChevronLeft /> Back to Site
            </Link>
            <h1 className="text-3xl font-display font-bold text-gray-900">Events & Activities</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Upcoming Events Column */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800">
              <span className="w-2 h-8 bg-indigo-600 rounded-full block"></span>
              Upcoming Events
            </h2>

            {upcoming.length > 0 ? (
              <div className="space-y-6 relative ml-4 pl-8 border-l-2 border-indigo-100">
                {upcoming.map((ev, idx) => (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={ev.id}
                    onClick={() => setSelectedEvent(selectedEvent?.id === ev.id ? null : ev)}
                    className={`relative bg-white rounded-2xl p-6 shadow-sm border transition-all cursor-pointer ${selectedEvent?.id === ev.id ? "border-indigo-500 ring-4 ring-indigo-50" : "border-gray-100 hover:shadow-md"}`}
                  >
                    {/* Timeline Dot */}
                    <div className="absolute -left-[41px] top-6 w-5 h-5 rounded-full bg-white border-4 border-indigo-600 shadow-sm" />

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <div>
                        <span className="text-indigo-600 font-bold text-sm tracking-uppercase mb-1 block">
                          {new Date(ev.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                        <h3 className="text-xl font-bold text-gray-900 leading-tight">{ev.title}</h3>
                      </div>
                      {ev.price && (
                        <div className="bg-indigo-50 text-indigo-700 font-bold px-4 py-2 rounded-lg text-center min-w-[100px]">
                          ₹{Number(ev.price).toLocaleString()}
                        </div>
                      )}
                    </div>

                    <p className="text-gray-600 line-clamp-2">{ev.details || ev.description}</p>

                    <div className="mt-4 flex items-center gap-6 text-sm text-gray-500 font-medium">
                      <span className="flex items-center gap-1"><FiClock /> {new Date(ev.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {/* Placeholder for duration/location if available */}
                    </div>

                    <AnimatePresence>
                      {selectedEvent?.id === ev.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden mt-4 pt-4 border-t border-gray-100 text-gray-700"
                        >
                          <p>{ev.details || "No additional details available."}</p>
                          <button className="mt-4 w-full py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition">RSVP / Book Now</button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-8 rounded-2xl border border-dashed border-gray-300 text-center text-gray-500">
                <FiCalendar className="mx-auto text-4xl mb-2 text-gray-300" />
                No upcoming events listed at the moment.
              </div>
            )}
          </div>

          {/* Past Events / Info Column */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-indigo-900 rounded-2xl p-6 text-white">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><FiInfo /> Why Attend?</h3>
              <p className="text-indigo-200 text-sm leading-relaxed">
                Experience culture firsthand through curated walks, workshops, and festivals. Earn badges and meet like-minded heritage enthusiasts.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-2 h-6 bg-gray-300 rounded-full block"></span>
                Past Events
              </h2>
              {past.length > 0 ? (
                <div className="space-y-3">
                  {past.slice(0, 5).map(ev => (
                    <div key={ev.id} className="bg-white p-4 rounded-xl border border-gray-100 opacity-70 hover:opacity-100 transition">
                      <h4 className="font-bold text-gray-800 text-sm">{ev.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">{new Date(ev.date).toLocaleDateString()}</p>
                    </div>
                  ))}
                  {past.length > 5 && <button className="text-sm text-indigo-600 hover:underline">View all past events</button>}
                </div>
              ) : (
                <p className="text-gray-500 text-sm italic">No past events recorded.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

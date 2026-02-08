import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiMapPin, FiCalendar, FiUser } from "react-icons/fi";
import API from "../api";
import { motion } from "framer-motion";

function formatDateTime(dt) {
  const d = new Date(dt);
  const day = d.toLocaleString("en-US", { month: "short", day: "numeric" });
  const time = d.toLocaleString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  return { day, time };
}

function UpcomingEvents() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    API.get("/heritage/events/upcoming")
      .then(res => setEvents(res.data.slice(0, 3)))
      .catch(err => console.error(err));
  }, []);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-indigo-600 font-bold tracking-wider uppercase text-sm">Join the Community</span>
          <h2 className="text-4xl font-display font-bold text-gray-900 mt-2">Upcoming Events & Workshops</h2>
          <p className="text-gray-500 max-w-2xl mx-auto mt-4 text-lg">
            Participate in curated cultural experiences, from artisan workshops to virtual heritage tours.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {events.map((event, index) => {
            const { day, time } = formatDateTime(event.date);

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group border border-gray-100"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={event.image || "/default-event.jpg"}
                    alt={event.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm text-center">
                    <div className="text-xs font-bold text-gray-500 uppercase">{day.split(" ")[0]}</div>
                    <div className="text-xl font-bold text-gray-900">{day.split(" ")[1]}</div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {event.title}
                  </h3>

                  <div className="space-y-2 mb-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <FiCalendar className="text-indigo-500" />
                      <span>{day}, {time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiMapPin className="text-indigo-500" />
                      <span className="truncate">
                        {event.location || (event.city ? `${event.city}, ${event.state}` : "Online Event")}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm line-clamp-2 mb-6 flex-1">
                    {event.details}
                  </p>

                  <Link
                    to={`/events/${event.id}`}
                    className="w-full py-3 rounded-xl border border-gray-200 font-semibold text-gray-700 hover:bg-black hover:text-white hover:border-black transition-all text-center"
                  >
                    View Details
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link to="/events" className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-800 transition-colors">
            See all events &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}

export default UpcomingEvents;

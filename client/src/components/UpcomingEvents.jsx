import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiMapPin, FiUser } from "react-icons/fi";
import API from "../api";

function formatDateTime(dt) {
  const d = new Date(dt);
  const day = d.toLocaleString("en-US", { month: "short", day: "numeric" });
  const time = d.toLocaleString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  return `${day} • ${time}`;
}

function UpcomingEvents() {
  const [events, setEvents] = useState([]);
  useEffect(() => {
    API.get("/heritage/events/upcoming").then(res => setEvents(res.data.slice(0, 3)));
  }, []);

  return (
    <section className="py-12 bg-gray-50">
      <h2 className="text-4xl font-bold text-center mb-3">Upcoming Events & Workshops</h2>
      <p className="text-gray-600 text-center mb-8">
        Join artisan workshops, cultural festivals, and educational tours
      </p>
      <div className="grid grid-cols-1 px-10 md:grid-cols-3 gap-8">
        {events.map(event => (
          <div key={event.id} className="bg-white rounded-2xl shadow-lg flex flex-col overflow-hidden">
            {/* Event Image with date badge */}
            <div className="relative">
              <img src={event.image || "/default-event.jpg"} alt={event.title} className="h-40 w-full object-cover" />
              <span className="absolute top-4 left-4 bg-orange-600 text-white text-xs font-semibold px-3 py-1 rounded-lg shadow">
                {formatDateTime(event.date)}
              </span>
            </div>
            {/* Details */}
            <div className="px-6 py-5 flex-1 flex flex-col">
              <h3 className="font-bold text-lg mb-1">{event.title}</h3>
              <p className="text-gray-500 text-sm flex items-center mb-1">
                <FiMapPin className="mr-1" />
                {event.location || (event.city && event.state ? `${event.city}, ${event.state}` : "Virtual Event")}
              </p>
              {event.host && (
                <p className="text-gray-500 text-sm flex items-center mb-1">
                  <FiUser className="mr-1"/> Hosted by {event.host}
                </p>
              )}
              <p className="text-gray-700 text-sm line-clamp-2 mb-3">{event.details}</p>
              <div className="flex gap-2 flex-wrap mb-4">
                {event.tags && event.tags.map(tag => (
                  <span key={tag} className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs font-semibold">{tag}</span>
                ))}
              </div>
              <Link
                to={`/events/${event.id}`}
                className="bg-black text-white w-full py-2 mt-auto rounded-lg font-bold text-center hover:bg-gray-900 transition"
              >
                Register
              </Link>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-8">
        <Link to="/events" className="px-6 py-2 bg-gray-100 rounded-xl text-black font-bold hover:bg-gray-200 transition">
          View All Events &rarr;
        </Link>
      </div>
    </section>
  );
}

export default UpcomingEvents;

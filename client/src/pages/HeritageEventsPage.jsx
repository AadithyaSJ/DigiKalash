import React, { useEffect, useState } from "react";
import API from "../api";
import { useParams } from "react-router-dom";

export default function HeritageEventsPage() {
  const { siteId } = useParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedEventId, setSelectedEventId] = useState(null);
  const [eventDetails, setEventDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await API.get(`/heritage/sites/${siteId}/events/`);
        setEvents(res.data);
      } catch (err) {
        setError("Failed to load events.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
    setSelectedEventId(null);
    setEventDetails(null);
    setDetailsError(null);
  }, [siteId]);

  const fetchEventDetails = async (eventId) => {
    setSelectedEventId(eventId);
    setEventDetails(null);
    setDetailsError(null);
    setDetailsLoading(true);
    try {
      const res = await API.get(`/heritage/sites/${siteId}/events/${eventId}/`);
      setEventDetails(res.data);
    } catch (err) {
      setDetailsError("Failed to load event details.");
      console.error(err);
    } finally {
      setDetailsLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading events...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  // Split upcoming and completed
  const today = new Date();
  const upcoming = events.filter((e) => new Date(e.date) >= today);
  const completed = events.filter((e) => new Date(e.date) < today);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Events</h1>

      {/* Upcoming Events */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
        {upcoming.length ? (
          <ul className="space-y-4">
            {upcoming.map((ev) => (
              <li
                key={ev.id}
                className="border p-4 rounded shadow hover:shadow-lg transition cursor-pointer"
                onClick={() => fetchEventDetails(ev.id)}
              >
                <h3 className="text-xl font-semibold">{ev.title}</h3>
                <p className="text-gray-600">{ev.details || ev.description}</p>
                <p className="italic">Date: {new Date(ev.date).toLocaleDateString()}</p>

                {/* Show expanded details if this event is selected */}
                {selectedEventId === ev.id && (
                  <div className="mt-4 bg-gray-50 p-4 rounded border">
                    {detailsLoading && <p>Loading event details...</p>}
                    {detailsError && (
                      <p className="text-red-600">{detailsError}</p>
                    )}
                    {eventDetails && (
                      <>
                        <h4 className="font-semibold text-lg">{eventDetails.title}</h4>
                        <p><strong>Date:</strong> {new Date(eventDetails.date).toLocaleString()}</p>
                        <p><strong>Details:</strong> {eventDetails.details}</p>
                        {/* Add more fields as needed */}
                      </>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No upcoming events.</p>
        )}
      </section>

      {/* Completed Events */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Completed Events</h2>
        {completed.length ? (
          <ul className="space-y-4">
            {completed.map((ev) => (
              <li
                key={ev.id}
                className="border p-4 rounded shadow hover:shadow-lg transition cursor-pointer"
                onClick={() => fetchEventDetails(ev.id)}
              >
                <h3 className="text-xl font-semibold">{ev.title}</h3>
                <p className="text-gray-600">{ev.details || ev.description}</p>
                <p className="italic">Date: {new Date(ev.date).toLocaleDateString()}</p>

                {selectedEventId === ev.id && (
                  <div className="mt-4 bg-gray-50 p-4 rounded border">
                    {detailsLoading && <p>Loading event details...</p>}
                    {detailsError && (
                      <p className="text-red-600">{detailsError}</p>
                    )}
                    {eventDetails && (
                      <>
                        <h4 className="font-semibold text-lg">{eventDetails.title}</h4>
                        <p><strong>Date:</strong> {new Date(eventDetails.date).toLocaleString()}</p>
                        <p><strong>Details:</strong> {eventDetails.details}</p>
                      </>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No completed events.</p>
        )}
      </section>
    </div>
  );
}

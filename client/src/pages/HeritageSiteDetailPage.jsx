import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api";

const formatCurrency = (amount) => {
  if (!amount) return "";
  return `₹${Number(amount).toLocaleString("en-IN")}`;
};

export default function HeritageSiteDetailPage() {
  const { siteId } = useParams();
  const [site, setSite] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [siteRes, eventRes] = await Promise.all([
          API.get(`/heritage/sites/${siteId}/`),
          API.get(`/heritage/sites/${siteId}/events/`),
        ]);
        setSite(siteRes.data);
        console.log(siteRes.data);        
        setEvents(eventRes.data);
      } catch (err) {
        setSite(null);
      }
      setLoading(false);
    }
    fetchData();
  }, [siteId]);

  if (loading) return <div className="flex justify-center items-center h-48">Loading...</div>;
  if (!site) return <div className="text-center text-red-600 mt-10">Heritage site not found.</div>;

  const Badge = ({ text, color = "bg-gray-200" }) => (
    <span className={`inline-block px-3 py-0.5 rounded-full text-xs font-semibold mr-2 mb-1 ${color}`}>
      {text}
    </span>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Back Link */}
      <Link to="/heritage/sites" className="mb-4 block text-indigo-600 hover:underline">
        &larr; Back to Heritage Sites
      </Link>

      {/* Main Image */}
      <section className="rounded-2xl bg-white shadow relative overflow-hidden">
        <img
          src={site.image || "/default-sites.jpg"}
          alt={site.name}
          className="w-full h-[420px] object-cover"
        />
        {/* Add thumbnails/audio controls here if needed */}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-6">
        {/* Left/main column */}
        <div className="lg:col-span-3">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-4">
            <div>
              <h1 className="text-3xl font-bold">{site.name}</h1>
              <div className="flex flex-wrap mt-2">
                {site.tags?.map((tag) => (
                  <Badge key={tag.id} text={tag.name} />
                ))}
                {site.is_unesco && <Badge text="UNESCO" color="bg-blue-600 text-white" />}
                {site.is_verified && <Badge text="Verified" color="bg-green-600 text-white" />}
                {site.is_accessible && <Badge text="Accessible" color="bg-gray-700 text-white" />}
              </div>
              <div className="mt-1 text-gray-500 text-sm flex items-center gap-1">
                <svg width="16" height="16" className="inline mr-1">
                  <circle cx="8" cy="8" r="8" fill="#cfcfcf" />
                </svg>
                {site.city}, {site.state}
                {site.rating > 0 && (
                  <span className="ml-4 text-yellow-600 font-medium">
                    {site.rating}{" "}
                    <span className="text-gray-400">
                      ({site.review_count || "reviews"})
                    </span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <p className="text-lg my-3">{site.description}</p>

          {/* Tabs */}
          <div className="flex items-center rounded-2xl bg-gray-100 overflow-hidden mb-6">
            {["overview", "history", "resources", "contribute"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-8 py-2 text-md font-medium transition ${
                  tab === t
                    ? "bg-white shadow rounded-2xl"
                    : "text-gray-600 bg-gray-100"
                }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Contents */}
          <div>
            {tab === "overview" && (
              <div className="bg-white rounded-xl shadow p-6 mb-8">
                <h3 className="font-bold text-xl mb-3">About This Site</h3>
                <p className="mb-5 text-gray-800">
                  {site.detailed_description || site.description}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold mb-2">Architecture Details</h4>
                    <p>Built: <span className="font-semibold">{site.built || "-"}</span></p>
                    <p>Architect: <span className="font-semibold">{site.architect || "-"}</span></p>
                    <p>Style: <span className="font-semibold">{site.style || "-"}</span></p>
                  </div>
                  <div>
                    <h4 className="font-bold mb-2">Conservation Status</h4>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-40">Structural Integrity</span>
                      <div className="flex-1 bg-gray-200 h-2 rounded overflow-hidden">
                        <div
                          className="bg-black h-2"
                          style={{ width: `${site.conservation_structural_integrity || 0}%` }}
                        />
                      </div>
                      <span className="ml-2 font-semibold">{site.conservation_structural_integrity ?? "--"}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-40">Preservation Quality</span>
                      <div className="flex-1 bg-gray-200 h-2 rounded overflow-hidden">
                        <div
                          className="bg-black h-2"
                          style={{ width: `${site.conservation_preservation_quality || 0}%` }}
                        />
                      </div>
                      <span className="ml-2 font-semibold">{site.conservation_preservation_quality ?? "--"}%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {tab === "history" && (
  <div className="bg-white rounded-xl shadow p-6 mb-8">
    <h3 className="font-bold text-xl mb-3">Historical Timeline</h3>
    {site.timeline && Object.keys(site.timeline).length > 0 ? (
      <div className="space-y-4">
        {Object.entries(site.timeline).map(([key, value]) => (
          <div key={key} className="flex items-start gap-3">
            <div className="font-semibold text-indigo-700 min-w-[60px]">{key}</div>
            <div className="text-gray-700">{value}</div>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-500">No timeline data available.</p>
    )}
  </div>
)}


            {tab === "resources" && (
  <div className="bg-white rounded-xl shadow p-6 mb-8">
    <h3 className="font-bold text-xl mb-3">Research Resources</h3>
    {site.resources && site.resources.length > 0 ? (
      site.resources.map((res) => (
        <div key={res.id} className="flex items-center justify-between bg-gray-50 rounded p-3 mb-4">
          <div>
            <p className="font-semibold">{res.title}</p>
            <p className="text-xs text-gray-500">
              {res.filetype?.toUpperCase()} • {res.size_mb} MB
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
              res.access === "Public" ? "bg-gray-200 text-gray-700" : "bg-gray-800 text-white"
            }`}>
              {res.access}
            </span>
            <a
              href={res.file}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-sm font-semibold rounded px-4 py-1 ${
                res.access === "Public" ? "bg-black text-white" : "bg-white border border-black text-black"
              }`}
            >
              {res.access === "Public" ? "Download" : "Request Access"}
            </a>
          </div>
        </div>
      ))
    ) : (
      <p className="text-gray-500">No resources available.</p>
    )}
  </div>
)}


            {tab === "contribute" && (
              <div className="bg-white rounded-xl shadow p-6 mb-8">
                <h3 className="font-bold text-xl">Contribute</h3>
                <p>Contribute section coming soon.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Visitor Information */}
          <div className="bg-white rounded-xl shadow p-5">
            <h4 className="font-bold text-lg mb-3">Visitor Information</h4>
            <div className="flex items-center gap-2 mb-2">
              <span className="material-icons text-gray-500">schedule</span>
              <div>
                <p className="font-semibold">Timings</p>
                <p className="text-gray-500">{site.visitor_timings || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="material-icons text-gray-500">attach_money</span>
              <div>
                <p className="font-semibold">Entry Fee</p>
                <p className="text-gray-500">{site.visitor_fee || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="material-icons text-gray-500">event</span>
              <div>
                <p className="font-semibold">Best Time to Visit</p>
                <p className="text-gray-500">{site.visitor_best_time || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-icons text-gray-500">watch_later</span>
              <div>
                <p className="font-semibold">Duration</p>
                <p className="text-gray-500">{site.visitor_duration || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          {events.length > 0 && (
            <div className="bg-white rounded-xl shadow p-5">
              <h4 className="font-bold text-lg mb-3">Upcoming Events</h4>
              <div className="space-y-4">
                {events.map(evt => (
                  <div key={evt.id} className="bg-gray-50 rounded p-3 flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{evt.title}</p>
                      <p className="text-sm text-gray-600">{new Date(evt.date).toLocaleString("en-IN", {dateStyle: "medium", timeStyle: "short" })}</p>
                      {evt.price && <p className="text-green-700 font-bold">₹{evt.price.toLocaleString("en-IN")}</p>}
                    </div>
                    <button className="bg-black text-white px-4 py-1 rounded font-semibold">Register</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Items (if any) */}
          {site.related_items && site.related_items.length > 0 && (
            <div className="bg-white rounded-xl shadow p-5">
              <h4 className="font-bold text-lg mb-3">Related Items</h4>
              <div className="space-y-3">
                {site.related_items.map(item => (
                  <div key={item.id} className="flex items-center gap-4">
                    <img src={item.image || "/item-default.jpg"} alt={item.name} className="w-14 h-14 object-cover rounded" />
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.seller}</p>
                    </div>
                    <p className="font-bold">₹{item.price.toLocaleString("en-IN")}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </aside>
      </div>
    </div>
  );
}

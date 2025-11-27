import React, { useEffect, useState } from "react";
import API from "../api";
import AdminUserManagement from "../components/AdminUserManagement";
import AdminSiteManagement from "../components/AdminSiteManagement";
import AdminEventManagement from "../components/AdminEventManagement";
// import AdminForumManagement from "./AdminForumManagement";

const adminTabs = [
  { label: "Overview", key: "overview" },
  { label: "User Management", key: "users" },
  { label: "Site Management", key: "sites" },
  { label: "Event Management", key: "events" },
  // { label: "Forum Management", key: "forum" }, // Uncomment and add component if needed
];

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      try {
        const res = await API.get("/users/profile/");
        setUser(res.data);
      } catch (err) {
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  const renderTabSwitcher = () => (
    <nav className="flex space-x-2 mb-8 w-full rounded-2xl overflow-hidden bg-gray-100">
      {adminTabs.map(({ label, key, badge }) => (
        <button
          key={key}
          className={`flex items-center px-8 py-3 transition font-semibold rounded-2xl ${
            activeTab === key ? "bg-white text-black shadow" : "bg-gray-100 text-gray-700"
          }`}
          onClick={() => setActiveTab(key)}
        >
          {label}
          {badge && (
            <span className="ml-2 px-2 py-0.5 bg-red-600 text-white rounded-full text-xs font-bold">
              {badge}
            </span>
          )}
        </button>
      ))}
    </nav>
  );

  const renderTabContent = () => {
    if (!user?.is_staff) {
      return <div className="text-center mt-10 text-lg text-gray-700">You do not have admin access.</div>;
    }
    switch (activeTab) {
      case "users":
        return <AdminUserManagement />;
      case "sites":
        return <AdminSiteManagement />;
      case "events":
        return <AdminEventManagement />;
      // case "forum":
      //   return <AdminForumManagement />;
      default:
        return (
          <div className="bg-white p-8 rounded-xl shadow">
            <h2 className="text-xl font-bold mb-4">Admin Overview</h2>
            <p>Welcome to your admin dashboard.</p>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-2xl text-gray-600 font-semibold">
        Loading...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 text-center mt-10 font-semibold">{error}</div>;
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen text-xl text-gray-700">
        Please log in to access the dashboard.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-10 py-6">
      {/* Header */}
      <header className="bg-white shadow rounded-2xl px-6 py-4 mb-8 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-4">
          {user.profile_image ? (
            <img
              src={user.profile_image}
              alt={`${user.username} avatar`}
              className="w-14 h-14 rounded-full object-cover border border-gray-300"
            />
          ) : (
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-indigo-600 text-white text-2xl font-extrabold">
              {user.username.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-xl font-semibold">{user.username}</h1>
            <p className="text-gray-500">{user.email}</p>
          </div>
        </div>
        <span
          className={`px-4 py-1 rounded-full text-sm font-semibold ${
            user.is_verified ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {user.is_verified ? "Verified" : "Not Verified"}
        </span>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto">
        {renderTabSwitcher()}
        {renderTabContent()}
      </main>
    </div>
  );
}

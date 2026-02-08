import React, { useEffect, useState } from "react";
import API from "../api";
import AdminUserManagement from "../components/AdminUserManagement";
import AdminSiteManagement from "../components/AdminSiteManagement";
import AdminEventManagement from "../components/AdminEventManagement";
import OrderHistory from "../components/OrderHistory";
import { FiUser, FiSettings, FiGrid, FiCalendar, FiLogOut, FiCheckCircle, FiAlertCircle, FiMenu, FiShoppingBag, FiBox } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const adminTabs = [
  { label: "Overview", key: "overview", icon: FiGrid },
  { label: "User Management", key: "users", icon: FiUser },
  { label: "Site Management", key: "sites", icon: FiSettings },
  { label: "Event Management", key: "events", icon: FiCalendar },
  { label: "My Orders", key: "orders", icon: FiBox },
  { label: "My Profile", key: "profile", icon: FiUser },
];

const clientTabs = [
  { label: "My Profile", key: "profile", icon: FiUser },
  { label: "My Orders", key: "orders", icon: FiBox },
];

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview"); // Default for admin, changed in useEffect for user
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      try {
        const res = await API.get("/users/profile/");
        setUser(res.data);
        // Set default tab based on role
        if (!res.data.is_staff) {
          setActiveTab("orders");
        }
      } catch (err) {
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case "users": return <AdminUserManagement />;
      case "sites": return <AdminSiteManagement />;
      case "events": return <AdminEventManagement />;
      case "orders": return <OrderHistory />;
      case "profile":
        return (
          <div className="bg-white p-8 rounded-2xl shadow-sm max-w-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h2>
            <div className="flex items-center gap-6 mb-8">
              <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center text-3xl font-bold text-indigo-600">
                {user?.username?.[0]?.toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{user?.username}</h3>
                <p className="text-gray-500">{user?.email}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full uppercase">
                  {user?.is_staff ? "Administrator" : "Member"}
                </span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 uppercase font-bold mb-1">Username</p>
                  <p className="font-medium">{user?.username}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 uppercase font-bold mb-1">Email</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        // Admin Overview (only if staff)
        if (!user?.is_staff) return null;
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
              <h3 className="text-lg font-bold opacity-80">Total Users</h3>
              <p className="text-4xl font-bold mt-2">1,234</p>
              <p className="text-sm opacity-60 mt-4">+12% from last month</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-gray-500 font-bold text-sm uppercase">Pending Approvals</h3>
              <p className="text-3xl font-bold text-gray-800 mt-2">23</p>
              <div className="w-full bg-gray-100 h-1.5 rounded-full mt-4 overflow-hidden">
                <div className="bg-orange-500 w-1/3 h-full rounded-full" />
              </div>
            </div>
            {/* Add more widgets as needed */}
          </div>
        );
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" /></div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600 font-bold">{error}</div>;
  if (!user) return <div className="min-h-screen flex items-center justify-center text-gray-600">Please log in to access dashboard.</div>;

  const currentTabs = user.is_staff ? adminTabs : clientTabs;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-gray-100 fixed h-full z-10">
        <div className="p-8 border-b border-gray-50">
          <h1 className="font-display font-bold text-2xl text-indigo-900 tracking-tight">
            {user.is_staff ? <><span className="text-indigo-600">Admin</span>Panel</> : "My Dashboard"}
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {currentTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${activeTab === tab.key
                ? "bg-indigo-50 text-indigo-700 shadow-sm"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
            >
              <tab.icon className={`text-xl ${activeTab === tab.key ? "text-indigo-600" : "text-gray-400"}`} />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-50">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition font-medium">
            <FiLogOut /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-72 flex flex-col min-h-screen">

        {/* Top Header */}
        <header className="bg-white border-b border-gray-100 sticky top-0 z-20 px-8 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800 lg:hidden">Dashboard</h2>
          <div className="hidden lg:block">
            <h2 className="text-xl font-bold text-gray-800 capitalize">{activeTab.replace('-', ' ')}</h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900">{user.username}</p>
                <p className="text-xs text-gray-500 uppercase">{user.is_staff ? "Administrator" : "User"}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border-2 border-white shadow-sm overflow-hidden">
                {user.profile_image ? <img src={user.profile_image} className="w-full h-full object-cover" alt="" /> : user.username[0].toUpperCase()}
              </div>
            </div>
            <button className="lg:hidden text-gray-600 text-2xl" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <FiMenu />
            </button>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="p-8 flex-1 overflow-x-hidden">
          {/* Mobile Sidebar Overlay */}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <motion.aside
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  className="w-64 bg-white h-full shadow-2xl p-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <nav className="space-y-2 mt-4">
                    {currentTabs.map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => { setActiveTab(tab.key); setSidebarOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === tab.key ? "bg-indigo-50 text-indigo-700" : "text-gray-600"
                          }`}
                      >
                        <tab.icon /> {tab.label}
                      </button>
                    ))}
                  </nav>
                </motion.aside>
              </motion.div>
            )}
          </AnimatePresence>

          {renderTabContent()}
        </main>
      </div>
    </div>
  );
}

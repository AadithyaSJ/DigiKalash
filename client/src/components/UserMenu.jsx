import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { motion } from "framer-motion";

export default function UserMenu() {
  const navigate = useNavigate();
  const isAuthenticated = Boolean(localStorage.getItem("access_token"));

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-4">
        <Link
          to="/profile"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 font-medium hover:bg-indigo-100 transition-colors"
        >
          <FaUser className="text-lg" />
          <span>Profile</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-red-200 text-red-600 font-medium hover:bg-red-50 transition-colors"
          aria-label="Logout"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link to="/login">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-5 py-2 rounded-full font-medium text-gray-700 hover:text-indigo-600 transition-colors"
        >
          Login
        </motion.button>
      </Link>
      <Link to="/register">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-5 py-2 rounded-full font-medium bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors"
        >
          Sign Up
        </motion.button>
      </Link>
    </div>
  );
}

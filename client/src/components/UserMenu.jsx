import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";

export default function UserMenu() {
  const navigate = useNavigate();
  const isAuthenticated = Boolean(localStorage.getItem("access_token"));

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    // clear other auth-related data if any
    navigate("/login");
  };

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-4">
        <Link to="/profile" className="flex items-center gap-1 text-black font-medium">
          <FaUser className="text-xl" />
          Profile
        </Link>
        <button
          onClick={handleLogout}
          className="text-black font-medium hover:text-red-600"
          aria-label="Logout"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Link to="/login" className="text-black font-medium hover:text-indigo-600">
        Login
      </Link>
    </div>
  );
}

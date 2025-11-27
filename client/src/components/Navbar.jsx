import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaBookOpen,
  FaGlobeAsia,
  FaCalendarAlt,
  FaRegCommentDots,
  FaShoppingBag,
  FaBell,
  FaUser,
  FaSearch,
  FaShieldAlt
} from "react-icons/fa";
import UserMenu from "./UserMenu";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 15);
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 py-3 px-6 flex items-center justify-between transition
        ${scrolled ? "bg-white/70 backdrop-blur-lg shadow-lg" : "bg-white"}`
      }
      style={{ minHeight: "72px" }}
    >
      {/* Logo and Brand */}
      <div className="flex items-center gap-3">
        <img src="/logo.jpeg" className="text-3xl text-black w-10 rounded-full mt-1" />
        <span className="font-bold text-2xl text-black">Kalash Digital</span>
      </div>

      {/* Main Navigation */}
      <ul className="flex gap-4 items-center font-medium">
        <li>
          <Link
            to="/"
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
              location.pathname === "/home"
                ? "bg-black text-white font-bold shadow"
                : "text-black hover:bg-orange-100"
            }`}
          >
            <FaGlobeAsia />
            Home
          </Link>
        </li>
        <li>
          <Link to="/sites" className="flex items-center gap-2 px-3 py-2 rounded-lg text-black hover:bg-gray-100 transition">
            <FaGlobeAsia /> Heritage Sites
          </Link>
        </li>
        <li>
          <Link to="/events" className="flex items-center gap-2 px-3 py-2 rounded-lg text-black hover:bg-gray-100 transition">
            <FaCalendarAlt /> Events
          </Link>
        </li>
        <li>
          <Link to="/forum" className="flex items-center gap-2 px-3 py-2 rounded-lg text-black hover:bg-gray-100 transition">
            <FaRegCommentDots /> Forum
          </Link>
        </li>
        <li>
          <Link to="/marketplace" className="flex items-center gap-2 px-3 py-2 rounded-lg text-black hover:bg-gray-100 transition">
            <FaShoppingBag /> Marketplace
          </Link>
        </li>
      </ul>

      {/* Search, Notifications, Profile, Admin */}
      <div className="flex items-center gap-4">
        <UserMenu />
      </div>
    </nav>
  );
}

export default Navbar;

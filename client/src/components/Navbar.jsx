import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiShoppingCart } from "react-icons/fi";
import { FaGlobeAsia, FaLandmark, FaStore, FaCalendarAlt, FaComments } from "react-icons/fa";
import UserMenu from "./UserMenu";
import { useCart } from "../context/CartContext";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { getCartCount } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { path: "/home", label: "Home", icon: FaGlobeAsia },
    { path: "/sites", label: "Heritage Sites", icon: FaLandmark },
    { path: "/marketplace", label: "Marketplace", icon: FaStore },
    // { path: "/events", label: "Events", icon: FaCalendarAlt },
    { path: "/forum", label: "Forum", icon: FaComments },
  ];

  const isHome = location.pathname === "/home" || location.pathname === "/";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || !isHome
        ? "py-2 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100"
        : "py-4 bg-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/home" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:rotate-12 transition-transform">
            V
          </div>
          <span className={`text-2xl font-display font-bold tracking-tight ${scrolled || !isHome ? "text-gray-900" : "text-white"}`}>
            VRWarriors
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors relative group flex items-center gap-2 ${location.pathname === link.path
                ? "text-indigo-600"
                : scrolled || !isHome
                  ? "text-gray-600 hover:text-indigo-600"
                  : "text-white/80 hover:text-white"
                }`}
            >
              {link.label}
              {location.pathname === link.path && (
                <motion.div
                  layoutId="underline"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-indigo-600 rounded-full"
                />
              )}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">

          {/* Cart Icon */}
          <Link to="/cart" className="relative p-2 rounded-full hover:bg-black/5 transition group">
            <FiShoppingCart className={`text-xl ${scrolled ? "text-gray-700" : "text-white"}`} />
            {getCartCount() > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                {getCartCount()}
              </span>
            )}
          </Link>

          <div className="hidden md:block">
            <UserMenu />
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className={`md:hidden text-2xl ${scrolled ? "text-gray-900" : "text-white"}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 shadow-xl overflow-hidden"
          >
            <div className="px-6 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-gray-700 font-medium transition"
                >
                  <link.icon className="text-indigo-600" />
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-gray-100 pt-4">
                <UserMenu />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;

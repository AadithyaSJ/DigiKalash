import React from "react";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-[#f7f7fb] pt-12 pb-6 mt-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 px-6 pb-6 text-left">
        <div>
          <div className="flex items-center mb-2 gap-2">
            <span className="bg-orange-600 rounded-full p-2"><span className="font-extrabold text-white">📍</span></span>
            <span className="font-bold text-xl text-gray-900">Heritage India</span>
          </div>
          <p className="text-gray-600 font-medium text-sm">Preserving and celebrating India's rich cultural heritage through technology and community.</p>
        </div>
        <div>
          <div className="font-bold mb-2">Explore</div>
          <div className="space-y-1 text-gray-700 text-sm">
            <Link to="/sites">Heritage Sites</Link>
            <Link to="/events">Events</Link>
            <Link to="/marketplace">Marketplace</Link>
            <Link to="/forum">Forum</Link>
          </div>
        </div>
        <div>
          <div className="font-bold mb-2">Community</div>
          <div className="space-y-1 text-gray-700 text-sm">
            <Link to="/join-researcher">Join as Researcher</Link>
            <Link to="/become-guide">Become a Guide</Link>
            <Link to="/partner">Partner with Us</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>
        <div>
          <div className="font-bold mb-2">Legal</div>
          <div className="space-y-1 text-gray-700 text-sm">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/cookies">Cookie Policy</Link>
            <Link to="/accessibility">Accessibility</Link>
          </div>
        </div>
      </div>
      <hr className="my-3 border-gray-200" />
      <div className="text-xs text-gray-500 text-center">
        &copy; {new Date().getFullYear()} Heritage India. All rights reserved. Made with <FaHeart className="inline text-pink-500 mx-1" /> for preserving India's heritage.
      </div>
    </footer>
  );
}

export default Footer;

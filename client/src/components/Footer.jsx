import React from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaTwitter, FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
        {/* Brand */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-xl">
              🏛️
            </div>
            <span className="font-display font-bold text-2xl tracking-tight">Heritage India</span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
            Preserving and celebrating India's rich cultural heritage through immersive technology and community engagement.
          </p>
          <div className="flex gap-4 pt-2">
            {[FaTwitter, FaFacebook, FaInstagram, FaLinkedin].map((Icon, i) => (
              <a key={i} href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-indigo-600 transition-colors">
                <Icon className="text-sm" />
              </a>
            ))}
          </div>
        </div>

        {/* Links Column 1 */}
        <div>
          <h3 className="font-bold text-lg mb-6 text-indigo-400">Explore</h3>
          <ul className="space-y-3 text-sm text-gray-400">
            <li><Link to="/sites" className="hover:text-white transition-colors">Heritage Sites</Link></li>
            <li><Link to="/events" className="hover:text-white transition-colors">Events & Festivals</Link></li>
            <li><Link to="/marketplace" className="hover:text-white transition-colors">Artisan Marketplace</Link></li>
            <li><Link to="/forum" className="hover:text-white transition-colors">Community Forum</Link></li>
          </ul>
        </div>

        {/* Links Column 2 */}
        <div>
          <h3 className="font-bold text-lg mb-6 text-indigo-400">Community</h3>
          <ul className="space-y-3 text-sm text-gray-400">
            <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link to="/join" className="hover:text-white transition-colors">Join as Researcher</Link></li>
            <li><Link to="/guides" className="hover:text-white transition-colors">Become a Guide</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="font-bold text-lg mb-6 text-indigo-400">Stay Updated</h3>
          <p className="text-gray-400 text-sm mb-4">Subscribe to our newsletter for the latest heritage updates.</p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="bg-gray-800 border-none rounded-lg px-4 py-2 text-sm w-full focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <button className="bg-indigo-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
              Join
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-gray-500 text-xs">
          &copy; {new Date().getFullYear()} Heritage India. All rights reserved.
        </div>
        <div className="flex gap-6 text-xs text-gray-500">
          <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-white">Terms of Service</Link>
        </div>
        <div className="text-xs text-gray-500 flex items-center gap-1">
          Made with <FaHeart className="text-red-500" /> in India
        </div>
      </div>
    </footer>
  );
}

export default Footer;

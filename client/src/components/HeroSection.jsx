import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import backgroundImage from "../assets/default-sites.jpg";

function HeroSection() {
  return (
    <section className="relative w-full h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background with Parallax effect (simulated with fixed) */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.6)"
        }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-black/30 z-10" />

      {/* Content */}
      <div className="relative z-20 text-center px-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 text-sm font-semibold tracking-wider mb-6 backdrop-blur-sm">
            DISCOVER THE UNTOLD STORIES
          </span>
          <h1 className="font-display font-bold text-white text-5xl md:text-7xl leading-tight mb-8 drop-shadow-lg">
            Experience India's <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200">
              Timeless Heritage
            </span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-gray-200 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed font-light"
        >
          Embark on a digital journey through centuries of culture. Explore VR tours,
          connect with artisans, and join a community dedicated to preservation.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            to="/sites"
            className="group relative px-8 py-4 bg-indigo-600 rounded-full font-bold text-white shadow-lg shadow-indigo-600/30 overflow-hidden hover:scale-105 transition-transform duration-300"
          >
            <span className="relative z-10">Start Exploring</span>
            <div className="absolute inset-0 bg-indigo-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
          </Link>
          <Link
            to="/events"
            className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full font-bold text-white hover:bg-white/20 transition-all duration-300"
          >
            Find Events
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20"
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-1.5 h-1.5 bg-white rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
}

export default HeroSection;

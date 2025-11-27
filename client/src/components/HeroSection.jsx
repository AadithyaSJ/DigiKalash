import React from "react";
import { Link } from "react-router-dom";
import backgroundImage from "../assets/default-sites.jpg";

function HeroSection() {
  return (
    <section
      className="relative w-full h-[630px] p-10 flex items-center justify-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "top",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 z-10"></div>
      {/* Content */}
      <div className="relative z-20 text-center flex flex-col items-center justify-center w-full px-4">
        <h1 className="font-extrabold text-white text-5xl md:text-6xl leading-tight mb-5">
          Discover India's Living <br /> Heritage
        </h1>
        <p className="text-white text-lg md:text-xl mb-8 max-w-2xl mx-auto">
          Explore thousands of heritage sites, connect with artisans, join cultural events, and contribute to preserving India's rich cultural legacy.
        </p>
        <Link
          to="/sites"
          className="bg-orange-600 hover:bg-orange-700 px-8 py-3 rounded font-semibold shadow text-white text-lg transition"
        >
          Explore Sites &rarr;
        </Link>
      </div>
    </section>
  );
}

export default HeroSection;

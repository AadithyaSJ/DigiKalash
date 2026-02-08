import React, { useEffect, useState } from "react";
import API from "../api";
import { motion } from "framer-motion";

function ImpactNumbers() {
  const [numbers, setNumbers] = useState({
    heritage_sites_preserved: 0,
    artisans_registered: 0,
    community_members: 0,
    monthly_events: 0,
  });

  useEffect(() => {
    API.get("/heritage/stats/numbers/")
      .then(res => setNumbers(res.data))
      .catch(err => console.error(err));
  }, []);

  const stats = [
    { label: "Heritage Sites", value: numbers.heritage_sites_preserved, color: "text-orange-500" },
    { label: "Artisans", value: numbers.artisans_registered, color: "text-purple-500" },
    { label: "Community", value: numbers.tourists_registered + numbers.researchers_registered, color: "text-blue-500" },
    { label: "Events", value: numbers.events, color: "text-pink-500" },
  ];

  return (
    <section className="py-20 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-6 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-lg transition-all duration-300"
            >
              <div className={`text-4xl md:text-5xl font-extrabold ${stat.color} mb-2 font-display`}>
                {stat.value}+
              </div>
              <div className="text-gray-600 font-medium uppercase tracking-wide text-xs md:text-sm">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ImpactNumbers;

import React, { useEffect, useState } from "react";
import API from "../api";

function ImpactNumbers() {
  const [numbers, setNumbers] = useState({
    heritage_sites_preserved: 0,
    artisans_registered: 0,
    community_members: 0,
    monthly_events: 0,
  });

  useEffect(() => {
    API.get("/heritage/stats/numbers/").then(res => setNumbers(res.data));
  }, []);

  // Use format with "+" for numbers
  return (
    <section className="py-12 bg-white">
      <div className="flex flex-wrap justify-center items-center gap-16 mb-6">
        <div className="text-center">
          <div className="text-4xl font-extrabold text-orange-600">{numbers.heritage_sites_preserved}+ </div>
          <div className="mt-2 text-gray-700 font-medium">Heritage Sites</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-extrabold text-purple-600">{numbers.artisans_registered}+ </div>
          <div className="mt-2 text-gray-700 font-medium">Verified Artisans</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-extrabold text-green-600">{numbers.tourists_registered + numbers.researchers_registered}+ </div>
          <div className="mt-2 text-gray-700 font-medium">Community Members</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-extrabold text-red-600">{numbers.events}+ </div>
          <div className="mt-2 text-gray-700 font-medium">Events</div>
        </div>
      </div>
    </section>
  );
}

export default ImpactNumbers;

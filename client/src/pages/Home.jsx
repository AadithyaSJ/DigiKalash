import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import FeaturedSites from "../components/FeaturedSites";
import UpcomingEvents from "../components/UpcomingEvents";
import ImpactNumbers from "../components/ImpactNumbers";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-grow">
        <HeroSection />
        <FeaturedSites />
        <UpcomingEvents />
        <ImpactNumbers />
      </main>
    </div>
  );
}

'use client';

import HeroSection from './_components/HeroSection';
import FeaturesSection from './_components/FeaturesSection';
import MapSection from './_components/MapSection';
import Footer from './_components/Footer';

export default function CustomerMainPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <HeroSection />
      <FeaturesSection />
      <MapSection />
      <Footer />
    </div>
  );
}

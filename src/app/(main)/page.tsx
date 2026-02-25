'use client';

import { useState } from 'react';
import Footer from '@/app/(main)/(customer)/main/_components/Footer';
import HeroSection from '@/app/(main)/(customer)/main/_components/HeroSection';
import FeaturesSection from '@/app/(main)/(customer)/main/_components/FeaturesSection';
import MapSection from '@/app/(main)/(customer)/main/_components/MapSection';
import SellerSection from '@/app/(main)/_components/SellerSection';

type Role = 'customer' | 'seller';

export default function LandingPage() {
  const [activeRole, setActiveRole] = useState<Role>('customer');

  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      {activeRole === 'customer' ? (
        <>
          <HeroSection activeRole={activeRole} onRoleChange={setActiveRole} />
          <FeaturesSection />
          <MapSection />
          <Footer />
        </>
      ) : (
        <SellerSection activeTab={activeRole} setActiveTab={setActiveRole} />
      )}
    </div>
  );
}

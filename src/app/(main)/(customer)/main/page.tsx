'use client';

import { useState } from 'react';
import Footer from './_components/Footer';
import HeroSection from './_components/HeroSection';
import FeaturesSection from './_components/FeaturesSection';
import MapSection from './_components/MapSection';
import SellerSection from '@/app/(main)/_components/SellerSection';

type Role = 'customer' | 'seller';

export default function CustomerMainPage() {
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

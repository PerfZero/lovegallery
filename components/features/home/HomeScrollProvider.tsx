"use client";

import { type ReactNode } from "react";

// Layout Components
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Section Components
import HeroSection from "@/components/sections/HeroSection";
import GalleryCarousel from "@/components/sections/GalleryCarousel";
import ContactSection from "@/components/sections/ContactSection";

// =============================================================================
// Home Scroll Provider Component
// =============================================================================

interface HomeScrollProviderProps {
  children?: ReactNode;
}

/**
 * Main page layout in regular document flow (no fixed scroll overlays).
 */
export const HomeScrollProvider = ({ children }: HomeScrollProviderProps) => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />

      <main className="relative">
        <div className="relative ">
          <HeroSection />
        </div>

        <div className="relative">
          <GalleryCarousel />
        </div>

        <ContactSection opacity={1} />
        <Footer />
      </main>

      {children}
    </div>
  );
};

export default HomeScrollProvider;

"use client";

import { useEffect, useState, type ReactNode } from "react";
import { homeContent, type HomeContentData } from "@/data/home-content";
import { cloneHomeContent, isHomeContent } from "@/lib/home-content";

// Layout Components
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Section Components
import HeroSection from "@/components/sections/HeroSection";
import GalleryCarousel from "@/components/sections/GalleryCarousel";
import ContactSection from "@/components/sections/ContactSection";
import AnimatedTextOverlay from "@/components/sections/AnimatedTextOverlay";

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
  const [content, setContent] = useState<HomeContentData>(() =>
    cloneHomeContent(homeContent),
  );

  useEffect(() => {
    let mounted = true;
    fetch("/api/home-content", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        if (!isHomeContent(data?.item)) return;
        setContent(cloneHomeContent(data.item));
      })
      .catch(() => {
        // keep defaults when API is unavailable
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />

      <main className="relative">
        <AnimatedTextOverlay
          line1={content.animatedOverlay.line1}
          line2={content.animatedOverlay.line2}
        />

        <div className="relative ">
          <HeroSection content={content.hero} />
        </div>

        <div className="relative">
          <GalleryCarousel />
        </div>

        <ContactSection opacity={1} content={content.contact} />
        <Footer />
      </main>

      {children}
    </div>
  );
};

export default HomeScrollProvider;

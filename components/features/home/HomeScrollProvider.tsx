"use client";

import { type ReactNode } from "react";
import { useScrollEffects } from "@/hooks";
import { Z_INDEX } from "@/lib/constants";

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
 * Main page layout with scroll-based parallax effects
 * Refactored for cleaner structure and consistent Z-index management.
 */
export const HomeScrollProvider = ({ children }: HomeScrollProviderProps) => {
    const { heroOpacity, contactOpacity, blurAmount } = useScrollEffects();

    return (
        <div className="min-h-[220vh] bg-background overflow-x-hidden">
            {/* 2. Persistent Navigation Layer */}
            <Header />

            <main className="relative">
                {/* 3. Immersive Background Layer (Sticky/Fixed) */}
                <GalleryBackground blurAmount={blurAmount} />

                {/* 3.5 Animated Text Overlay (appears during card dealing) */}
                <AnimatedTextOverlay />

                {/* 4. Sequential Content Layers */}
                <div className="relative">
                    {/* Hero: Sticky Overlay */}
                    <div
                        className="fixed inset-0 pointer-events-none"
                        style={{ opacity: heroOpacity, zIndex: Z_INDEX.hero }}
                    >
                        <HeroSection />
                    </div>

                    {/* Content Pad to allow scrolling */}
                    <div className="h-screen pointer-events-none" aria-hidden="true" />

                    {/* Contact: Fades in as user scrolls through the padding */}
                    <ContactSection opacity={contactOpacity} />
                </div>

                {/* 5. Final Footer Layer */}
                <div className="relative" style={{ zIndex: Z_INDEX.footer }}>
                    <Footer />
                </div>
            </main>

            {children}
        </div>
    );
};

// =============================================================================
// Background Components
// =============================================================================

interface GalleryBackgroundProps {
    blurAmount: number;
}

/**
 * Centered fixed gallery background with dynamic blur
 */
const GalleryBackground = ({ blurAmount }: GalleryBackgroundProps) => (
    <div
        className="fixed inset-0 transition-opacity duration-700"
        style={{
            filter: `blur(${blurAmount}px)`,
            opacity: Math.max(0.3, 1 - blurAmount / 50), // Don't fade to 0 completely
            zIndex: 16,
            pointerEvents: 'auto'
        }}
    >
        <div className="h-full w-full flex flex-col justify-end">
            <GalleryCarousel />
        </div>
    </div>
);

export default HomeScrollProvider;

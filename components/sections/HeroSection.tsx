"use client";

import { homeContent, type HomeHeroContent } from "@/data/home-content";
import {
  DSHeading,
  DSText,
  DSDecorativeAsterisk,
} from "@/components/ui/design-system";
import { ANIMATION } from "@/lib/constants";

// =============================================================================
// Hero Section Component
// =============================================================================

/**
 * Hero section with animated text reveal.
 * Optimized to balance large premium typography with vertical space to avoid overlap.
 */
interface HeroSectionProps {
  content?: HomeHeroContent;
}

const HeroSection = ({ content = homeContent.hero }: HeroSectionProps) => {
  const { tagline, description } = content;
  const adjectives = description.adjectives.filter(Boolean);

  return (
    <section className="h-full flex flex-col justify-start items-center px-6 md:px-12 lg:px-16 text-center pt-24 md:pt-32">
      <div className="max-w-4xl mx-auto w-full">
        {/* Unified Decorative Element */}
        <div
          className="mb-4 md:mb-6 opacity-0 animate-fade-in"
          style={{ animationDelay: `${ANIMATION.heroDelay}ms` }}
        >
          <DSDecorativeAsterisk />
        </div>

        {/* Main Content */}
        <div
          className="space-y-4 md:space-y-6 opacity-0 animate-fade-in"
          style={{ animationDelay: `${ANIMATION.heroContentDelay}ms` }}
        >
          {/* Intro Tagline */}
          <DSText
            size="base"
            className="italic font-display text-xl md:text-2xl leading-relaxed tracking-tight text-foreground/90"
          >
            {tagline.intro}
          </DSText>

          {/* Emphasized Headline */}
          <DSHeading
            level="h1"
            className="text-4xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight"
          >
            {tagline.emphasis}{" "}
            <span className="font-normal underline decoration-accent/20 underline-offset-8 italic whitespace-nowrap">
              {tagline.highlight}
            </span>
          </DSHeading>

          {/* Secondary Description */}
          <p className="font-display italic text-xl md:text-2xl leading-relaxed tracking-tight text-muted-foreground/90 max-w-2xl mx-auto">
            {description.main}
            <br className="hidden md:block" />
            {description.continuation}
            {adjectives.length > 0 && " "}
            {adjectives.map((adj, index) => (
              <span key={`${adj}-${index}`}>
                <span className="text-foreground underline decoration-accent/30 underline-offset-4">
                  {adj}
                </span>
                {index < adjectives.length - 1 && " и "}
              </span>
            ))}
            {adjectives.length > 0 && " "}
            {description.suffix}
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

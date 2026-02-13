"use client";

import { contactConfig } from "@/data/site-config";
import { homeContent, type HomeContactContent } from "@/data/home-content";
import { Z_INDEX } from "@/lib/constants";
import {
  DSHeading,
  DSLabel,
  DSDecorativeAsterisk,
} from "@/components/ui/design-system";

// =============================================================================
// Contact Section Component
// =============================================================================

interface ContactSectionProps {
  /** Opacity value for scroll-based fade effect (0-1) */
  opacity: number;
  content?: HomeContactContent;
}

/**
 * Contact CTA section refactored for the Design System.
 */
const ContactSection = ({
  opacity,
  content = homeContent.contact,
}: ContactSectionProps) => {
  const { headline, cta } = content;

  return (
    <div
      className="relative flex flex-col"
      style={{
        opacity,
        zIndex: Z_INDEX.contact,
      }}
    >
      <section className="flex-grow flex flex-col justify-end items-center text-center px-6  bg-background/80 backdrop-blur-md p-10">
        <div className="max-w-4xl mx-auto space-y-12 md:space-y-16">
          {/* Decorative Element */}
          <div className="flex flex-col items-center gap-4">
            <DSDecorativeAsterisk />
            <DSLabel className="text-accent">{cta.label}</DSLabel>
          </div>

          {/* Headline */}
          <DSHeading
            level="h2"
            className="text-3xl md:text-5xl lg:text-6xl leading-tight"
          >
            {headline.line1}
            <br />
            <span className="text-foreground/60 opacity-80">
              {headline.line2}
            </span>
          </DSHeading>

          {/* Email CTA */}
          <div className="pt-8 space-y-6">
            <a
              href={`mailto:${contactConfig.email}`}
              className="group relative inline-block text-2xl md:text-4xl lg:text-5xl font-display italic transition-all duration-500"
            >
              <span className="relative z-10 transition-colors group-hover:text-accent">
                {contactConfig.email}
              </span>
              <span className="absolute bottom-0 left-0 w-full h-px bg-foreground/10 group-hover:bg-accent transition-all duration-500 scale-x-100 group-hover:scale-x-110" />
            </a>

            <div className="flex justify-center gap-12 pt-8">
              <DSLabel
                as="a"
                href={contactConfig.instagram}
                className="hover:text-accent transition-colors"
              >
                Instagram
              </DSLabel>
              <DSLabel
                as="a"
                href={contactConfig.telegram}
                className="hover:text-accent transition-colors"
              >
                Telegram
              </DSLabel>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactSection;

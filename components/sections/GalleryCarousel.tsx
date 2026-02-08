"use client";

import { useMemo, forwardRef } from "react";
import Link from "next/link";
import { artworks, type Artwork, categoryThemes } from "@/data/artworks";
import {
  galleryImagesData,
  type ResponsiveSize,
  type ZIndexLevel,
  type RoundedVariant,
} from "@/data/gallery-images";
import { useGalleryAnimation, useIsMobile } from "@/hooks";

// =============================================================================
// Gallery Carousel Component
// =============================================================================

/**
 * Carousel image with artwork link data
 */
interface CarouselItem {
  artwork: Artwork;
  href: string;
  categoryLabel: string;
  // Styling from gallery images
  widthPx: ResponsiveSize;
  heightPx: ResponsiveSize;
  marginTopPx: ResponsiveSize;
  marginLeftPx: ResponsiveSize;
  zIndex: ZIndexLevel;
  rounded: RoundedVariant;
}

/**
 * Infinite marquee gallery with card-dealing entrance animation
 * Features:
 * - Cards link to product pages
 * - Infinite horizontal scroll with marquee effect
 * - Hover pause and zoom effects
 */
const GalleryCarousel = () => {
  // Build carousel items from artworks, cycling through layout styles
  const carouselItems = useMemo(() => {
    return artworks.map((artwork, index) => {
      const layoutStyle = galleryImagesData[index % galleryImagesData.length];
      return {
        artwork,
        href: `/catalog/${artwork.category}/${artwork.id}`,
        categoryLabel:
          categoryThemes[artwork.category]?.title || artwork.category,
        widthPx: layoutStyle.width,
        heightPx: layoutStyle.height,
        marginTopPx: layoutStyle.marginTop,
        marginLeftPx: layoutStyle.marginLeft,
        zIndex: layoutStyle.zIndex,
        rounded: layoutStyle.rounded,
      } as CarouselItem;
    });
  }, []);

  // Triple items for seamless infinite scroll
  const marqueeItems = useMemo(
    () => [...carouselItems, ...carouselItems, ...carouselItems],
    [carouselItems],
  );

  const isMobile = useIsMobile();

  // Use custom hook for complex entrance animation logic
  const { imageRefs, isPreloading } = useGalleryAnimation({ isMobile });

  const marqueeClassName = isMobile
    ? "flex gap-0 whitespace-nowrap justify-center min-w-full"
    : `flex gap-0 animate-marquee whitespace-nowrap hover:[animation-play-state:paused] ${isPreloading ? "paused" : ""}`;

  return (
    <section
      className={`h-[40vh] md:h-[50vh] flex items-start select-none pb-4 md:pb-6 w-full transition-all duration-700 pointer-events-auto ${isPreloading ? "overflow-visible" : "overflow-x-auto md:overflow-hidden"} touch-pan-x overscroll-x-contain snap-x snap-mandatory`}
    >
      <div className="relative flex w-full">
        <div className={marqueeClassName}>
          {marqueeItems.map((item, index) => (
            <GalleryCard
              key={`${item.artwork.id}-${index}`}
              item={item}
              isMobile={isMobile}
              ref={(el) => {
                imageRefs.current[index] = el;
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// =============================================================================
// Gallery Card Component
// =============================================================================

const ROUNDED_CLASSES: Record<RoundedVariant, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
};

interface GalleryCardProps {
  item: CarouselItem;
  isMobile: boolean;
}

const GalleryCard = forwardRef<HTMLDivElement, GalleryCardProps>(
  ({ item, isMobile }, ref) => {
    const {
      artwork,
      href,
      categoryLabel,
      widthPx,
      heightPx,
      marginTopPx,
      marginLeftPx,
      zIndex,
      rounded,
    } = item;

    // Compute aspect ratio multiplier
    const ratioMultiplier =
      artwork.aspectRatio === "portrait"
        ? 1.33
        : artwork.aspectRatio === "landscape"
          ? 0.75
          : 1;

    // Define CSS variables for dynamic sizing based on actual artwork proportions
    const style = {
      "--w-mob": `${widthPx.mobile}px`,
      "--w-desk": `${widthPx.desktop}px`,
      "--h-mob": `${widthPx.mobile * ratioMultiplier}px`,
      "--h-desk": `${widthPx.desktop * ratioMultiplier}px`,
      "--mt-mob": `${marginTopPx.mobile}px`,
      "--mt-desk": `${marginTopPx.desktop}px`,
      "--ml-mob": `${marginLeftPx.mobile}px`,
      "--ml-desk": `${marginLeftPx.desktop}px`,
      zIndex: zIndex,
    } as React.CSSProperties;

    const roundedClass = ROUNDED_CLASSES[rounded];

    return (
      <div
        ref={ref}
        style={style}
        className={`inline-block transition-transform duration-700 hover:scale-[1.02] relative group mt-[var(--mt-mob)] md:mt-[var(--mt-desk)] ml-[var(--ml-mob)] md:ml-[var(--ml-desk)] will-change-transform z-${zIndex} ${isMobile ? "snap-start" : ""}`}
      >
        <Link href={href} className="block cursor-pointer">
          <div
            className={`w-[var(--w-mob)] md:w-[var(--w-desk)] h-[var(--h-mob)] md:h-[var(--h-desk)] overflow-hidden transition-all duration-700 shadow-xl ${roundedClass} relative`}
          >
            {/* Image or Video */}
            {artwork.videoSrc ? (
              <video
                src={artwork.videoSrc}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover transition-all duration-700 group-hover:blur-sm transform group-hover:scale-110"
              />
            ) : (
              <img
                src={artwork.image}
                alt={artwork.title}
                className="w-full h-full object-cover transition-all duration-700 group-hover:blur-sm transform group-hover:scale-110"
                loading="eager"
                draggable={false}
              />
            )}

            {/* Hover Overlay */}
            <GalleryCardOverlay
              title={artwork.title}
              category={categoryLabel}
              price={artwork.price}
            />
          </div>
        </Link>
      </div>
    );
  },
);

GalleryCard.displayName = "GalleryCard";

// =============================================================================
// Gallery Card Overlay Component
// =============================================================================

interface GalleryCardOverlayProps {
  title: string;
  category: string;
  price: string;
}

const GalleryCardOverlay = ({
  title,
  category,
  price,
}: GalleryCardOverlayProps) => (
  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/40 flex flex-col items-center justify-center text-center p-6 cursor-pointer">
    {/* Category Badge */}
    <div className="bg-accent/80 backdrop-blur-sm px-3 py-1 rounded-sm mb-3">
      <span className="text-[10px] uppercase tracking-[0.2em] font-body text-accent-foreground font-semibold">
        {category}
      </span>
    </div>

    {/* Title */}
    <h3 className="text-white font-display text-lg md:text-xl italic tracking-wide mb-2">
      {title}
    </h3>

    {/* Price */}
    <p className="text-white/80 text-xs md:text-sm font-body">{price}</p>

    {/* CTA Hint */}
    <div className="mt-4 text-white/60 text-[10px] uppercase tracking-widest">
      Подробнее →
    </div>
  </div>
);

export default GalleryCarousel;

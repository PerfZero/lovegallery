"use client";

import { useMemo, forwardRef, useEffect, useRef } from "react";
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

// Speed tuning (change these values)
const DESKTOP_LOOP_AUTO_SCROLL_PX_PER_SECOND = 40;
const MOBILE_LOOP_AUTO_SCROLL_PX_PER_SECOND = 50;
const MOBILE_LOOP_RESUME_DELAY_MS = 900;

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
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const userInteractingRef = useRef(false);
  const resumeTimeoutRef = useRef<number | null>(null);

  // Use custom hook for complex entrance animation logic
  const { imageRefs, isPreloading } = useGalleryAnimation({ isMobile });

  const marqueeClassName = "flex w-max gap-0 whitespace-nowrap min-w-full";

  useEffect(() => {
    if (isPreloading) return;

    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const autoPxPerSecond = isMobile
      ? MOBILE_LOOP_AUTO_SCROLL_PX_PER_SECOND
      : DESKTOP_LOOP_AUTO_SCROLL_PX_PER_SECOND;
    let rafId: number | null = null;
    let lastTimestamp = 0;
    let dragging = false;
    let dragStartX = 0;
    let dragStartScroll = 0;

    const getSegmentWidth = () => track.scrollWidth / 3;

    const normalizeLoopPosition = () => {
      const segmentWidth = getSegmentWidth();
      if (!segmentWidth) return;

      const minEdge = segmentWidth * 0.5;
      const maxEdge = segmentWidth * 1.5;

      if (section.scrollLeft < minEdge) {
        section.scrollLeft += segmentWidth;
      } else if (section.scrollLeft > maxEdge) {
        section.scrollLeft -= segmentWidth;
      }
    };

    const pauseAuto = () => {
      userInteractingRef.current = true;
      if (resumeTimeoutRef.current !== null) {
        window.clearTimeout(resumeTimeoutRef.current);
      }
    };

    const resumeAutoSoon = () => {
      if (resumeTimeoutRef.current !== null) {
        window.clearTimeout(resumeTimeoutRef.current);
      }
      resumeTimeoutRef.current = window.setTimeout(() => {
        userInteractingRef.current = false;
      }, MOBILE_LOOP_RESUME_DELAY_MS);
    };

    const animate = (timestamp: number) => {
      if (lastTimestamp === 0) {
        lastTimestamp = timestamp;
      }
      const dt = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      if (!userInteractingRef.current) {
        section.scrollLeft += autoPxPerSecond * dt;
        normalizeLoopPosition();
      }

      rafId = window.requestAnimationFrame(animate);
    };

    // Start from middle copy to allow seamless left/right manual swipes.
    section.scrollLeft = getSegmentWidth();
    normalizeLoopPosition();

    const onTouchStart = () => pauseAuto();
    const onTouchEnd = () => resumeAutoSoon();
    const onMouseDown = (event: MouseEvent) => {
      dragging = true;
      dragStartX = event.clientX;
      dragStartScroll = section.scrollLeft;
      section.style.cursor = "grabbing";
      pauseAuto();
    };
    const onMouseMove = (event: MouseEvent) => {
      if (!dragging) return;
      const delta = event.clientX - dragStartX;
      section.scrollLeft = dragStartScroll - delta;
      normalizeLoopPosition();
    };
    const endMouseDrag = () => {
      if (!dragging) return;
      dragging = false;
      section.style.cursor = "";
      resumeAutoSoon();
    };
    const onScroll = () => normalizeLoopPosition();

    section.addEventListener("touchstart", onTouchStart, { passive: true });
    section.addEventListener("touchend", onTouchEnd, { passive: true });
    section.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", endMouseDrag);
    section.addEventListener("mouseleave", endMouseDrag);
    section.addEventListener("scroll", onScroll, { passive: true });

    rafId = window.requestAnimationFrame(animate);

    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
      if (resumeTimeoutRef.current !== null) {
        window.clearTimeout(resumeTimeoutRef.current);
        resumeTimeoutRef.current = null;
      }
      section.removeEventListener("touchstart", onTouchStart);
      section.removeEventListener("touchend", onTouchEnd);
      section.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", endMouseDrag);
      section.removeEventListener("mouseleave", endMouseDrag);
      section.removeEventListener("scroll", onScroll);
    };
  }, [isMobile, isPreloading, marqueeItems.length]);

  return (
    <section
      ref={sectionRef}
      style={{ overflowAnchor: "none" }}
      className={`h-[40vh] md:h-[50vh] flex items-start select-none pb-4 md:pb-6 w-full transition-all duration-700 pointer-events-auto ${isPreloading ? "overflow-visible" : "overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"} touch-pan-x overscroll-x-contain snap-none md:cursor-grab`}
    >
      <div className="relative flex w-full">
        <div
          ref={trackRef}
          className={`${marqueeClassName} will-change-transform`}
        >
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
        className={`inline-block shrink-0 transition-transform duration-700 hover:scale-[1.02] relative group mt-[var(--mt-mob)] md:mt-[var(--mt-desk)] ml-[var(--ml-mob)] md:ml-[var(--ml-desk)] will-change-transform z-${zIndex} ${isMobile ? "snap-start" : ""}`}
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

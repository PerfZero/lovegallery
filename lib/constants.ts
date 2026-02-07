// =============================================================================
// Application Constants
// =============================================================================

/**
 * Animation durations (in milliseconds)
 */
export const ANIMATION = {
    /** Quick interactions like hover states */
    fast: 150,
    /** Standard transitions */
    normal: 300,
    /** Smooth page transitions */
    slow: 500,
    /** Gallery card dealing animation */
    cardDeal: 300,
    /** Hero fade-in delay */
    heroDelay: 4200,
    /** Hero content animation delay */
    heroContentDelay: 4500,
    /** Gallery fly-to-destination delay */
    galleryFlyDelay: 6600,
} as const;

/**
 * Scroll thresholds for parallax effects
 */
export const SCROLL_THRESHOLDS = {
    /** When hero starts fading */
    heroFadeStart: 0,
    /** When hero is fully faded */
    heroFadeEnd: 0.8,
    /** When contact section starts appearing */
    contactFadeStart: 0.5,
    /** Maximum blur amount in pixels */
    maxBlur: 20,
} as const;

/**
 * Z-index layers for consistent stacking
 */
export const Z_INDEX = {
    background: 0,
    gallery: 0,
    hero: 10,
    contact: 20,
    footer: 30,
    header: 50,
    cursor: 9999,
} as const;

/**
 * Layout spacing constants (in pixels)
 */
export const SPACING = {
    /** Horizontal padding on mobile */
    pagePaddingMobile: 24,
    /** Horizontal padding on tablet */
    pagePaddingTablet: 48,
    /** Horizontal padding on desktop */
    pagePaddingDesktop: 64,
    /** Header height */
    headerHeight: 64,
} as const;

/**
 * Custom cursor configuration
 */
export const CURSOR = {
    /** Base size in pixels */
    size: 10,
    /** Scale factor on hover */
    hoverScale: 2,
    /** Elements that trigger hover state */
    hoverableSelectors: 'a, button, [role="button"], [data-cursor-hover], input, textarea, select',
} as const;

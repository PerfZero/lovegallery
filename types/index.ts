// =============================================================================
// Global Type Definitions
// =============================================================================

/**
 * Navigation item for site menu
 */
export interface NavigationItem {
    name: string;
    href: string;
}

/**
 * Contact information structure
 */
export interface ContactInfo {
    email: string;
    phone: string;
    instagram: string;
    telegram: string;
    whatsapp: string;
}

/**
 * Social media link configuration
 */
export interface SocialLink {
    name: string;
    href: string;
    label: string;
}

/**
 * Footer column configuration
 */
export interface FooterColumn {
    title: string;
    links: FooterLink[];
}

export interface FooterLink {
    label: string;
    href: string;
}

/**
 * Animation timing configuration
 */
export interface AnimationTiming {
    duration: number;
    delay: number;
    easing: string;
}

/**
 * Scroll-based opacity and blur values
 */
export interface ScrollEffects {
    heroOpacity: number;
    contactOpacity: number;
    blurAmount: number;
}

/**
 * Breakpoint constants
 */
export const BREAKPOINTS = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
} as const;

export type BreakpointKey = keyof typeof BREAKPOINTS;

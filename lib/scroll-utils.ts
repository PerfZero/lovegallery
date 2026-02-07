// =============================================================================
// Scroll Utility Functions
// =============================================================================

import { SCROLL_THRESHOLDS } from './constants';
import type { ScrollEffects } from '@/types';

/**
 * Calculate scroll progress as a ratio of viewport height
 * @param scrollY - Current scroll position in pixels
 * @param viewportHeight - Viewport height in pixels
 * @returns Scroll progress ratio (0 = top, 1 = one viewport scrolled)
 */
export function getScrollProgress(scrollY: number, viewportHeight: number): number {
    if (viewportHeight === 0) return 0;
    return scrollY / viewportHeight;
}

/**
 * Calculate all scroll-based visual effects
 * @param scrollProgress - Scroll progress ratio
 * @returns Object containing opacity and blur values
 */
export function calculateScrollEffects(scrollProgress: number): ScrollEffects {
    const { heroFadeEnd, contactFadeStart, maxBlur } = SCROLL_THRESHOLDS;

    // Hero fades out as user scrolls
    const heroOpacity = Math.max(0, 1 - scrollProgress / heroFadeEnd);

    // Contact section fades in after halfway point
    const contactOpacity = Math.max(0, Math.min(1, (scrollProgress - contactFadeStart) * 2));

    // Background blur increases as contact appears
    const blurAmount = Math.min(maxBlur, Math.max(0, (scrollProgress - contactFadeStart) * maxBlur));

    return {
        heroOpacity,
        contactOpacity,
        blurAmount,
    };
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
}

/**
 * Linear interpolation between two values
 */
export function lerp(start: number, end: number, progress: number): number {
    return start + (end - start) * clamp(progress, 0, 1);
}

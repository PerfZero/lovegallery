'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { getScrollProgress, calculateScrollEffects } from '@/lib/scroll-utils';
import type { ScrollEffects } from '@/types';

// =============================================================================
// useScrollProgress - Track scroll position
// =============================================================================

/**
 * Track scroll progress as a ratio of viewport height
 * @returns Scroll progress ratio (0 = top, 1 = one viewport scrolled)
 */
export function useScrollProgress(): number {
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const progress = getScrollProgress(window.scrollY, window.innerHeight);
            setScrollProgress(progress);
        };

        // Set initial value
        handleScroll();

        // Passive listener for better performance
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return scrollProgress;
}

// =============================================================================
// useScrollEffects - Calculate visual effects based on scroll
// =============================================================================

/**
 * Calculate all scroll-based visual effects
 * @returns Object containing opacity and blur values
 */
export function useScrollEffects(): ScrollEffects {
    const scrollProgress = useScrollProgress();
    return calculateScrollEffects(scrollProgress);
}

// =============================================================================
// useScrollDirection - Detect scroll direction
// =============================================================================

type ScrollDirection = 'up' | 'down' | null;

/**
 * Detect current scroll direction
 * @returns 'up', 'down', or null if not scrolled yet
 */
export function useScrollDirection(): ScrollDirection {
    const [direction, setDirection] = useState<ScrollDirection>(null);
    const lastScrollY = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY.current) {
                setDirection('down');
            } else if (currentScrollY < lastScrollY.current) {
                setDirection('up');
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return direction;
}

// =============================================================================
// useScrollLock - Lock/unlock body scroll
// =============================================================================

/**
 * Lock body scroll (useful for modals)
 * @returns Tuple of [isLocked, lock(), unlock()]
 */
export function useScrollLock(): [boolean, () => void, () => void] {
    const [isLocked, setIsLocked] = useState(false);

    const lock = useCallback(() => {
        document.body.style.overflow = 'hidden';
        setIsLocked(true);
    }, []);

    const unlock = useCallback(() => {
        document.body.style.overflow = '';
        setIsLocked(false);
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    return [isLocked, lock, unlock];
}

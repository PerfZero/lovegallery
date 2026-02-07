'use client';

import { useState, useEffect, useCallback } from 'react';
import { BREAKPOINTS, type BreakpointKey } from '@/types';

// =============================================================================
// useMediaQuery - Base hook for media queries
// =============================================================================

/**
 * Subscribe to a media query and return whether it matches
 * @param query - CSS media query string
 * @returns boolean indicating if the query matches
 */
export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia(query);

        // Set initial value
        setMatches(mediaQuery.matches);

        // Create event listener
        const handler = (event: MediaQueryListEvent) => {
            setMatches(event.matches);
        };

        // Add listener
        mediaQuery.addEventListener('change', handler);

        // Cleanup
        return () => mediaQuery.removeEventListener('change', handler);
    }, [query]);

    return matches;
}

// =============================================================================
// useBreakpoint - Check specific breakpoints
// =============================================================================

/**
 * Check if viewport is at or above a specific breakpoint
 * @param breakpoint - Breakpoint key to check
 * @returns boolean indicating if viewport meets the breakpoint
 */
export function useBreakpoint(breakpoint: BreakpointKey): boolean {
    const width = BREAKPOINTS[breakpoint];
    return useMediaQuery(`(min-width: ${width}px)`);
}

/**
 * Check if viewport is below a specific breakpoint
 * @param breakpoint - Breakpoint key to check
 * @returns boolean indicating if viewport is below the breakpoint
 */
export function useBreakpointBelow(breakpoint: BreakpointKey): boolean {
    const width = BREAKPOINTS[breakpoint];
    return useMediaQuery(`(max-width: ${width - 1}px)`);
}

// =============================================================================
// useIsMobile - Convenience hook for mobile detection
// =============================================================================

/**
 * Check if the current viewport is mobile-sized
 * @returns boolean indicating mobile viewport
 */
export function useIsMobile(): boolean {
    return useBreakpointBelow('md');
}

/**
 * Check if the current viewport is tablet-sized
 * @returns boolean indicating tablet viewport
 */
export function useIsTablet(): boolean {
    const aboveMd = useBreakpoint('md');
    const belowLg = useBreakpointBelow('lg');
    return aboveMd && belowLg;
}

/**
 * Check if the current viewport is desktop-sized
 * @returns boolean indicating desktop viewport
 */
export function useIsDesktop(): boolean {
    return useBreakpoint('lg');
}

// =============================================================================
// useWindowSize - Get window dimensions
// =============================================================================

interface WindowSize {
    width: number;
    height: number;
}

/**
 * Get current window dimensions with resize handling
 * @returns Object with width and height
 */
export function useWindowSize(): WindowSize {
    const [size, setSize] = useState<WindowSize>({
        width: 0,
        height: 0,
    });

    useEffect(() => {
        const updateSize = () => {
            setSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        // Set initial size
        updateSize();

        // Add resize listener
        window.addEventListener('resize', updateSize);

        return () => window.removeEventListener('resize', updateSize);
    }, []);

    return size;
}

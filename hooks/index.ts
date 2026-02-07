// =============================================================================
// Hooks Index - Export all custom hooks
// =============================================================================

// Media query and responsive hooks
export {
    useMediaQuery,
    useBreakpoint,
    useBreakpointBelow,
    useIsMobile,
    useIsTablet,
    useIsDesktop,
    useWindowSize,
} from './use-media-query';

// Scroll-related hooks
export * from "./use-scroll";
export * from "./use-gallery-animation";

// Toast notifications (existing)
export { useToast, toast } from './use-toast';

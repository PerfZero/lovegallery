// =============================================================================
// Gallery Images Data
// =============================================================================

/**
 * Rounded corner style variants
 */
export type RoundedVariant = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

/**
 * Z-index layer levels for stacking
 */
export type ZIndexLevel = 0 | 10 | 15 | 20 | 30 | 40 | 50;

/**
 * Responsive size configuration (mobile and desktop values)
 */
export interface ResponsiveSize {
    mobile: number;
    desktop: number;
}

/**
 * Data-only representation of a gallery image
 * Styling is computed via utility functions
 */
export interface GalleryImageData {
    /** Image source path */
    src: string;
    /** Display title */
    title: string;
    /** Category label */
    category: string;
    /** Width in pixels (responsive) */
    width: ResponsiveSize;
    /** Height in pixels (responsive) */
    height: ResponsiveSize;
    /** Top margin in pixels (responsive, use 0 for none) */
    marginTop: ResponsiveSize;
    /** Left margin in pixels (negative for overlap) */
    marginLeft: ResponsiveSize;
    /** Z-index for stacking order */
    zIndex: ZIndexLevel;
    /** Border radius style */
    rounded: RoundedVariant;
}

// -----------------------------------------------------------------------------
// Style Utility Functions
// -----------------------------------------------------------------------------

const ROUNDED_CLASSES: Record<RoundedVariant, string> = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
};

/**
 * Generate responsive Tailwind class for a dimension
 */
function responsiveClass(
    prefix: string,
    { mobile, desktop }: ResponsiveSize
): string {
    if (mobile === desktop) {
        return `${prefix}-[${mobile}px]`;
    }
    return `${prefix}-[${mobile}px] md:${prefix}-[${desktop}px]`;
}

/**
 * Convert GalleryImageData to computed Tailwind classes
 */
export function getImageStyles(image: GalleryImageData) {
    return {
        width: responsiveClass('w', image.width),
        height: responsiveClass('h', image.height),
        mt: responsiveClass('mt', image.marginTop),
        ml: responsiveClass('ml', image.marginLeft),
        z: `z-${image.zIndex}`,
        rounded: ROUNDED_CLASSES[image.rounded],
    };
}

/**
 * CSS Style object for inline styling (works with CSS-in-JS)
 */
export interface GalleryImageStyle {
    width: ResponsiveSize;
    height: ResponsiveSize;
    marginTop: ResponsiveSize;
    marginLeft: ResponsiveSize;
    zIndex: ZIndexLevel;
    rounded: RoundedVariant;
}

/**
 * Gallery image with both class names and raw values
 */
export interface GalleryImage {
    src: string;
    title: string;
    category: string;
    // Tailwind classes (may not work with dynamic values)
    width: string;
    height: string;
    mt: string;
    z: string;
    ml: string;
    rounded: string;
    // Raw pixel values for inline styles
    widthPx: ResponsiveSize;
    heightPx: ResponsiveSize;
    marginTopPx: ResponsiveSize;
    marginLeftPx: ResponsiveSize;
}

// -----------------------------------------------------------------------------
// Gallery Images Raw Data
// -----------------------------------------------------------------------------

export const galleryImagesData: GalleryImageData[] = [
    {
        src: '/images/gallery-1.webp',
        title: 'Minimalist Loft',
        category: 'Interior Design',
        width: { mobile: 180, desktop: 300 },
        height: { mobile: 260, desktop: 400 },
        marginTop: { mobile: 20, desktop: 60 },
        marginLeft: { mobile: 0, desktop: 0 },
        zIndex: 10,
        rounded: 'none',
    },
    {
        src: '/images/gallery-2.webp',
        title: 'Urban Oasis',
        category: 'Architecture',
        width: { mobile: 200, desktop: 340 },
        height: { mobile: 220, desktop: 360 },
        marginTop: { mobile: 0, desktop: 0 },
        marginLeft: { mobile: -65, desktop: -50 },
        zIndex: 20,
        rounded: 'xl',
    },
    {
        src: '/images/gallery-3.webp',
        title: 'Light Studio',
        category: 'Lighting',
        width: { mobile: 160, desktop: 270 },
        height: { mobile: 200, desktop: 320 },
        marginTop: { mobile: 40, desktop: 120 },
        marginLeft: { mobile: -60, desktop: -50 },
        zIndex: 0,
        rounded: 'none',
    },
    {
        src: '/images/gallery-4.webp',
        title: 'Texture Detail',
        category: 'Materials',
        width: { mobile: 180, desktop: 300 },
        height: { mobile: 160, desktop: 270 },
        marginTop: { mobile: 10, desktop: 30 },
        marginLeft: { mobile: -55, desktop: -45 },
        zIndex: 30,
        rounded: 'xl',
    },
    {
        src: '/images/gallery-5.webp',
        title: 'Organic Flow',
        category: 'Space Design',
        width: { mobile: 200, desktop: 320 },
        height: { mobile: 240, desktop: 380 },
        marginTop: { mobile: 30, desktop: 90 },
        marginLeft: { mobile: -70, desktop: -60 },
        zIndex: 20,
        rounded: 'xl',
    },
    {
        src: '/images/gallery-6.webp',
        title: 'Modern Villa',
        category: 'Exterior',
        width: { mobile: 170, desktop: 290 },
        height: { mobile: 220, desktop: 340 },
        marginTop: { mobile: 0, desktop: 0 },
        marginLeft: { mobile: -60, desktop: -50 },
        zIndex: 10,
        rounded: 'none',
    },
    {
        src: '/images/gallery-7.webp',
        title: 'Warm Textures',
        category: 'Materials',
        width: { mobile: 190, desktop: 310 },
        height: { mobile: 260, desktop: 400 },
        marginTop: { mobile: 15, desktop: 50 },
        marginLeft: { mobile: -55, desktop: -45 },
        zIndex: 15,
        rounded: 'none',
    },
];

// -----------------------------------------------------------------------------
// Export pre-computed gallery images for backwards compatibility
// -----------------------------------------------------------------------------

export const galleryImages: GalleryImage[] = galleryImagesData.map((image) => ({
    src: image.src,
    title: image.title,
    category: image.category,
    ...getImageStyles(image),
    widthPx: image.width,
    heightPx: image.height,
    marginTopPx: image.marginTop,
    marginLeftPx: image.marginLeft,
}));

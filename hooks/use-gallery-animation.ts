import { useRef, useState, useCallback, useEffect, type MutableRefObject } from "react";
import { ANIMATION } from "@/lib/constants";

interface UseGalleryAnimationProps {
    isMobile: boolean;
}

interface UseGalleryAnimationReturn {
    imageRefs: MutableRefObject<(HTMLDivElement | null)[]>;
    isPreloading: boolean;
}

/**
 * Hook managing the complex entrance animation for the gallery
 * Handles the "card dealing" effect where images fly from a pile to their positions
 */
export const useGalleryAnimation = ({ isMobile }: UseGalleryAnimationProps): UseGalleryAnimationReturn => {
    const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [isPreloading, setIsPreloading] = useState(true);
    const hasAnimatedRef = useRef(false);

    /**
     * Measure where each card should end up on the screen
     */
    const measureFinalPositions = useCallback(() => {
        return imageRefs.current.map(img => {
            if (!img) return { left: 0, top: 0 };
            const rect = img.getBoundingClientRect();
            return { left: rect.left, top: rect.top };
        });
    }, []);

    /**
     * Position cards in a scattered pile at the bottom-center
     */
    const setInitialPileState = useCallback(async (
        positions: { left: number; top: number }[]
    ) => {
        imageRefs.current.forEach((img, index) => {
            if (!img) return;

            // Random scatter values (reduced for tighter pile, especially on mobile)
            const scatterBase = isMobile ? 1 : 20;
            const rotateBase = isMobile ? 2 : 10;
            const randomX = (Math.random() - 0.5) * scatterBase;
            const randomY = (Math.random() - 0.5) * scatterBase;
            const randomRotate = (Math.random() - 0.5) * rotateBase;

            // Target pile position (perfectly centered horizontally, lower vertically)
            // Using actual element dimensions for precise centering logic
            const targetX = (window.innerWidth / 2) - (img.offsetWidth / 2) + randomX;
            // Vertical position: 75% of screen height
            const targetY = (window.innerHeight * 0.75) - (img.offsetHeight / 2) + randomY;

            // Calculate delta from final position
            const deltaX = targetX - positions[index].left;
            const deltaY = targetY - positions[index].top;

            // Apply initial state (hidden in the pile)
            // Mobile: slightly smaller initial scale for better fit
            const initialScale = isMobile ? 0.6 : 0.7;

            img.style.transition = 'none';
            img.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${initialScale}) rotate(${randomRotate}deg)`;
            img.style.opacity = '0';
        });

        // Force reflow to ensure styles are applied before transition starts
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        document.body.offsetHeight;
    }, [isMobile]);

    /**
     * Stagger reveal cards in the pile (fade in opacity)
     */
    const revealCards = useCallback(async () => {
        await new Promise(r => setTimeout(r, 100));

        imageRefs.current.forEach((img, i) => {
            if (img) {
                setTimeout(() => {
                    img.style.opacity = '1';
                }, i * ANIMATION.cardDeal);
            }
        });
    }, []);

    /**
     * Animate cards flying from the pile to their final marquee positions
     */
    const flyToDestinations = useCallback(async () => {
        await new Promise(r => setTimeout(r, ANIMATION.galleryFlyDelay));

        imageRefs.current.forEach((img, index) => {
            if (!img) return;

            setTimeout(() => {
                img.style.transition = 'transform 4.2s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 1.5s ease-out';
                img.style.transform = 'translate(0, 0) scale(1)';
            }, index * 90);
        });
    }, []);

    /**
     * Main orchestration function
     */
    const animateEntrance = useCallback(async () => {
        // Prevent double animation in strict mode or re-renders
        if (hasAnimatedRef.current) return;
        hasAnimatedRef.current = true;

        const positions = measureFinalPositions();
        await setInitialPileState(positions);
        await revealCards();
        await flyToDestinations();
        setIsPreloading(false);
    }, [measureFinalPositions, setInitialPileState, revealCards, flyToDestinations]);

    // Trigger animation on mount
    useEffect(() => {
        animateEntrance();
    }, [animateEntrance]);

    return {
        imageRefs,
        isPreloading
    };
};

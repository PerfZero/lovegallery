"use client";

import { useEffect, useState } from "react";

/**
 * Displays "ИСКУССТВО" and "ЭТО ПО ЛЮБВИ" with a letter-by-letter animation
 * during the card dealing animation. Appears briefly and then fades out.
 */
const AnimatedTextOverlay = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [showText, setShowText] = useState(true);

    // Fade out phase
    useEffect(() => {
        // Start fade out phase (disappear before Hero content at 4.2s)
        const fadeTimer = setTimeout(() => {
            setShowText(false);
        }, 3500);

        // Hide component completely after fade out completes
        const hideTimer = setTimeout(() => {
            setIsVisible(false);
        }, 4200);

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(hideTimer);
        };
    }, []);

    if (!isVisible) return null;

    return (
        <>
            <style jsx global>{`
                @keyframes letter-appear {
                    0% {
                        opacity: 0;
                        transform: translateY(20px) scale(0.8);
                        filter: blur(10px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                        filter: blur(0);
                    }
                }
                .animate-letter-appear {
                    animation: letter-appear 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
                }
            `}</style>
            <div
                className={`fixed inset-0 z-[15] flex flex-col items-center justify-start pt-[15vh] md:pt-[15vh] pointer-events-none transition-opacity duration-600 ${showText ? "opacity-100" : "opacity-0"
                    }`}
            >
                <div className="flex flex-col items-center gap-4 md:gap-8 max-w-[90vw]">
                    {/* Line 1: ИСКУССТВО */}
                    <AnimatedLine text="ИСКУССТВО" delay={0} />

                    {/* Line 2: ЭТО ПО ЛЮБВИ */}
                    <AnimatedLine text="ЭТО ПО ЛЮБВИ" delay={0} />
                </div>
            </div>
        </>
    );
};

// =============================================================================
// Animated Line Sub-Component
// =============================================================================

interface AnimatedLineProps {
    text: string;
    delay: number;
}

const AnimatedLine = ({ text, delay }: AnimatedLineProps) => {
    const letters = text.split("");

    return (
        <div className="relative inline-flex items-center justify-center">
            {/* Brush stroke background */}
            <img
                src="/images/brush-bg.webp"
                alt=""
                className="absolute inset-0 w-full h-full object-contain opacity-90 scale-x-125"
                style={{ zIndex: -1 }}
                aria-hidden="true"
            />

            {/* Letters container */}
            <div className="relative px-4 md:px-12 py-2 md:py-4 flex items-center justify-center flex-wrap">
                {letters.map((letter, index) => (
                    <span
                        key={index}
                        className="inline-block font-display text-4xl md:text-7xl lg:text-8xl font-bold text-[#8B2323] italic opacity-0 animate-letter-appear"
                        style={{
                            animationDelay: `${delay + index * 80}ms`,
                            animationFillMode: "forwards",
                        }}
                    >
                        {letter === " " ? "\u00A0" : letter}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default AnimatedTextOverlay;

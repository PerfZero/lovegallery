"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

// =============================================================================
// Scroll To Top Button
// =============================================================================

export const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 500) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    if (!isVisible) return null;

    return (
        <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-foreground text-background shadow-xl hover:bg-accent hover:text-foreground transition-all duration-300 flex items-center justify-center group"
            aria-label="Прокрутить наверх"
        >
            <ArrowUp
                size={20}
                className="group-hover:-translate-y-0.5 transition-transform"
            />
        </button>
    );
};

export default ScrollToTop;

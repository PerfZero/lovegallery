"use client";

import { createContext, useContext, useState, useEffect, useRef, ReactNode, useCallback } from 'react';
import { usePathname } from 'next/navigation';

type Rect = { x: number; y: number; w: number; h: number };

type TransitionState = {
    isActive: boolean;
    imageSrc: string;
    sharedId: string;
    fromRect: Rect;
};

const TransitionContext = createContext<{
    startTransition: (imageSrc: string, sharedId: string, element: HTMLElement, navigate: () => void) => void;
    registerTarget: (sharedId: string, element: HTMLElement) => void;
    isTransitioning: boolean;
} | null>(null);

export const usePageTransition = () => {
    const context = useContext(TransitionContext);
    if (!context) throw new Error('usePageTransition must be used within a TransitionProvider');
    return context;
};

export const TransitionProvider = ({ children }: { children: ReactNode }) => {
    const [transition, setTransition] = useState<TransitionState | null>(null);
    const [showContent, setShowContent] = useState(true);
    const cloneRef = useRef<HTMLImageElement | null>(null);
    const pathname = usePathname();
    const targetRegistry = useRef<Map<string, HTMLElement>>(new Map());

    // Reset on natural navigation (back button, etc.)
    useEffect(() => {
        if (!transition) {
            setShowContent(true);
        }
    }, [pathname, transition]);

    const registerTarget = useCallback((sharedId: string, element: HTMLElement) => {
        targetRegistry.current.set(sharedId, element);

        // If we have an active transition waiting for this target, complete it
        if (transition && transition.sharedId === sharedId && cloneRef.current) {
            const targetRect = element.getBoundingClientRect();
            const toRect: Rect = { x: targetRect.left, y: targetRect.top, w: targetRect.width, h: targetRect.height };

            // Keep the real target visible but transparent (clone will cover it)
            element.style.opacity = '0';

            // Animate clone from fromRect to toRect
            const clone = cloneRef.current;
            clone.style.transition = 'all 0.9s cubic-bezier(0.4, 0, 0.2, 1)';
            clone.style.left = `${toRect.x}px`;
            clone.style.top = `${toRect.y}px`;
            clone.style.width = `${toRect.w}px`;
            clone.style.height = `${toRect.h}px`;

            // After animation mostly completes, crossfade
            setTimeout(() => {
                // First, show real target (it's under the clone, so no flash)
                element.style.transition = 'opacity 0.3s ease-in-out';
                element.style.opacity = '1';

                // Fade out clone on top
                if (cloneRef.current) {
                    cloneRef.current.style.transition = 'opacity 0.3s ease-in-out';
                    cloneRef.current.style.opacity = '0';
                }

                // Show content
                setShowContent(true);

                // Remove clone after fade completes
                setTimeout(() => {
                    if (cloneRef.current) {
                        cloneRef.current.remove();
                        cloneRef.current = null;
                    }
                    setTransition(null);
                }, 350);
            }, 850);
        }
    }, [transition]);

    const startTransition = useCallback((imageSrc: string, sharedId: string, element: HTMLElement, navigate: () => void) => {
        // 1. Get source rect
        const rect = element.getBoundingClientRect();
        const fromRect: Rect = { x: rect.left, y: rect.top, w: rect.width, h: rect.height };

        // 2. Create clone
        const clone = document.createElement('img');
        clone.src = imageSrc;
        clone.className = 'shared-clone';
        clone.style.cssText = `
            position: fixed;
            left: ${fromRect.x}px;
            top: ${fromRect.y}px;
            width: ${fromRect.w}px;
            height: ${fromRect.h}px;
            margin: 0;
            z-index: 9999;
            object-fit: cover;
            pointer-events: none;
            will-change: transform, width, height, left, top;
        `;
        document.body.appendChild(clone);
        cloneRef.current = clone;

        // 3. Store transition state
        setTransition({ isActive: true, imageSrc, sharedId, fromRect });

        // 4. Fade out current page content
        setShowContent(false);

        // 5. Navigate after a brief moment for fade to start
        setTimeout(() => {
            navigate();
        }, 150);
    }, []);

    return (
        <TransitionContext.Provider value={{ startTransition, registerTarget, isTransitioning: !!transition }}>
            {/* Fade wrapper for page content */}
            <div
                style={{
                    opacity: showContent ? 1 : 0,
                    transition: 'opacity 0.4s ease-out',
                    minHeight: '100vh',
                }}
            >
                {children}
            </div>
        </TransitionContext.Provider>
    );
};

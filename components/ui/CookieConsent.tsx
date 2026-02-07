"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Cookie } from "lucide-react";
import Link from "next/link";

const COOKIE_CONSENT_KEY = "cookie-consent-accepted";

export function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has already accepted cookies
        const hasAccepted = localStorage.getItem(COOKIE_CONSENT_KEY);
        if (!hasAccepted) {
            // Show banner after a short delay
            const timer = setTimeout(() => setIsVisible(true), 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    const acceptCookies = () => {
        localStorage.setItem(COOKIE_CONSENT_KEY, "true");
        setIsVisible(false);
    };

    const declineCookies = () => {
        localStorage.setItem(COOKIE_CONSENT_KEY, "false");
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6"
                >
                    <div className="max-w-4xl mx-auto bg-foreground text-background rounded-lg shadow-2xl overflow-hidden">
                        <div className="p-6 md:p-8">
                            <div className="flex items-start gap-4">
                                {/* Icon */}
                                <div className="hidden sm:flex w-12 h-12 bg-accent/20 rounded-full items-center justify-center shrink-0">
                                    <Cookie size={24} className="text-accent" />
                                </div>

                                {/* Content */}
                                <div className="flex-1 space-y-4">
                                    <div>
                                        <h3 className="font-display text-lg italic mb-2">
                                            Мы используем cookies
                                        </h3>
                                        <p className="text-sm text-background/70 leading-relaxed">
                                            Мы используем файлы cookie для улучшения работы сайта и анализа трафика.
                                            Продолжая использовать сайт, вы соглашаетесь с{" "}
                                            <Link
                                                href="/privacy"
                                                className="underline hover:text-accent transition-colors"
                                            >
                                                политикой конфиденциальности
                                            </Link>.
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-wrap gap-3">
                                        <button
                                            onClick={acceptCookies}
                                            className="px-6 py-3 bg-accent text-foreground text-[10px] uppercase tracking-[0.2em] font-semibold hover:bg-accent/90 transition-colors"
                                        >
                                            Принять все
                                        </button>
                                        <button
                                            onClick={declineCookies}
                                            className="px-6 py-3 border border-background/20 text-[10px] uppercase tracking-[0.2em] font-semibold hover:border-background/40 transition-colors"
                                        >
                                            Только необходимые
                                        </button>
                                    </div>
                                </div>

                                {/* Close Button */}
                                <button
                                    onClick={declineCookies}
                                    className="p-2 hover:bg-background/10 rounded-full transition-colors shrink-0"
                                    aria-label="Закрыть"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

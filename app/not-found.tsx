"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Search } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { DSContainer } from "@/components/ui/design-system";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Header />

            <main className="flex-1 flex items-center justify-center py-20">
                <DSContainer>
                    <div className="max-w-2xl mx-auto text-center">
                        {/* Animated 404 */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="mb-12"
                        >
                            <span className="text-[12rem] md:text-[16rem] font-display italic leading-none text-accent/20 select-none">
                                404
                            </span>
                        </motion.div>

                        {/* Content */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="space-y-6"
                        >
                            <h1 className="text-3xl md:text-4xl font-display italic">
                                Страница не найдена
                            </h1>

                            <p className="text-muted-foreground text-lg max-w-md mx-auto">
                                Возможно, страница была перемещена или удалена.
                                Попробуйте вернуться на главную или воспользуйтесь поиском.
                            </p>
                        </motion.div>

                        {/* Actions */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center mt-12"
                        >
                            <Link
                                href="/"
                                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-foreground text-background text-xs uppercase tracking-[0.2em] font-semibold hover:bg-accent hover:text-foreground transition-all"
                            >
                                <Home size={16} />
                                На главную
                            </Link>

                            <Link
                                href="/catalog"
                                className="inline-flex items-center justify-center gap-3 px-8 py-4 border border-border text-xs uppercase tracking-[0.2em] font-semibold hover:border-accent hover:text-accent transition-all"
                            >
                                <Search size={16} />
                                Каталог
                            </Link>
                        </motion.div>

                        {/* Decorative Links */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.7 }}
                            className="mt-16 pt-12 border-t border-border/20"
                        >
                            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-6">
                                Популярные разделы
                            </p>
                            <div className="flex flex-wrap justify-center gap-6">
                                {[
                                    { label: "О нас", href: "/about" },
                                    { label: "Картины", href: "/catalog/painting" },
                                    { label: "Фотография", href: "/catalog/photography" },
                                    { label: "Арт-инсайты", href: "/art-insights" },
                                ].map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="text-sm hover:text-accent transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </DSContainer>
            </main>

            <Footer />
        </div>
    );
}

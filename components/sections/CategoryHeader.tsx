"use client";

import { motion } from 'framer-motion';
import { DSHeading, DSText, DSContainer, DSDecorativeAsterisk } from '@/components/ui/design-system';
import { categoryThemes } from '@/data/artworks';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface CategoryHeaderProps {
    category: keyof typeof categoryThemes;
}

export const CategoryHeader = ({ category }: CategoryHeaderProps) => {
    const theme = categoryThemes[category];

    return (
        <section className="pt-40 pb-20 relative">
            <div className={cn(
                "flex flex-col items-center text-center max-w-4xl mx-auto px-6 relative",
                category === 'collections' && "md:items-start md:text-left md:max-w-5xl"
            )}>
                {/* Decorative Background Title for Collections */}
                {category === 'collections' && (
                    <div className="absolute top-0 left-0 -translate-y-12 md:-translate-y-24 -translate-x-8 md:-translate-x-12 pointer-events-none select-none overflow-hidden w-full h-[300px]">
                        <span className="text-[12rem] md:text-[18rem] font-display italic font-light text-foreground/[0.03] leading-none whitespace-nowrap">
                            {theme.title}
                        </span>
                    </div>
                )}

                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className={cn(
                        "mb-4",
                        category === 'collections' && "md:ml-24" // Offset smaller title
                    )}
                >
                    <span className="text-[10px] tracking-[0.4em] uppercase font-medium text-muted-foreground">
                        {theme.title}
                    </span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className={cn(
                        "space-y-8 relative z-10",
                        category === 'collections' && "md:ml-48 mt-4" // Increased distance to avoid overlap
                    )}
                >
                    <DSHeading
                        level="h1"
                        className={cn(
                            "text-3xl md:text-5xl lg:text-5xl tracking-widest uppercase font-light leading-tight",
                            category === 'collections' && "max-w-2xl"
                        )}
                    >
                        {theme.subtitle}
                    </DSHeading>

                    <DSDecorativeAsterisk className={cn("mx-auto opacity-20", category === 'collections' && "md:mx-0")} />
                </motion.div>
            </div>

            <div className="mt-12 border-y border-border/10 py-12 relative z-30">
                <DSContainer>
                    <div className={cn(
                        "flex justify-center flex-wrap gap-y-12 gap-x-8 md:gap-x-24 text-[9px] tracking-[0.3em] uppercase font-semibold text-muted-foreground",
                        category === 'collections' && "max-w-5xl mx-auto"
                    )}>
                        {theme.subnav.map((item, index) => {
                            const label = typeof item === 'string' ? item : item.label;
                            const href = typeof item === 'string' ? null : item.href;

                            const content = (
                                <>
                                    {label}
                                    <span className={`absolute -bottom-1 left-0 w-full h-px bg-foreground transition-transform origin-left ${index === 0 && category !== 'collections' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
                                </>
                            );

                            // Artistically staggered layout for collections
                            const isCollections = category === 'collections';
                            const className = cn(
                                "hover:text-foreground transition-colors relative group py-2",
                                !isCollections && index === 0 ? 'text-foreground' : '',
                                isCollections && "text-[7.5px] tracking-[0.45em] font-medium",
                                isCollections && index % 2 !== 0 ? "md:translate-y-12" : "md:-translate-y-2",
                                isCollections && (index % 4 === 1 || index % 4 === 2) ? "md:px-8" : ""
                            );

                            if (href) {
                                return (
                                    <Link key={label} href={href} className={className}>
                                        {content}
                                    </Link>
                                );
                            }

                            return (
                                <button key={label} className={className}>
                                    {content}
                                </button>
                            );
                        })}
                    </div>
                </DSContainer>
            </div>

            {/* Ambient Background */}
            <div className={`absolute inset-0 bg-gradient-to-b ${theme.accentColor} -z-10`} />

            {/* Collections Background Video */}
            {category === 'collections' && (
                <div className="absolute inset-0 -z-20 overflow-hidden">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover opacity-40"
                    >
                        <source src="/videos/colection.mp4" type="video/mp4" />
                    </video>
                    {/* Extra overlay for depth and readability */}
                    <div className="absolute inset-0 bg-background/20 backdrop-blur-[2px]" />
                </div>
            )}
        </section>
    );
};

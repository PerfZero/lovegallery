"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { type Artwork } from '@/data/artworks';
import { DSLabel } from '@/components/ui/design-system';

interface ArtCardProps {
    artwork: Artwork;
    index: number;
}

export const ArtCard = ({ artwork, index }: ArtCardProps) => {
    const href = `/catalog/${artwork.category}/${artwork.id}`;

    return (
        <Link href={href}>
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 * (index % 4) }}
                className="group cursor-pointer"
            >
                <div className={`relative overflow-hidden transition-all duration-700 ${artwork.aspectRatio === 'portrait' ? 'aspect-[3/4]' :
                    artwork.aspectRatio === 'square' ? 'aspect-square' : 'aspect-[4/3]'
                    }`}>

                    {/* Image or Video Container */}
                    <div className="absolute inset-0 transition-all duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)]">
                        <div className="relative w-full h-full transition-all duration-700 overflow-hidden">
                            {artwork.videoSrc ? (
                                <video
                                    src={artwork.videoSrc}
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    className="w-full h-full object-cover grayscale-[0.1] group-hover:grayscale-0 transition-all duration-1000 ease-out group-hover:scale-110"
                                />
                            ) : (
                                <Image
                                    data-shared={`artwork-${artwork.id}`}
                                    src={artwork.image}
                                    alt={artwork.title}
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    className="object-cover grayscale-[0.1] group-hover:grayscale-0 transition-all duration-1000 ease-out group-hover:scale-110"
                                />
                            )}
                        </div>
                    </div>

                    {/* Overlay gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Product Info */}
                <div className="mt-6 space-y-2">
                    <div className="flex gap-3">
                        {artwork.isNew && <DSLabel className="text-accent">Новинка</DSLabel>}
                        {(artwork.category === 'painting' || artwork.category === 'photo') && (
                            <DSLabel className="text-muted-foreground/60 border-l border-border/20 pl-3">
                                Оформление в багет
                            </DSLabel>
                        )}
                    </div>
                    <motion.h3
                        className="font-display text-xl md:text-2xl transition-all duration-500 group-hover:italic"
                    >
                        {artwork.title}
                    </motion.h3>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground tracking-wider">{artwork.price}</span>
                        <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground group-hover:text-foreground transition-colors">
                            Подробнее →
                        </span>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
};

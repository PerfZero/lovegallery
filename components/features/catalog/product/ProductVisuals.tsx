"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, ChevronLeft, ChevronRight, X } from 'lucide-react';
import Image from 'next/image';
import { type Artwork } from '@/data/artworks';
import { DSLabel, DSText } from '@/components/ui/design-system';
import { ForwardedRef, forwardRef, useState } from 'react';

interface ProductVisualsProps {
    artwork: Artwork;
    onOpenInterior: () => void;
}

export const ProductVisuals = forwardRef(({ artwork, onOpenInterior }: ProductVisualsProps, ref: ForwardedRef<HTMLImageElement>) => {
    const images = artwork.images || [artwork.image];
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const goToPrev = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const goToNext = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className="w-full lg:w-[60%] space-y-8">
            {/* Main Image */}
            <div className="relative aspect-square lg:aspect-auto lg:h-[calc(100vh-220px)] overflow-hidden group flex items-center justify-center">
                <Image
                    ref={ref}
                    data-shared={`artwork-${artwork.id}`}
                    src={images[currentIndex]}
                    alt={artwork.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    priority
                    className="object-contain"
                />

                {/* Navigation Arrows */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={goToPrev}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-background/60 backdrop-blur-md rounded-full hover:bg-background transition-all opacity-0 group-hover:opacity-100"
                            aria-label="Предыдущее фото"
                        >
                            <ChevronLeft size={20} strokeWidth={1.5} />
                        </button>
                        <button
                            onClick={goToNext}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-background/60 backdrop-blur-md rounded-full hover:bg-background transition-all opacity-0 group-hover:opacity-100"
                            aria-label="Следующее фото"
                        >
                            <ChevronRight size={20} strokeWidth={1.5} />
                        </button>
                    </>
                )}

                {/* Floating Badges */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="absolute bottom-6 left-6 flex gap-4 z-20"
                >
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsFullscreen(true);
                        }}
                        className="p-3 md:p-4 bg-background/80 backdrop-blur-md rounded-full hover:bg-background transition-all border border-foreground/5 shadow-sm group/btn"
                        title="Посмотреть во весь экран"
                    >
                        <Maximize2 size={18} strokeWidth={1.5} className="group-hover/btn:scale-110 transition-transform text-foreground/80 group-hover/btn:text-foreground" />
                    </button>
                </motion.div>

                {/* Image Counter */}
                {images.length > 1 && (
                    <div className="absolute bottom-8 right-8 px-3 py-1.5 bg-background/60 backdrop-blur-md rounded-full text-xs tracking-wider">
                        {currentIndex + 1} / {images.length}
                    </div>
                )}
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                    {images.map((img, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden transition-all ${index === currentIndex
                                ? 'ring-2 ring-accent ring-offset-2'
                                : 'opacity-60 hover:opacity-100'
                                }`}
                        >
                            <Image
                                src={img}
                                alt={`${artwork.title} - фото ${index + 1}`}
                                fill
                                sizes="80px"
                                className="object-contain"
                            />
                        </button>
                    ))}
                </div>
            )}

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0, duration: 0.6 }}
                className="space-y-4"
            >
                {artwork.description && (
                    <div className="pb-8 border-b border-border/10">
                        <DSText className="text-xl text-foreground/90 leading-relaxed font-light italic whitespace-pre-line">
                            {artwork.description}
                        </DSText>
                    </div>
                )}
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0, duration: 0.6 }}
                className="grid grid-cols-2 gap-8 py-8"
            >
                <div className="space-y-4">
                    <DSLabel className="text-accent">Материалы</DSLabel>
                    <DSText size="sm" className="text-muted-foreground leading-relaxed">
                        Натуральный массив дерева, экологичный шпон, водоотталкивающая ткань. Премиальная отделка лаком.
                    </DSText>
                </div>
                <div className="space-y-4">
                    <DSLabel className="text-accent">Доставка</DSLabel>
                    <DSText size="sm" className="text-muted-foreground leading-relaxed">
                        Бережная упаковка. Доставка по всей России через СДЭК или курьером.
                    </DSText>
                </div>
            </motion.div>
            <AnimatePresence>
                {/* Fullscreen Modal */}
                {isFullscreen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
                        onClick={() => setIsFullscreen(false)}
                    >
                        <button
                            className="absolute top-8 right-8 p-3 text-white hover:bg-white/10 rounded-full transition-all"
                            onClick={() => setIsFullscreen(false)}
                        >
                            <X size={24} />
                        </button>

                        <div className="relative w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                            <Image
                                src={images[currentIndex]}
                                alt={artwork.title}
                                fill
                                className="object-contain"
                                priority
                            />

                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={goToPrev}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-black/40 hover:bg-black/60 text-white rounded-full transition-all"
                                    >
                                        <ChevronLeft size={24} />
                                    </button>
                                    <button
                                        onClick={goToNext}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-black/40 hover:bg-black/60 text-white rounded-full transition-all"
                                    >
                                        <ChevronRight size={24} />
                                    </button>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
});

ProductVisuals.displayName = 'ProductVisuals';

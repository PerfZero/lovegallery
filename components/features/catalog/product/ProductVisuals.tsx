"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { type Artwork } from "@/data/artworks";
import { DSLabel, DSText } from "@/components/ui/design-system";
import { ForwardedRef, forwardRef, useState } from "react";

interface ProductVisualsProps {
  artwork: Artwork;
  onOpenInterior: () => void;
}

export const ProductVisuals = forwardRef(
  (
    { artwork, onOpenInterior }: ProductVisualsProps,
    ref: ForwardedRef<HTMLImageElement>,
  ) => {
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
      <>
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
                <Maximize2
                  size={18}
                  strokeWidth={1.5}
                  className="group-hover/btn:scale-110 transition-transform text-foreground/80 group-hover/btn:text-foreground"
                />
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
                  className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden transition-all ${
                    index === currentIndex
                      ? "ring-2 ring-accent ring-offset-2"
                      : "opacity-60 hover:opacity-100"
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
                <DSText className="text-l text-foreground/90 leading-relaxed font-light  whitespace-pre-line md:text-xl">
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
              <DSText
                size="sm"
                className="text-muted-foreground leading-relaxed"
              >
                Натуральный массив дерева, экологичный шпон, водоотталкивающая
                ткань. Премиальная отделка лаком.
              </DSText>
            </div>
            <div className="space-y-4">
              <DSLabel className="text-accent">Доставка</DSLabel>
              <DSText
                size="sm"
                className="text-muted-foreground leading-relaxed"
              >
                Бережная упаковка. Доставка по всей России через СДЭК или
                курьером.
              </DSText>
            </div>
          </motion.div>
        </div>

        <AnimatePresence>
          {/* Fullscreen Modal */}
          {isFullscreen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[999] bg-background/98 backdrop-blur-xl flex items-center justify-center cursor-zoom-out p-4 md:p-20"
              onClick={() => setIsFullscreen(false)}
              tabIndex={0}
            >
              <button
                className="fixed top-6 right-6 md:top-10 md:right-10 z-[1001] p-4 bg-foreground/5 hover:bg-foreground/10 text-foreground rounded-full transition-all border border-foreground/10 group/close shadow-lg backdrop-blur-md"
                onClick={() => setIsFullscreen(false)}
                aria-label="Закрыть"
              >
                <X
                  className="group-hover/close:rotate-90 transition-transform duration-300"
                  size={28}
                  strokeWidth={1.5}
                />
              </button>

              <div
                className="relative w-full h-full flex items-center justify-center max-w-7xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
                  <Image
                    src={images[currentIndex]}
                    alt={artwork.title}
                    fill
                    className="object-contain pointer-events-auto cursor-default"
                    priority
                  />
                </div>

                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-[1000] pointer-events-none mb-4 md:mb-10">
                  <p className="font-display italic text-lg md:text-xl tracking-tight text-foreground/80">
                    {artwork.title}
                  </p>
                </div>

                {images.length > 1 && (
                  <>
                    <button
                      onClick={goToPrev}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-foreground/5 hover:bg-foreground/10 text-foreground rounded-full transition-all border border-foreground/10 shadow-lg backdrop-blur-md"
                    >
                      <ChevronLeft size={24} strokeWidth={1.5} />
                    </button>
                    <button
                      onClick={goToNext}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-foreground/5 hover:bg-foreground/10 text-foreground rounded-full transition-all border border-foreground/10 shadow-lg backdrop-blur-md"
                    >
                      <ChevronRight size={24} strokeWidth={1.5} />
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  },
);

ProductVisuals.displayName = "ProductVisuals";

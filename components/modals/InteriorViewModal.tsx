"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X, Maximize2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// =============================================================================
// Interior View Modal Component
// =============================================================================

// Интерьерное фото для демонстрации (оставляем одно лучшее)
const interiorImages = [
  {
    src: "/images/interiors/interior_1.png",
    title: "Современная гостиная",
    artworkScale: "w-[22%] md:w-[12%]",
    artworkPosition: "pb-[10%]",
  },
  {
    src: "/images/interiors/interior_2.png",
    title: "Элегантная спальня",
    artworkScale: "w-[18%] md:w-[10%]",
    artworkPosition: "pb-[18%]",
  },
  {
    src: "/images/interiors/interior_3.png",
    title: "Лаунж-зона",
    artworkScale: "w-[20%] md:w-[13%]",
    artworkPosition: "pb-[12%]",
  },
];

interface InteriorViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  productImage?: string;
  productTitle?: string;
  aspectRatio?: "portrait" | "square" | "landscape";
}

export const InteriorViewModal = ({
  isOpen,
  onClose,
  productImage,
  productTitle,
  aspectRatio = "portrait",
}: InteriorViewModalProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Auto fullscreen on mobile
  useEffect(() => {
    if (!isOpen) return;
    if (typeof window === "undefined") return;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (isMobile) {
      setIsFullscreen(true);
    }
  }, [isOpen]);

  const nextInterior = () => {
    setCurrentIndex((prev) => (prev + 1) % interiorImages.length);
  };

  const prevInterior = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + interiorImages.length) % interiorImages.length,
    );
  };

  const currentInterior = interiorImages[currentIndex];

  // Calculate aspect ratio class
  const ratioClass =
    aspectRatio === "landscape"
      ? "aspect-[4/3]"
      : aspectRatio === "square"
        ? "aspect-square"
        : "aspect-[3/4]";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`p-0 bg-background/98 backdrop-blur-xl border border-foreground/10 overflow-hidden transition-all duration-500 ease-in-out ${
          isFullscreen
            ? "!fixed !inset-0 !translate-x-0 !translate-y-0 !w-[100vw] !h-[100dvh] !max-w-none !max-h-none !rounded-none !z-[100]"
            : "max-w-[95vw] md:max-w-[1200px] h-auto rounded-lg shadow-2xl"
        } [&>button]:!hidden`}
      >
        <DialogTitle className="sr-only">
          Интерьерная примерка: {productTitle || "Арт-объект"}
        </DialogTitle>
        {/* Header Overlay */}
        <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between p-6 md:p-8 bg-gradient-to-b from-background/90 via-background/60 to-transparent pointer-events-auto">
          <div className="space-y-1">
            <p className="text-[10px] text-foreground/75 font-bold uppercase tracking-[0.3em]">
              Примерка: {productTitle || "Арт-объект"}
            </p>
            <h3 className="text-foreground/95 font-display text-xl md:text-2xl italic drop-shadow-lg">
              {currentInterior.title}
            </h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-foreground/80 hover:text-foreground hover:bg-foreground/10 transition-all rounded-full h-12 w-12 flex-shrink-0"
          >
            <X size={24} />
          </Button>
        </div>

        {/* Main Viewport */}
        <div
          className={`relative w-full bg-background/98 backdrop-blur-xl overflow-hidden transition-all duration-500 ${isFullscreen ? "h-[100dvh]" : "aspect-video"}`}
        >
          {/* Background Interior */}
          <img
            key={currentInterior.src}
            src={currentInterior.src}
            alt={currentInterior.title}
            className="absolute inset-0 w-full h-full object-contain transition-opacity duration-1000"
          />

          {/* Navigation Buttons Overlay */}
          <div className="absolute inset-0 flex items-center justify-between px-4 md:px-8 pointer-events-none z-20">
            <Button
              variant="ghost"
              size="icon"
              onClick={prevInterior}
              className="pointer-events-auto text-white/95 hover:text-white hover:bg-black/25 bg-black/15 backdrop-blur-md rounded-full w-12 h-12 md:w-16 md:h-16 transition-all border border-white/20 shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
            >
              <ChevronLeft
                size={32}
                strokeWidth={1.5}
                className="mix-blend-difference"
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={nextInterior}
              className="pointer-events-auto text-white/95 hover:text-white hover:bg-black/25 bg-black/15 backdrop-blur-md rounded-full w-12 h-12 md:w-16 md:h-16 transition-all border border-white/20 shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
            >
              <ChevronRight
                size={32}
                strokeWidth={1.5}
                className="mix-blend-difference"
              />
            </Button>
          </div>

          {/* Artwork on wall */}
          {productImage && (
            <div
              className={`absolute inset-0 flex items-center justify-center ${currentInterior.artworkPosition}`}
            >
              <div
                className={`${currentInterior.artworkScale} ${ratioClass} relative transition-all duration-700 group`}
              >
                <img
                  src={productImage}
                  alt={productTitle || "Произведение"}
                  className="w-full h-full object-cover drop-shadow-[0_12px_18px_rgba(0,0,0,0.25)] brightness-[0.96] contrast-[0.98] saturate-[0.92]"
                />
                <div className="absolute inset-0 bg-foreground/10 mix-blend-multiply pointer-events-none" />
              </div>
            </div>
          )}
        </div>

        {/* UI Overlay Blocks */}
        {!isFullscreen && (
          <div className="absolute bottom-4 md:bottom-10 left-4 md:left-10 right-4 md:right-10 flex flex-col md:flex-row items-stretch md:items-end justify-between gap-3 md:gap-8 z-30 pointer-events-none">
            <div className="p-4 md:p-8 bg-foreground/55 backdrop-blur-xl border border-foreground/30 rounded-2xl pointer-events-auto w-full md:max-w-md">
              <div className="space-y-2 md:space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-px bg-background/60" />
                  <p className="text-[10px] text-background/90 uppercase tracking-[0.3em] font-bold">
                    Интерьер {currentIndex + 1} из {interiorImages.length}
                  </p>
                </div>
                <p className="text-[11px] md:text-sm font-body italic text-background/85 leading-relaxed">
                  Переключайте интерьеры, чтобы подобрать идеальное место для
                  вашей работы.
                </p>
              </div>
            </div>

            <div className="pointer-events-auto w-full md:w-auto">
              <Button
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFullscreen();
                }}
                className="w-full md:w-auto justify-center gap-3 text-[10px] text-foreground uppercase tracking-[0.2em] font-bold py-4 md:py-7 px-6 md:px-10 bg-background/80 backdrop-blur-xl border-foreground/30 hover:bg-foreground hover:border-foreground hover:text-background transition-all duration-500 rounded-full shadow-xl"
              >
                <Maximize2 size={16} />
                На весь экран
              </Button>
            </div>
          </div>
        )}

        {/* Exit Fullscreen Toggle */}
        {isFullscreen && (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              toggleFullscreen();
            }}
            className="absolute bottom-10 right-10 text-foreground bg-foreground/15 hover:bg-foreground/25 backdrop-blur-xl rounded-full w-16 h-16 z-40 border border-foreground/20 shadow-2xl transition-all"
            title="Свернуть"
          >
            <Maximize2 size={24} className="rotate-180" />
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default InteriorViewModal;

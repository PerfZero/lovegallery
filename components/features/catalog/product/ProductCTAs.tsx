"use client";

import { useEffect, useState } from "react";
import { Info, Eye, ShoppingCart } from "lucide-react";
import { OrderFormModal } from "@/components/modals/OrderFormModal";
import { ExpertHelpModal } from "@/components/modals/ExpertHelpModal";
import type { Artwork } from "@/data/artworks";

interface ProductCTAsProps {
  artwork?: Artwork;
  onOpenInterior: () => void;
  selectedOptions?: {
    size: string;
    frame: string;
    passepartout: string;
    glass: string;
    productType: string;
    finish?: string;
    fabric?: string;
  };
}

export const ProductCTAs = ({
  artwork,
  onOpenInterior,
  selectedOptions,
}: ProductCTAsProps) => {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isExpertModalOpen, setIsExpertModalOpen] = useState(false);

  useEffect(() => {
    const handler = () => setIsExpertModalOpen(true);
    window.addEventListener("open-expert-modal", handler);
    return () => window.removeEventListener("open-expert-modal", handler);
  }, []);

  return (
    <>
      <div className="space-y-4">
        {/* Смотреть в интерьере */}
        {artwork?.category !== "pet-furniture" && (
          <button
            onClick={onOpenInterior}
            className="w-full flex items-center justify-center gap-3 py-4 border border-border group hover:border-accent hover:bg-accent/5 transition-all"
          >
            <Eye
              size={16}
              className="text-muted-foreground group-hover:text-accent transition-colors"
            />
            <span className="text-[10px] uppercase tracking-[0.3em] font-semibold">
              Смотреть в интерьере
            </span>
          </button>
        )}

        {/* Купить */}
        <button
          onClick={() => setIsOrderModalOpen(true)}
          className="w-full py-5 bg-foreground text-background text-[11px] uppercase tracking-[0.4em] font-bold hover:bg-accent hover:text-foreground transition-all duration-500 shadow-xl flex items-center justify-center gap-3"
        >
          <ShoppingCart size={16} />
          Заказать
        </button>

        {/* Дополнительные опции */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
          <button
            onClick={() => setIsExpertModalOpen(true)}
            className="text-[9px] uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors flex items-center gap-2 text-left"
          >
            <Info size={12} className="shrink-0" />
            Консультация эксперта
          </button>
          <button
            onClick={() => setIsExpertModalOpen(true)}
            className="text-[9px] uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors flex items-center gap-2 text-left"
          >
            <Info size={12} className="shrink-0" />
            Помощь арт-дизайнера
          </button>
        </div>
      </div>

      {/* Modals */}
      <OrderFormModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        productName={artwork?.title}
        productPrice={artwork?.price}
        selectedOptions={selectedOptions}
      />

      <ExpertHelpModal
        isOpen={isExpertModalOpen}
        onClose={() => setIsExpertModalOpen(false)}
      />
    </>
  );
};

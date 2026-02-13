"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import { motion } from "framer-motion";
import { type Artwork } from "@/data/artworks";
import {
  catalogPageContent as defaultCatalogPageContent,
  type CatalogPageContentData,
} from "@/data/catalog-page-content";
import { DSContainer } from "@/components/ui/design-system";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePageTransition } from "@/context/TransitionContext";

import { ProductVisuals } from "@/components/features/catalog/product/ProductVisuals";
import { ProductInfo } from "@/components/features/catalog/product/ProductInfo";
import { ProductConfigurator } from "@/components/features/catalog/product/ProductConfigurator";
import { ProductFramingService } from "@/components/features/catalog/product/ProductFramingService";
import { ProductCTAs } from "@/components/features/catalog/product/ProductCTAs";
import { InteriorViewModal } from "@/components/modals/InteriorViewModal";
import { ShareSection } from "@/components/features/art-insights/ShareSection";
import { isCatalogPageContent } from "@/lib/catalog-page-content";

export default function ProductContent() {
  const params = useParams();
  const id = params.id as string;
  const categoryId = params.category as string;
  const imgRef = useRef<HTMLImageElement>(null);
  const { registerTarget } = usePageTransition();
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [catalogPageContent, setCatalogPageContent] =
    useState<CatalogPageContentData>(defaultCatalogPageContent);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [isInteriorModalOpen, setIsInteriorModalOpen] = useState(false);

  const [selectedSize, setSelectedSize] = useState("50*70");
  const [hasFrame, setHasFrame] = useState("Да");
  const [hasPassepartout, setHasPassepartout] = useState("Да");
  const [hasGlass, setHasGlass] = useState("Обычное");
  const [productType, setProductType] = useState("Картина");
  const [selectedFinish, setSelectedFinish] = useState("Дуб");
  const [selectedFabric, setSelectedFabric] = useState("Ткань 1");

  useEffect(() => {
    let mounted = true;
    Promise.allSettled([
      fetch(`/api/catalog/${id}`, { cache: "no-store" }).then(async (res) => {
        if (!res.ok) throw new Error("Failed to load item");
        return res.json();
      }),
      fetch("/api/catalog-content", { cache: "no-store" }).then((res) =>
        res.json(),
      ),
    ])
      .then(([itemResult, contentResult]) => {
        if (!mounted) return;

        if (itemResult.status === "fulfilled") {
          const item = itemResult.value.item as Artwork | undefined;
          if (!item || item.category !== categoryId) {
            setLoadError(true);
            setArtwork(null);
          } else {
            setSelectedSize(item.options?.sizes?.[0] || "50*70");
            setSelectedFinish(item.options?.finishes?.[0] || "Дуб");
            setSelectedFabric(item.options?.fabrics?.[0] || "Ткань 1");
            setLoadError(false);
            setArtwork(item);
          }
        } else {
          setLoadError(true);
          setArtwork(null);
        }

        if (contentResult.status === "fulfilled") {
          const data = contentResult.value;
          if (isCatalogPageContent(data?.item)) {
            setCatalogPageContent(data.item);
          }
        }
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [id, categoryId]);

  useEffect(() => {
    if (imgRef.current && artwork) {
      registerTarget(`artwork-${artwork.id}`, imgRef.current);
    }
  }, [artwork, registerTarget]);

  if (!artwork) {
    if (loading) {
      return (
        <div className="min-h-screen bg-background text-foreground relative">
          <Header />
          <main className="pt-24 pb-10">
            <DSContainer>
              <Link
                href={`/catalog/${categoryId}`}
                className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors mb-6 group"
              >
                <ArrowLeft
                  size={14}
                  className="group-hover:-translate-x-1 transition-transform"
                />
                {catalogPageContent.productPage.backButtonLabel}
              </Link>
              <p className="text-sm text-muted-foreground">
                Загрузка товара...
              </p>
            </DSContainer>
          </main>
          <Footer />
        </div>
      );
    }
    if (loadError) {
      notFound();
    }
    notFound();
  }

  const isPetFurniture = artwork.category === "pet-furniture";

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <Header />

      <main className="pt-24 pb-10">
        <DSContainer>
          <Link
            href={`/catalog/${categoryId}`}
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors mb-6 group"
          >
            <ArrowLeft
              size={14}
              className="group-hover:-translate-x-1 transition-transform"
            />
            {catalogPageContent.productPage.backButtonLabel}
          </Link>

          <div className="flex flex-col lg:flex-row gap-12 items-stretch lg:min-h-[calc(100vh-160px)]">
            <ProductVisuals
              ref={imgRef}
              artwork={artwork}
              productPageContent={catalogPageContent.productPage}
            />

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0, duration: 0.6, ease: "easeOut" }}
              className="w-full lg:w-[40%] flex flex-col gap-12"
            >
              <ProductInfo artwork={artwork} />

              <ProductConfigurator
                artwork={artwork}
                selectedSize={selectedSize}
                setSelectedSize={setSelectedSize}
                hasFrame={hasFrame}
                setHasFrame={setHasFrame}
                hasPassepartout={hasPassepartout}
                setHasPassepartout={setHasPassepartout}
                hasGlass={hasGlass}
                setHasGlass={setHasGlass}
                productType={productType}
                setProductType={setProductType}
                selectedFinish={selectedFinish}
                setSelectedFinish={setSelectedFinish}
                selectedFabric={selectedFabric}
                setSelectedFabric={setSelectedFabric}
              />

              {!isPetFurniture && <ProductFramingService artwork={artwork} />}

              <ProductCTAs
                artwork={artwork}
                onOpenInterior={() => setIsInteriorModalOpen(true)}
                selectedOptions={{
                  size: selectedSize,
                  frame: hasFrame,
                  passepartout: hasPassepartout,
                  glass: hasGlass,
                  productType: productType,
                  finish: isPetFurniture ? selectedFinish : undefined,
                  fabric: isPetFurniture ? selectedFabric : undefined,
                }}
              />

              <ShareSection title={artwork.title} />
            </motion.div>
          </div>
        </DSContainer>
      </main>

      <Footer />

      {!isPetFurniture && (
        <InteriorViewModal
          isOpen={isInteriorModalOpen}
          onClose={() => setIsInteriorModalOpen(false)}
          productImage={artwork.image}
          productTitle={artwork.title}
          aspectRatio={artwork.aspectRatio}
        />
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  catalogPageContent,
  type CatalogPageCategoryItem,
  type CatalogPageContentData,
} from "@/data/catalog-page-content";
import { isCatalogPageContent } from "@/lib/catalog-page-content";
import {
  DSHeading,
  DSContainer,
  DSDecorativeAsterisk,
  DSText,
} from "@/components/ui/design-system";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export default function CatalogPage() {
  const [content, setContent] = useState<CatalogPageContentData>(catalogPageContent);
  const [activeCategory, setActiveCategory] = useState<CatalogPageCategoryItem | null>(
    null,
  );

  useEffect(() => {
    let mounted = true;
    fetch("/api/catalog-content", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        if (isCatalogPageContent(data?.item)) {
          setContent(data.item);
        }
      })
      .catch(() => {
        // keep fallback content
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <div className="fixed inset-0 z-0 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeCategory ? (
            <motion.div
              key={activeCategory.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              {activeCategory.videoSrc ? (
                <video
                  src={activeCategory.videoSrc}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${activeCategory.videoPlaceholderColor} opacity-40`}
                />
              )}
            </motion.div>
          ) : (
            <motion.div
              key="default"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 bg-background"
            />
          )}
        </AnimatePresence>
        <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] transition-all duration-700" />
      </div>

      <Header />

      <main className="relative z-10 pt-32 pb-20">
        <DSContainer>
          <Breadcrumbs className="mb-8" />

          <section className="text-center mb-16 md:mb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col items-center gap-6"
            >
              <DSDecorativeAsterisk />
              <DSHeading level="h1" className="text-4xl md:text-6xl lg:text-7xl">
                {content.hero.title}
              </DSHeading>
              <DSText className="max-w-2xl text-muted-foreground uppercase tracking-[0.2em] text-[10px]">
                {content.hero.subtitle}
              </DSText>
            </motion.div>
          </section>

          <section className="mb-32">
            <div className="flex flex-col items-stretch max-w-4xl mx-auto divide-y divide-border/20">
              {content.categories.map((category, index) => (
                <CategoryItem
                  key={category.id}
                  category={category}
                  index={index}
                  onHover={setActiveCategory}
                />
              ))}
            </div>
          </section>
        </DSContainer>
      </main>

      <Footer />
    </div>
  );
}

function CategoryItem({
  category,
  index,
  onHover,
}: {
  category: CatalogPageCategoryItem;
  index: number;
  onHover: (c: CatalogPageCategoryItem | null) => void;
}) {
  const router = useRouter();

  return (
    <div onClick={() => router.push(`/catalog/${category.id}`)} className="block">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 * index }}
        onMouseEnter={() => onHover(category)}
        onMouseLeave={() => onHover(null)}
        className="group relative py-8 md:py-12 cursor-pointer transition-colors duration-500"
      >
        <div className="relative z-10 grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_auto] md:items-center md:gap-8">
          <h3 className="text-3xl md:text-5xl lg:text-6xl font-display italic font-light group-hover:text-accent group-hover:translate-x-4 transition-all duration-500 text-left">
            {category.title}
          </h3>
          <div className="flex items-center gap-8 md:contents">
            <span className="text-xs md:text-sm uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors duration-300 md:max-w-[38ch] md:justify-self-start text-left">
              {category.description}
            </span>

            <div className="flex items-center gap-3 md:justify-self-end">
              <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-accent opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                Смотреть
              </span>
              <div className="relative w-12 h-px bg-accent/30 overflow-hidden hidden md:block">
                <div className="absolute inset-0 bg-accent -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-border/20 overflow-hidden">
          <div className="w-full h-full bg-accent -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-out" />
        </div>
      </motion.div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import {
  DSHeading,
  DSContainer,
  DSDecorativeAsterisk,
} from "@/components/ui/design-system";
import {
  type CatalogCategoryId,
  type CatalogCategoryPageItem,
  type CatalogPageCategoryItem,
} from "@/data/catalog-page-content";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface CategoryHeaderProps {
  categoryId: CatalogCategoryId;
  categoryPage: CatalogCategoryPageItem;
  catalogCategory?: CatalogPageCategoryItem;
}

export const CategoryHeader = ({
  categoryId,
  categoryPage,
  catalogCategory,
}: CategoryHeaderProps) => {
  const backgroundVideo =
    categoryPage.backgroundVideoSrc ||
    catalogCategory?.videoSrc ||
    (categoryId === "collections" ? "/videos/colection.mp4" : undefined);

  return (
    <section className="pt-40 pb-20 relative">
      <div
        className={cn(
          "flex flex-col items-center text-center max-w-4xl mx-auto px-6 relative",
          categoryId === "collections" &&
            "md:items-start md:text-left md:max-w-5xl",
        )}
      >
        {categoryId === "collections" && (
          <div className="absolute top-0 left-0 -translate-y-12 md:-translate-y-24 -translate-x-8 md:-translate-x-12 pointer-events-none select-none overflow-hidden w-full h-[300px]">
            <span className="text-[12rem] md:text-[18rem] font-display italic font-light text-foreground/[0.03] leading-none whitespace-nowrap">
              {categoryPage.navTitle}
            </span>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={cn("mb-4", categoryId === "collections" && "md:ml-24")}
        >
          <span className="text-[10px] tracking-[0.4em] uppercase font-medium text-muted-foreground">
            {categoryPage.navTitle}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className={cn(
            "space-y-8 relative z-10",
            categoryId === "collections" && "md:ml-48 mt-4",
          )}
        >
          <DSHeading
            level="h1"
            className={cn(
              "text-3xl md:text-5xl lg:text-5xl tracking-widest uppercase font-light leading-tight",
              categoryId === "collections" && "max-w-2xl",
            )}
          >
            {categoryPage.headline}
          </DSHeading>

          <DSDecorativeAsterisk
            className={cn(
              "mx-auto opacity-20",
              categoryId === "collections" && "md:mx-0",
            )}
          />
        </motion.div>
      </div>

      <div className="mt-12 border-y border-border/10 py-12 relative z-30">
        <DSContainer>
          <div
            className={cn(
              "flex justify-center flex-wrap gap-y-12 gap-x-8 md:gap-x-24 text-[9px] tracking-[0.3em] uppercase font-semibold text-muted-foreground",
              categoryId === "collections" && "max-w-5xl mx-auto",
            )}
          >
            {categoryPage.subnav.map((item, index) => {
              const href = item.href?.trim() || "";
              const content = (
                <>
                  {item.label}
                  <span
                    className={`absolute -bottom-1 left-0 w-full h-px bg-foreground transition-transform origin-left ${
                      index === 0 && categoryId !== "collections"
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </>
              );

              const isCollections = categoryId === "collections";
              const className = cn(
                "hover:text-foreground transition-colors relative group py-2",
                !isCollections && index === 0 ? "text-foreground" : "",
                isCollections && "text-[7.5px] tracking-[0.45em] font-medium",
                isCollections && index % 2 !== 0
                  ? "md:translate-y-12"
                  : "md:-translate-y-2",
                isCollections && (index % 4 === 1 || index % 4 === 2)
                  ? "md:px-8"
                  : "",
              );

              if (href) {
                return (
                  <Link key={`${item.label}-${index}`} href={href} className={className}>
                    {content}
                  </Link>
                );
              }

              return (
                <button key={`${item.label}-${index}`} className={className}>
                  {content}
                </button>
              );
            })}
          </div>
        </DSContainer>
      </div>

      <div
        className={`absolute inset-0 bg-gradient-to-b ${categoryPage.accentColor} -z-10`}
      />

      {backgroundVideo && (
        <div className="absolute inset-0 -z-20 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-40"
          >
            <source src={backgroundVideo} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-background/20 backdrop-blur-[2px]" />
        </div>
      )}
    </section>
  );
};

"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, notFound } from "next/navigation";
import { DSContainer } from "@/components/ui/design-system";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CategoryHeader } from "@/components/sections/CategoryHeader";
import { ArtGrid } from "@/components/features/catalog/ArtGrid";
import { type Artwork } from "@/data/artworks";
import {
  CATALOG_CATEGORY_IDS,
  catalogPageContent as defaultCatalogPageContent,
  type CatalogCategoryId,
  type CatalogPageContentData,
} from "@/data/catalog-page-content";
import { isCatalogPageContent } from "@/lib/catalog-page-content";

export default function CategoryContent() {
  const params = useParams();
  const category = params.category as string;
  const typedCategory = category as CatalogCategoryId;
  const [items, setItems] = useState<Artwork[]>([]);
  const [pageContent, setPageContent] = useState<CatalogPageContentData>(
    defaultCatalogPageContent,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  if (!(CATALOG_CATEGORY_IDS as readonly string[]).includes(category)) {
    notFound();
  }

  useEffect(() => {
    let mounted = true;
    Promise.allSettled([
      fetch("/api/catalog", { cache: "no-store" }).then((res) => res.json()),
      fetch("/api/catalog-content", { cache: "no-store" }).then((res) =>
        res.json(),
      ),
    ])
      .then(([catalogResult, contentResult]) => {
        if (!mounted) return;

        if (catalogResult.status === "fulfilled") {
          const data = catalogResult.value;
          setItems(Array.isArray(data.items) ? data.items : []);
        } else {
          setItems([]);
          setError("Не удалось загрузить товары.");
        }

        if (contentResult.status === "fulfilled") {
          const data = contentResult.value;
          if (isCatalogPageContent(data?.item)) {
            setPageContent(data.item);
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
  }, []);

  const filteredArtworks = useMemo(
    () => items.filter((art) => art.category === category),
    [items, category],
  );
  const categoryPageContent =
    pageContent.categoryPages.find((item) => item.id === typedCategory) ||
    defaultCatalogPageContent.categoryPages.find(
      (item) => item.id === typedCategory,
    );
  const categoryListContent =
    pageContent.categories.find((item) => item.id === typedCategory) ||
    defaultCatalogPageContent.categories.find(
      (item) => item.id === typedCategory,
    );

  if (!categoryPageContent) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <Header />

      <main className="relative z-10">
        <CategoryHeader
          categoryId={typedCategory}
          categoryPage={categoryPageContent}
          catalogCategory={categoryListContent}
        />

        <DSContainer className="py-20">
          {loading && (
            <p className="text-sm text-muted-foreground">
              Загрузка каталога...
            </p>
          )}
          {!loading && error && <p className="text-sm text-red-600">{error}</p>}
          {!loading && !error && filteredArtworks.length === 0 && (
            <p className="text-sm text-muted-foreground">
              В этой категории пока нет товаров.
            </p>
          )}
          {!loading && !error && filteredArtworks.length > 0 && (
            <ArtGrid artworks={filteredArtworks} />
          )}
        </DSContainer>
      </main>

      <Footer />
    </div>
  );
}

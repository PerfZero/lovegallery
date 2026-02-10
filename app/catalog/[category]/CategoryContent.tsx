"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, notFound } from "next/navigation";
import { DSContainer } from "@/components/ui/design-system";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CategoryHeader } from "@/components/sections/CategoryHeader";
import { ArtGrid } from "@/components/features/catalog/ArtGrid";
import { type Artwork, categoryThemes } from "@/data/artworks";

export default function CategoryContent() {
  const params = useParams();
  const category = params.category as string;
  const typedCategory = category as keyof typeof categoryThemes;
  const [items, setItems] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Validate category
  if (!(category in categoryThemes)) {
    notFound();
  }

  useEffect(() => {
    let mounted = true;

    fetch("/api/catalog", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        setItems(Array.isArray(data.items) ? data.items : []);
      })
      .catch(() => {
        if (!mounted) return;
        setItems([]);
        setError("Не удалось загрузить товары.");
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

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <Header />

      <main className="relative z-10">
        {/* 1. Immersive Editorial Header */}
        <CategoryHeader category={typedCategory} />

        {/* 2. Gallery Content */}
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

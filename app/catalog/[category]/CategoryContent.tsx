"use client";

import { useParams, notFound } from 'next/navigation';
import { DSContainer } from '@/components/ui/design-system';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CategoryHeader } from '@/components/sections/CategoryHeader';
import { ArtGrid } from '@/components/features/catalog/ArtGrid';
import { artworks, categoryThemes } from '@/data/artworks';

export default function CategoryContent() {
    const params = useParams();
    const category = params.category as string;

    // Validate category
    if (!(category in categoryThemes)) {
        notFound();
    }

    const filteredArtworks = artworks.filter(art => art.category === category);

    return (
        <div className="min-h-screen bg-background text-foreground relative">
            <Header />

            <main className="relative z-10">
                {/* 1. Immersive Editorial Header */}
                <CategoryHeader category={category as any} />

                {/* 2. Gallery Content */}
                <DSContainer className="py-20">
                    <ArtGrid artworks={filteredArtworks} />
                </DSContainer>
            </main>

            <Footer />
        </div>
    );
}

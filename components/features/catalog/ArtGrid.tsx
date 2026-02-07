"use client";

import { type Artwork } from '@/data/artworks';
import { ArtCard } from './ArtCard';
import { cn } from '@/lib/utils';

interface ArtGridProps {
    artworks: Artwork[];
}

export const ArtGrid = ({ artworks }: ArtGridProps) => {
    const isPetFurniture = artworks.length > 0 && artworks[0].category === 'pet-furniture';
    const isCollections = artworks.length > 0 && artworks[0].category === 'collections';

    return (
        <div className="flex-1">
            <div className={`grid grid-cols-1 md:grid-cols-2 ${isPetFurniture
                ? 'lg:grid-cols-4'
                : isCollections
                    ? 'lg:grid-cols-2 max-w-5xl mx-auto px-6'
                    : 'lg:grid-cols-3'
                } gap-x-12 gap-y-24`}>
                {artworks.map((artwork, index) => {
                    let staggeredClass = '';

                    if (isCollections) {
                        // Staggered layout for 2 columns: every second item is shifted down
                        staggeredClass = index % 2 !== 0 ? 'md:translate-y-48' : '';
                    } else if (!isPetFurniture) {
                        // Original staggered layout for 3 columns
                        staggeredClass = index % 3 === 1 ? 'md:translate-y-24' : index % 3 === 2 ? 'md:translate-y-12' : '';
                    }

                    return (
                        <div
                            key={artwork.id}
                            className={cn(staggeredClass, isCollections && "max-w-[400px] mx-auto w-full")}
                        >
                            <ArtCard artwork={artwork} index={index} />
                        </div>
                    );
                })}
            </div>

            {/* Pad the bottom of the staggered grid */}
            <div className="h-48 md:h-64 hidden md:block" />
        </div>
    );
};

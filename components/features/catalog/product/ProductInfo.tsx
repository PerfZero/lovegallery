"use client";

import { DSHeading, DSText, DSLabel } from '@/components/ui/design-system';
import { type Artwork } from '@/data/artworks';

interface ProductInfoProps {
    artwork: Artwork;
}

export const ProductInfo = ({ artwork }: ProductInfoProps) => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-baseline">
                <DSLabel className="text-accent tracking-[0.3em]">КОД {artwork.id.padStart(3, '0')}</DSLabel>
                <p className="text-2xl font-light tracking-widest">{artwork.price}</p>
            </div>

            <DSHeading level="h1" className="text-4xl md:text-6xl font-light italic leading-tight">
                {artwork.title}
            </DSHeading>

            <DSText size="lg" className="text-muted-foreground italic">
                {artwork.artist || 'Авторский проект галереи'}
            </DSText>
        </div>
    );
};

"use client";

import { Ruler, Info, HelpCircle } from 'lucide-react';
import { DSLabel, DSText } from '@/components/ui/design-system';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { type Artwork } from '@/data/artworks';
import Link from 'next/link';
import React from 'react';

interface ProductConfiguratorProps {
    artwork: Artwork;
    selectedSize: string;
    setSelectedSize: (size: string) => void;
    hasFrame: string;
    setHasFrame: (opt: string) => void;
    hasPassepartout: string;
    setHasPassepartout: (opt: string) => void;
    hasGlass: string;
    setHasGlass: (opt: string) => void;
    productType: string;
    setProductType: (type: string) => void;
    selectedFinish?: string;
    setSelectedFinish?: (finish: string) => void;
    selectedFabric?: string;
    setSelectedFabric?: (fabric: string) => void;
}

export const ProductConfigurator = ({
    artwork,
    selectedSize,
    setSelectedSize,
    hasFrame,
    setHasFrame,
    hasPassepartout,
    setHasPassepartout,
    hasGlass,
    setHasGlass,
    productType,
    setProductType,
    selectedFinish,
    setSelectedFinish,
    selectedFabric,
    setSelectedFabric
}: ProductConfiguratorProps) => {
    const isPetFurniture = artwork.category === 'pet-furniture';

    // Default art sizes if none in artwork
    const defaultSizes = ['40*60', '50*70', '70*100', '150*200', '200*400'];
    const currentSizes = artwork.options?.sizes || defaultSizes;

    const binaryOptions = ['Да', 'Нет'];
    const productTypes = ['Картина', 'Принт'];

    return (
        <div className="space-y-10 py-10 border-y border-border/10">

            {/* 1. Size Selection */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <DSLabel className="flex items-center gap-2">
                        <Ruler size={12} /> {isPetFurniture ? 'ГАБАРИТЫ (СМ)' : 'РАЗМЕР (СМ)'}
                    </DSLabel>
                </div>
                <div className="flex flex-wrap gap-2">
                    {currentSizes.map(size => (
                        <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`px-4 py-2 text-[10px] tracking-widest uppercase transition-all duration-300 border ${selectedSize === size
                                ? 'border-accent bg-accent/5 text-accent'
                                : 'border-border/10 hover:border-border text-muted-foreground'
                                }`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
                {isPetFurniture && (
                    <div className="flex items-start gap-2 bg-accent/5 p-3 rounded-sm">
                        <Info size={12} className="text-accent mt-0.5" />
                        <DSText size="sm" className="text-accent/80 italic leading-snug">
                            Не можете определиться с размером? Обратитесь к нашему эксперту за консультацией.
                        </DSText>
                    </div>
                )}
            </div>

            {isPetFurniture ? (
                <>
                    {/* Pet Furniture Specific Options */}
                    <div className="space-y-4">
                        <DSLabel>ЦВЕТ ОТДЕЛКИ (НАТУРАЛЬНЫЙ ШПОН)</DSLabel>
                        <div className="flex flex-wrap gap-2">
                            {artwork.options?.finishes?.map(finish => (
                                <button
                                    key={finish}
                                    onClick={() => setSelectedFinish?.(finish)}
                                    className={`px-4 py-2 text-[10px] tracking-widest uppercase transition-all border ${selectedFinish === finish
                                        ? 'border-accent bg-accent/5 text-accent'
                                        : 'border-border/10 text-muted-foreground hover:border-border'
                                        }`}
                                >
                                    {finish}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <DSLabel>ТКАНЬ ПОДУШКИ</DSLabel>
                        <div className="flex flex-wrap gap-2">
                            {artwork.options?.fabrics?.map(fabric => (
                                <button
                                    key={fabric}
                                    onClick={() => setSelectedFabric?.(fabric)}
                                    className={`px-4 py-2 text-[10px] tracking-widest uppercase transition-all border ${selectedFabric === fabric
                                        ? 'border-accent bg-accent/5 text-accent'
                                        : 'border-border/10 text-muted-foreground hover:border-border'
                                        }`}
                                >
                                    {fabric}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            ) : (
                <>
                    {/* Art Specific Options */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-4">
                            <DSLabel>РАМА</DSLabel>
                            <div className="flex gap-2">
                                {binaryOptions.map(opt => (
                                    <button
                                        key={opt}
                                        onClick={() => setHasFrame(opt)}
                                        className={`flex-1 py-2 text-[10px] tracking-widest border transition-all ${hasFrame === opt ? 'border-accent text-accent' : 'border-border/10 text-muted-foreground'
                                            }`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-4">
                            <DSLabel>ПАСПАРТУ</DSLabel>
                            <div className="flex gap-2">
                                {binaryOptions.map(opt => (
                                    <button
                                        key={opt}
                                        onClick={() => setHasPassepartout(opt)}
                                        className={`flex-1 py-2 text-[10px] tracking-widest border transition-all ${hasPassepartout === opt ? 'border-accent text-accent' : 'border-border/10 text-muted-foreground'
                                            }`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <DSLabel>СТЕКЛО</DSLabel>
                        <div className="flex gap-2">
                            {['Нет', 'Обычное', 'Художественное'].map(opt => (
                                <div key={opt} className="flex-1 relative group/glass">
                                    <button
                                        onClick={() => setHasGlass(opt)}
                                        className={`w-full py-2 text-[10px] tracking-widest border transition-all ${hasGlass === opt ? 'border-accent text-accent' : 'border-border/10 text-muted-foreground hover:border-border'
                                            }`}
                                    >
                                        {opt.toUpperCase()}
                                    </button>
                                    {opt === 'Художественное' && (
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <button
                                                    className="absolute -top-2 -right-1 p-1 bg-background border border-border/20 rounded-full text-muted-foreground hover:text-accent transition-colors z-10"
                                                    onClick={(e: React.MouseEvent) => e.stopPropagation()}
                                                >
                                                    <HelpCircle size={10} />
                                                </button>
                                            </PopoverTrigger>
                                            <PopoverContent className="max-w-[300px] p-4" onClick={(e) => e.stopPropagation()}>
                                                <DSText size="sm" className="leading-relaxed">
                                                    Музейное стекло с антибликовым покрытием, защищает от ультрафиолета на 70-99% и обеспечивает максимальную прозрачность.
                                                </DSText>
                                            </PopoverContent>
                                        </Popover>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <DSLabel>ТИП ИЗДЕЛИЯ</DSLabel>
                        <div className="flex gap-2">
                            {productTypes.map(type => (
                                <button
                                    key={type}
                                    onClick={() => setProductType(type)}
                                    className={`flex-1 py-4 text-[10px] tracking-[0.2em] font-semibold border transition-all ${productType === type ? 'border-accent bg-accent/5 text-accent' : 'border-border/10 text-muted-foreground hover:border-border'
                                        }`}
                                >
                                    {type.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

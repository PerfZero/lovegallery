"use client";

import { useState, useRef, useEffect } from 'react';
import { useParams, useRouter, notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import { artworks } from '@/data/artworks';
import { DSContainer } from '@/components/ui/design-system';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { usePageTransition } from '@/context/TransitionContext';

// Sub-components
import { ProductVisuals } from '@/components/features/catalog/product/ProductVisuals';
import { ProductInfo } from '@/components/features/catalog/product/ProductInfo';
import { ProductConfigurator } from '@/components/features/catalog/product/ProductConfigurator';
import { ProductFramingService } from '@/components/features/catalog/product/ProductFramingService';
import { ProductCTAs } from '@/components/features/catalog/product/ProductCTAs';
import { InteriorViewModal } from '@/components/modals/InteriorViewModal';

export default function ProductContent() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const categoryId = params.category as string;
    const imgRef = useRef<HTMLImageElement>(null);
    const { registerTarget } = usePageTransition();

    const artwork = artworks.find(art => art.id === id);

    useEffect(() => {
        // Register this image as the target for the FLIP animation
        if (imgRef.current && artwork) {
            registerTarget(`artwork-${artwork.id}`, imgRef.current);
        }
    }, [artwork, registerTarget]);

    if (!artwork) {
        notFound();
    }

    // Modals
    const [isInteriorModalOpen, setIsInteriorModalOpen] = useState(false);
    const isPetFurniture = artwork?.category === 'pet-furniture';

    // Selection States
    const [selectedSize, setSelectedSize] = useState(artwork?.options?.sizes?.[0] || '50*70');
    const [hasFrame, setHasFrame] = useState('Да');
    const [hasPassepartout, setHasPassepartout] = useState('Да');
    const [hasGlass, setHasGlass] = useState('Обычное');
    const [productType, setProductType] = useState('Картина');

    // Pet Furniture States
    const [selectedFinish, setSelectedFinish] = useState(artwork?.options?.finishes?.[0] || 'Дуб');
    const [selectedFabric, setSelectedFabric] = useState(artwork?.options?.fabrics?.[0] || 'Ткань 1');

    return (
        <div className="min-h-screen bg-background text-foreground relative">
            <Header />

            <main className="pt-24 pb-10">
                <DSContainer>
                    {/* Back Button */}
                    <Link
                        href={`/catalog/${categoryId}`}
                        className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors mb-6 group"
                    >
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Вернуться в каталог
                    </Link>

                    <div className="flex flex-col lg:flex-row gap-12 items-stretch lg:min-h-[calc(100vh-160px)]">

                        <ProductVisuals
                            ref={imgRef}
                            artwork={artwork}
                            onOpenInterior={() => setIsInteriorModalOpen(true)}
                        />

                        {/* 2. Product Information & Configurators - Delayed Entrance */}
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
                        </motion.div>
                    </div>
                </DSContainer>
            </main>

            <Footer />

            {!isPetFurniture && (
                <InteriorViewModal
                    isOpen={isInteriorModalOpen}
                    onClose={() => setIsInteriorModalOpen(false)}
                    productImage={artwork?.image}
                    productTitle={artwork?.title}
                    aspectRatio={artwork?.aspectRatio}
                />
            )}
        </div>
    );
}

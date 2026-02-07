"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import { DSLabel, DSText } from '@/components/ui/design-system';
import { type Artwork } from '@/data/artworks';

interface ProductFramingServiceProps {
    artwork: Artwork;
}

export const ProductFramingService = ({ artwork }: ProductFramingServiceProps) => {
    if (artwork.category !== 'painting' && artwork.category !== 'photo') return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="py-10 border-t border-border/10 space-y-6"
        >
            <DSLabel className="text-accent underline underline-offset-8 decoration-accent/30">Багетные услуги</DSLabel>
            <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="w-full sm:w-1/3 aspect-square overflow-hidden relative">
                    <Image
                        src="/images/framing_workshop_1767627492695.webp"
                        alt="Framing Workshop"
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
                    />
                </div>
                <div className="w-full sm:w-2/3 space-y-4">
                    <DSText size="sm" className="text-muted-foreground leading-relaxed italic">
                        Мы предлагаем профессиональное оформление ваших работ в багет из массива дуба, ясеня и экзотических пород дерева. Каждая рама изготавливается вручную под ваш интерьер.
                    </DSText>
                </div>
            </div>
        </motion.div>
    );
};

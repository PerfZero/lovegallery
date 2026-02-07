"use client";

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
    className?: string;
    label?: string;
}

export const BackButton = ({
    className = "inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/80 hover:text-white transition-colors group",
    label = "Назад"
}: BackButtonProps) => {
    const router = useRouter();

    return (
        <button
            onClick={() => router.back()}
            className={className}
        >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            {label}
        </button>
    );
};

"use client";

import { TransitionProvider } from '@/context/TransitionContext';

export default function CatalogLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <TransitionProvider>{children}</TransitionProvider>;
}

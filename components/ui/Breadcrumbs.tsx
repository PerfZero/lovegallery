"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

// Mapping of path segments to Russian labels
const pathLabels: Record<string, string> = {
    "catalog": "Каталог",
    "paintings": "Картины",
    "posters": "Постеры",
    "textile": "Текстиль",
    "photography": "Фотография",
    "about": "О нас",
    "art-insights": "Арт-инсайты",
    "payment-delivery": "Оплата и доставка",
    "privacy": "Политика конфиденциальности",
    "offer": "Публичная оферта",
    "legal-details": "Реквизиты",
    "faq": "FAQ",
    "contact": "Контакты",
};

interface BreadcrumbsProps {
    /** Override the current item label */
    currentLabel?: string;
    /** Additional class names */
    className?: string;
}

export function Breadcrumbs({ currentLabel, className = "" }: BreadcrumbsProps) {
    const pathname = usePathname();

    // Split path and filter empty segments
    const segments = pathname.split("/").filter(Boolean);

    // Don't show breadcrumbs on homepage
    if (segments.length === 0) {
        return null;
    }

    // Build breadcrumb items
    const items = segments.map((segment, index) => {
        const href = "/" + segments.slice(0, index + 1).join("/");
        const isLast = index === segments.length - 1;

        // Get label from mapping or use segment
        let label = pathLabels[segment] || segment;

        // Use custom label for last item if provided
        if (isLast && currentLabel) {
            label = currentLabel;
        }

        return { href, label, isLast };
    });

    return (
        <nav
            aria-label="Breadcrumb"
            className={`flex items-center gap-2 text-sm ${className}`}
        >
            {/* Home link */}
            <Link
                href="/"
                className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Главная"
            >
                <Home size={14} />
            </Link>

            {items.map((item, index) => (
                <div key={item.href} className="flex items-center gap-2">
                    <ChevronRight size={14} className="text-muted-foreground/50" />

                    {item.isLast ? (
                        <span
                            className="text-foreground font-medium truncate max-w-[200px]"
                            aria-current="page"
                        >
                            {item.label}
                        </span>
                    ) : (
                        <Link
                            href={item.href}
                            className="text-muted-foreground hover:text-foreground transition-colors truncate max-w-[150px]"
                        >
                            {item.label}
                        </Link>
                    )}
                </div>
            ))}
        </nav>
    );
}

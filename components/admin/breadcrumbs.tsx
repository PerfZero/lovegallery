"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

const routeLabels: Record<string, string> = {
    admin: "Дашборд",
    catalog: "Каталог",
    gallery: "Галерея",
    blog: "Блог",
    new: "Новая запись",
    requests: "Заявки",
    settings: "Настройки",
};

export function AdminBreadcrumbs() {
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);

    return (
        <nav className="flex items-center space-x-2 text-xs text-muted-foreground mb-6">
            <Link
                href="/admin"
                className="hover:text-foreground transition-colors p-1"
            >
                <Home size={14} />
            </Link>

            {segments.map((segment, index) => {
                const href = `/${segments.slice(0, index + 1).join("/")}`;
                const isLast = index === segments.length - 1;
                const label = routeLabels[segment] || segment;

                if (segment === "admin" && index === 0) return null;

                return (
                    <div key={href} className="flex items-center space-x-2">
                        <ChevronRight size={12} className="text-muted-foreground/40" />
                        {isLast ? (
                            <span className="font-medium text-foreground">{label}</span>
                        ) : (
                            <Link
                                href={href}
                                className="hover:text-foreground transition-colors"
                            >
                                {label}
                            </Link>
                        )}
                    </div>
                );
            })}
        </nav>
    );
}

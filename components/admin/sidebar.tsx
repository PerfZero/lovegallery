"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Image, BookOpen, Settings, Package, LogOut, Inbox, ExternalLink, User } from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
    {
        title: "Дашборд",
        href: "/admin",
        icon: LayoutDashboard
    },
    {
        title: "Заявки",
        href: "/admin/requests",
        icon: Inbox
    },
    {
        title: "Каталог",
        href: "/admin/catalog",
        icon: Package
    },
    {
        title: "Галерея",
        href: "/admin/gallery",
        icon: Image
    },
    {
        title: "Блог",
        href: "/admin/blog",
        icon: BookOpen
    },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border/40 bg-white/50 backdrop-blur-xl transition-transform">
            <div className="flex h-full flex-col px-3 py-4">
                <div className="mb-8 flex flex-col px-3 gap-4">
                    <div className="flex items-center pl-3">
                        <span className="self-center text-xl font-display italic font-semibold text-foreground">
                            Beloved.Admin
                        </span>
                    </div>
                    <Link
                        href="/"
                        target="_blank"
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors bg-secondary/30 rounded-full border border-border/20 w-fit"
                    >
                        <ExternalLink size={12} />
                        Посмотреть сайт
                    </Link>
                </div>

                <ul className="space-y-2 font-medium flex-1">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "flex items-center rounded-lg p-3 text-muted-foreground transition-all hover:bg-secondary/50 hover:text-foreground group",
                                        isActive && "bg-secondary text-foreground font-medium"
                                    )}
                                >
                                    <Icon size={20} className={cn("transition-colors", isActive ? "text-accent" : "text-muted-foreground group-hover:text-accent")} />
                                    <span className="ml-3">{item.title}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                <div className="mt-auto pt-4 space-y-4">
                    {/* User Profile Info */}
                    <div className="px-3 border-t border-border/40 pt-6 mb-4">
                        <div className="flex items-center gap-3 p-2 rounded-xl bg-secondary/20">
                            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                                <User size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold truncate">Администратор</p>
                                <p className="text-[10px] text-muted-foreground truncate uppercase tracking-widest">Premium Access</p>
                            </div>
                        </div>
                    </div>

                    <ul className="space-y-2 font-medium px-3">
                        <li>
                            <Link
                                href="/admin/settings"
                                className={cn(
                                    "flex items-center rounded-lg p-3 text-muted-foreground transition-all hover:bg-secondary/50 hover:text-foreground group",
                                    pathname === "/admin/settings" && "bg-secondary text-foreground font-medium"
                                )}
                            >
                                <Settings size={20} className="transition-colors group-hover:text-accent" />
                                <span className="ml-3">Настройки</span>
                            </Link>
                        </li>
                        <li>
                            <button
                                className="flex w-full items-center rounded-lg p-3 text-muted-foreground transition-all hover:bg-red-50 hover:text-red-600 group"
                            >
                                <LogOut size={20} className="transition-colors group-hover:text-red-600" />
                                <span className="ml-3">Выйти</span>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </aside>
    );
}

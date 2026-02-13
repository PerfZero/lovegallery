"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Image,
  BookOpen,
  Settings,
  Package,
  LogOut,
  Inbox,
  ExternalLink,
  House,
  Info,
  HandCoins,
  CircleHelp,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    title: "Дашборд",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Заявки",
    href: "/admin/requests",
    icon: Inbox,
  },
  {
    title: "Главная",
    href: "/admin/home",
    icon: House,
  },
  {
    title: "Каталог",
    href: "/admin/catalog",
    icon: Package,
  },
  {
    title: "Галерея",
    href: "/admin/gallery",
    icon: Image,
  },
  {
    title: "Блог",
    href: "/admin/blog",
    icon: BookOpen,
  },
  {
    title: "О нас",
    href: "/admin/about",
    icon: Info,
  },
  {
    title: "Оплата и доставка",
    href: "/admin/payment-delivery",
    icon: HandCoins,
  },
  {
    title: "FAQ",
    href: "/admin/faq",
    icon: CircleHelp,
  },
  {
    title: "Каталог (страницы)",
    href: "/admin/catalog-content",
    icon: SlidersHorizontal,
  },
];

export function AdminSidebar({
  mobileOpen = false,
  onMobileClose,
}: {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/35 transition-opacity md:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onMobileClose}
      />
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen w-64 overflow-y-auto overscroll-contain border-r border-border/40 bg-white/85 backdrop-blur-xl transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0",
        )}
      >
        <div className="flex h-full min-h-0 flex-col px-3 py-4">
          <div className="mb-8 flex flex-col px-3 gap-4">
            <div className="flex items-center justify-between md:hidden">
              <span className="self-center text-lg font-display italic font-semibold text-foreground">
                Beloved.Admin
              </span>
              <button
                onClick={onMobileClose}
                className="h-8 w-8 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                aria-label="Закрыть меню"
              >
                <X size={18} />
              </button>
            </div>
            <div className="hidden md:flex items-center pl-3">
              <span className="self-center text-xl font-display italic font-semibold text-foreground">
                Beloved.Admin
              </span>
            </div>
            <Link
              href="/"
              target="_blank"
              onClick={onMobileClose}
              className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors bg-secondary/30 rounded-full border border-border/20 w-fit"
            >
              <ExternalLink size={12} />
              Посмотреть сайт
            </Link>
          </div>

          <ul className="space-y-2 font-medium flex-1 min-h-0 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onMobileClose}
                    className={cn(
                      "flex items-center rounded-lg p-3 text-muted-foreground transition-all hover:bg-secondary/50 hover:text-foreground group",
                      isActive && "bg-secondary text-foreground font-medium",
                    )}
                  >
                    <Icon
                      size={20}
                      className={cn(
                        "transition-colors",
                        isActive
                          ? "text-accent"
                          : "text-muted-foreground group-hover:text-accent",
                      )}
                    />
                    <span className="ml-3">{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-auto pt-4 space-y-4">
            {/* User Profile Info */}

            <ul className="space-y-2 font-medium px-3">
              <li>
                <Link
                  href="/admin/settings"
                  onClick={onMobileClose}
                  className={cn(
                    "flex items-center rounded-lg p-3 text-muted-foreground transition-all hover:bg-secondary/50 hover:text-foreground group",
                    pathname === "/admin/settings" &&
                      "bg-secondary text-foreground font-medium",
                  )}
                >
                  <Settings
                    size={20}
                    className="transition-colors group-hover:text-accent"
                  />
                  <span className="ml-3">Настройки</span>
                </Link>
              </li>
              <li>
                <button
                  onClick={async () => {
                    await fetch("/api/admin/logout", { method: "POST" });
                    onMobileClose?.();
                    router.push("/admin/login");
                    router.refresh();
                  }}
                  className="flex w-full items-center rounded-lg p-3 text-muted-foreground transition-all hover:bg-red-50 hover:text-red-600 group"
                >
                  <LogOut
                    size={20}
                    className="transition-colors group-hover:text-red-600"
                  />
                  <span className="ml-3">Выйти</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </aside>
    </>
  );
}

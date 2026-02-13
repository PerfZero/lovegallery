import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/db";
import { buildPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPageMetadata({
  title: "Технические работы",
  description: "Сайт временно недоступен из-за технических работ.",
  path: "/maintenance",
  noIndex: true,
});

export default function MaintenancePage() {
  const settings = getSiteSettings();

  return (
    <main className="min-h-screen bg-[#f5f3f0] text-[#2b2b2b] flex items-center justify-center px-6">
      <div className="max-w-2xl text-center space-y-6">
        <p className="text-xs tracking-[0.28em] uppercase text-[#8b7f73]">
          {settings.maintenance.brandLabel}
        </p>
        <h1 className="font-display italic text-4xl md:text-6xl leading-tight">
          {settings.maintenance.title}
        </h1>
        <p className="text-base md:text-lg text-[#5f5a53] leading-relaxed">
          {settings.maintenance.description}
        </p>
      </div>
    </main>
  );
}

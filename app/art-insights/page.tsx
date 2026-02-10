import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ArtInsightsFeed } from "@/components/features/art-insights/ArtInsightsFeed";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Арт-инсайты",
  description:
    "Читайте статьи о подборе искусства для интерьера, сочетании цветов, форматах работ и практических решениях, которые помогают осознанно выбрать произведение под ваш проект.",
  path: "/art-insights",
  image: "/images/art_insights_detail.webp",
  keywords: ["арт-инсайты", "искусство", "дизайн интерьера"],
});

export default function ArtInsightsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <ArtInsightsFeed />
      <Footer />
    </div>
  );
}

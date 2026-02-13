import type { Metadata } from "next";
import ProductContent from "./ProductContent";
import { catalogPageContent } from "@/data/catalog-page-content";
import { ensureCatalogSeeded } from "@/lib/catalog-seed";
import { getCatalogItemBySlug } from "@/lib/db";
import { buildPageMetadata } from "@/lib/seo";

type PageProps = {
  params: Promise<{ category: string; id: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category, id } = await params;
  const categoryTheme = catalogPageContent.categoryPages.find(
    (item) => item.id === category,
  );

  ensureCatalogSeeded();
  const item = getCatalogItemBySlug(id);

  if (!item || item.category !== category || item.status !== "active") {
    return buildPageMetadata({
      title: "Товар не найден",
      description:
        "Товар не найден, скрыт или уже недоступен. Перейдите в каталог категории, чтобы посмотреть актуальные позиции и отправить запрос на подбор аналога.",
      path: `/catalog/${category}/${id}`,
      noIndex: true,
      image: "/images/interior_catalog_aesthetic.webp",
    });
  }

  const descriptionParts = [
    item.description,
    item.artist ? `Автор: ${item.artist}.` : null,
    item.price ? `Цена: ${item.price}.` : null,
  ].filter(Boolean);

  const baseDescription = descriptionParts.join(" ");
  const fallbackDescription =
    categoryTheme?.headline ||
    "Товар из каталога галереи Любовь с подробными характеристиками.";
  const seoTitle = `${item.title} — ${categoryTheme?.navTitle || "товар для интерьера"}: цена, фото и характеристики`;

  return buildPageMetadata({
    title: seoTitle,
    description: baseDescription
      ? `${baseDescription} В карточке доступны дополнительные фото, параметры и форма запроса, чтобы быстро согласовать детали с менеджером.`
      : `${fallbackDescription} В карточке доступны фото, параметры и форма заявки для консультации по подбору под ваш интерьер.`,
    path: `/catalog/${category}/${id}`,
    image: item.image,
    keywords: [
      "каталог",
      "товар",
      categoryTheme?.navTitle || category,
      item.title,
    ],
  });
}

export default function Page() {
  return <ProductContent />;
}

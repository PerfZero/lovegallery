import type { Metadata } from "next";
import {
  CATALOG_CATEGORY_IDS,
  catalogPageContent,
} from "@/data/catalog-page-content";
import CategoryContent from "./CategoryContent";
import { buildPageMetadata } from "@/lib/seo";

type PageProps = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category } = await params;
  const pageTheme = catalogPageContent.categoryPages.find(
    (item) => item.id === category,
  );
  const listTheme = catalogPageContent.categories.find(
    (item) => item.id === category,
  );

  if (!pageTheme || !listTheme) {
    return buildPageMetadata({
      title: "Категория не найдена",
      description:
        "Категория каталога не найдена или была перемещена. Проверьте ссылку и вернитесь в общий каталог, чтобы выбрать доступные направления и актуальные товары.",
      path: `/catalog/${category}`,
      noIndex: true,
      image: "/images/interior_catalog_aesthetic.webp",
    });
  }

  return buildPageMetadata({
    title: pageTheme.navTitle,
    description: `${pageTheme.headline} В разделе вы найдете актуальные товары с детальными фото, описаниями, параметрами и возможностью получить консультацию по подбору под ваш интерьер.`,
    path: `/catalog/${category}`,
    image: "/images/interior_catalog_aesthetic.webp",
    keywords: [
      "каталог",
      "интерьерное искусство",
      listTheme.title.toLowerCase(),
    ],
  });
}

export async function generateStaticParams() {
  return CATALOG_CATEGORY_IDS.map((category) => ({
    category,
  }));
}

export default function Page() {
  return <CategoryContent />;
}

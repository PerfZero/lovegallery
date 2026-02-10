import type { Metadata } from "next";
import { categoryThemes } from "@/data/artworks";
import CategoryContent from "./CategoryContent";
import { buildPageMetadata } from "@/lib/seo";

type PageProps = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category } = await params;
  const theme = categoryThemes[category as keyof typeof categoryThemes];

  if (!theme) {
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
    title: theme.title,
    description: `${theme.subtitle} В разделе вы найдете актуальные товары с детальными фото, описаниями, параметрами и возможностью получить консультацию по подбору под ваш интерьер.`,
    path: `/catalog/${category}`,
    image: "/images/interior_catalog_aesthetic.webp",
    keywords: ["каталог", "интерьерное искусство", theme.title.toLowerCase()],
  });
}

export async function generateStaticParams() {
  return Object.keys(categoryThemes).map((category) => ({
    category: category,
  }));
}

export default function Page() {
  return <CategoryContent />;
}

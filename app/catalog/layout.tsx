import type { Metadata } from "next";
import { TransitionProvider } from "@/context/TransitionContext";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Каталог",
  description:
    "В каталоге собраны живопись, художественная фотография, текстиль, интерьерные коллекции и мебель для животных с фото, описаниями, характеристиками и возможностью отправить заявку.",
  path: "/catalog",
  image: "/images/interior_catalog_aesthetic.webp",
  keywords: ["каталог", "живопись", "фотография", "текстиль", "коллекции"],
});

export default function CatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TransitionProvider>{children}</TransitionProvider>;
}

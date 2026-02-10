import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "О нас",
  description:
    "Узнайте, как работает галерея Любовь: кураторский отбор работ, персональный подбор под интерьер, создание авторских коллекций и сопровождение проекта от идеи до размещения.",
  path: "/about",
  image: "/images/love_interior_emotion.webp",
  keywords: ["о галерее", "интерьерное искусство", "авторские коллекции"],
});

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

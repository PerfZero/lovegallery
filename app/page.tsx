import type { Metadata } from "next";
import { HomeScrollProvider } from "@/components/features/home/HomeScrollProvider";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Галерея интерьерного искусства",
  description:
    "Галерея Любовь помогает оформить интерьер искусством: подберем живопись, фотографию, текстиль и коллекции под стиль пространства, бюджет проекта и нужную атмосферу.",
  path: "/",
  image: "/images/love_interior_emotion.webp",
  keywords: [
    "интерьерное искусство",
    "галерея",
    "картины для интерьера",
    "декор",
  ],
});

export default function Home() {
  return <HomeScrollProvider />;
}

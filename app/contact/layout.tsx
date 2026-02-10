import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Контакты",
  description:
    "Свяжитесь с командой галереи Любовь, чтобы получить консультацию по подбору искусства, обсудить индивидуальный заказ, сроки производства, стоимость и удобный формат доставки.",
  path: "/contact",
  image: "/images/interior_services_studio.webp",
  keywords: ["контакты", "консультация", "заказ искусства"],
});

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

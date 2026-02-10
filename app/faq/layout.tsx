import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "FAQ",
  description:
    "Здесь собраны подробные ответы по заказу, оплате, доставке, срокам, возврату и уходу за работами, чтобы вы могли быстро принять решение и оформить покупку без лишних шагов.",
  path: "/faq",
  image: "/images/interior_services_studio.webp",
  keywords: ["faq", "доставка", "оплата", "возврат"],
});

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return children;
}

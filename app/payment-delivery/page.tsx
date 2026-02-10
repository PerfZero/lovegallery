import { Metadata } from "next";
import PaymentDeliveryContent from "./PaymentDeliveryContent";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Оплата и доставка",
  description:
    "Посмотрите условия оплаты и доставки: персональный сервис по Москве, безопасная отправка по России и миру, страхование произведений, контроль упаковки и поддержка на каждом этапе заказа.",
  path: "/payment-delivery",
  image: "/images/payment_delivery_luxury.webp",
  keywords: ["оплата", "доставка", "искусство", "DHL", "СДЭК"],
});

export default function PaymentDeliveryPage() {
  return <PaymentDeliveryContent />;
}

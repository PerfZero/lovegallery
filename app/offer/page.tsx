import type { Metadata } from "next";
import { DSContainer, DSHeading, DSText } from "@/components/ui/design-system";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Публичная оферта",
  description:
    "Публичная оферта галереи Любовь: правила оформления заказа, оплаты, доставки, возврата и юридические условия покупки товаров и услуг через сайт.",
  path: "/offer",
  image: "/images/love_interior_emotion.webp",
  keywords: ["публичная оферта", "условия покупки"],
});

export default function OfferPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="pt-32 pb-20">
        <DSContainer>
          <article className="max-w-3xl mx-auto">
            <DSHeading level="h1" className="text-3xl md:text-4xl mb-8">
              Публичная оферта
            </DSHeading>

            <DSText className="text-muted-foreground mb-8">
              Договор публичной оферты на оказание услуг и продажу товаров
            </DSText>

            <section className="space-y-8">
              <div>
                <h2 className="text-xl font-display italic mb-4">
                  1. Общие положения
                </h2>
                <p className="text-sm leading-relaxed text-foreground/80 mb-4">
                  1.1. Настоящий документ является официальным предложением
                  (публичной офертой) ИП Любовь (далее — «Продавец») и содержит
                  все существенные условия договора купли-продажи товаров и
                  оказания услуг.
                </p>
                <p className="text-sm leading-relaxed text-foreground/80">
                  1.2. В соответствии со статьей 437 ГК РФ, данное предложение
                  является публичной офертой. Акцептом оферты является
                  оформление заказа на сайте.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-display italic mb-4">
                  2. Предмет договора
                </h2>
                <p className="text-sm leading-relaxed text-foreground/80">
                  2.1. Продавец обязуется передать Покупателю товары (картины,
                  предметы интерьера, текстиль и другие изделия), а также
                  оказать сопутствующие услуги, а Покупатель обязуется принять и
                  оплатить товары и услуги на условиях настоящего договора.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-display italic mb-4">
                  3. Порядок оформления заказа
                </h2>
                <p className="text-sm leading-relaxed text-foreground/80 mb-4">
                  3.1. Покупатель оформляет заказ одним из способов:
                </p>
                <ul className="list-disc list-inside text-sm text-foreground/80 space-y-2">
                  <li>Через форму заказа на сайте</li>
                  <li>По телефону: +7 495 477-34-34</li>
                  <li>По электронной почте: order@lovegallery.ru</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-display italic mb-4">
                  4. Цена и оплата
                </h2>
                <p className="text-sm leading-relaxed text-foreground/80 mb-4">
                  4.1. Цены на товары указаны на сайте и могут быть изменены
                  Продавцом в одностороннем порядке. Цена товара на момент
                  оформления заказа является окончательной.
                </p>
                <p className="text-sm leading-relaxed text-foreground/80">
                  4.2. Оплата производится банковским переводом или наличными
                  при получении.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-display italic mb-4">
                  5. Доставка
                </h2>
                <p className="text-sm leading-relaxed text-foreground/80">
                  5.1. Доставка осуществляется по адресу, указанному Покупателем
                  при оформлении заказа. Сроки и стоимость доставки
                  согласовываются индивидуально.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-display italic mb-4">
                  6. Возврат и обмен
                </h2>
                <p className="text-sm leading-relaxed text-foreground/80">
                  6.1. Товары надлежащего качества, изготовленные по
                  индивидуальному заказу, возврату и обмену не подлежат. В
                  остальных случаях возврат возможен в течение 14 дней с момента
                  покупки.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-display italic mb-4">
                  7. Реквизиты Продавца
                </h2>
                <div className="text-sm text-foreground/80 space-y-1">
                  <p>ИП Любовь</p>
                  <p>ИНН: 7701234567</p>
                  <p>ОГРНИП: 1234567890123</p>
                  <p>Адрес: г. Москва, ул. Арбат, д. 1</p>
                  <p>
                    Email:{" "}
                    <a
                      href="mailto:order@lovegallery.ru"
                      className="text-accent hover:underline"
                    >
                      order@lovegallery.ru
                    </a>
                  </p>
                  <p>Телефон: +7 495 477-34-34</p>
                </div>
              </div>
            </section>
          </article>
        </DSContainer>
      </main>

      <Footer />
    </div>
  );
}

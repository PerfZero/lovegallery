import type { Metadata } from "next";
import { DSContainer, DSHeading, DSText } from "@/components/ui/design-system";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Политика конфиденциальности",
  description:
    "Официальная политика конфиденциальности галереи Любовь с описанием сбора, хранения и обработки персональных данных, прав пользователя и способов связи по вопросам защиты информации.",
  path: "/privacy",
  image: "/images/love_interior_emotion.webp",
  keywords: ["политика конфиденциальности", "персональные данные"],
});

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="pt-32 pb-20">
        <DSContainer>
          <article className="max-w-3xl mx-auto prose prose-neutral">
            <DSHeading level="h1" className="text-3xl md:text-4xl mb-8">
              Политика конфиденциальности
            </DSHeading>

            <DSText className="text-muted-foreground mb-8">
              Последнее обновление: 12 января 2026 г.
            </DSText>

            <section className="space-y-6">
              <div>
                <h2 className="text-xl font-display italic mb-4">
                  1. Общие положения
                </h2>
                <p className="text-sm leading-relaxed text-foreground/80">
                  Настоящая Политика конфиденциальности определяет порядок
                  обработки и защиты персональных данных пользователей сайта
                  lubov-art.ru (далее — «Сайт»), принадлежащего ИП Любовь (далее
                  — «Оператор»).
                </p>
              </div>

              <div>
                <h2 className="text-xl font-display italic mb-4">
                  2. Сбор персональных данных
                </h2>
                <p className="text-sm leading-relaxed text-foreground/80 mb-4">
                  Оператор собирает следующие персональные данные:
                </p>
                <ul className="list-disc list-inside text-sm text-foreground/80 space-y-2">
                  <li>Имя и фамилия</li>
                  <li>Номер телефона</li>
                  <li>Адрес электронной почты</li>
                  <li>Адрес доставки (при оформлении заказа)</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-display italic mb-4">
                  3. Цели обработки данных
                </h2>
                <p className="text-sm leading-relaxed text-foreground/80 mb-4">
                  Персональные данные обрабатываются в следующих целях:
                </p>
                <ul className="list-disc list-inside text-sm text-foreground/80 space-y-2">
                  <li>Обработка и выполнение заказов</li>
                  <li>Связь с клиентом по вопросам заказа</li>
                  <li>Предоставление консультаций</li>
                  <li>Улучшение качества обслуживания</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-display italic mb-4">
                  4. Защита данных
                </h2>
                <p className="text-sm leading-relaxed text-foreground/80">
                  Оператор принимает необходимые организационные и технические
                  меры для защиты персональных данных от неправомерного доступа,
                  уничтожения, изменения, блокирования, копирования и
                  распространения.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-display italic mb-4">
                  5. Права пользователя
                </h2>
                <p className="text-sm leading-relaxed text-foreground/80 mb-4">
                  Пользователь имеет право:
                </p>
                <ul className="list-disc list-inside text-sm text-foreground/80 space-y-2">
                  <li>Получить информацию об обработке своих данных</li>
                  <li>Требовать уточнения или удаления своих данных</li>
                  <li>Отозвать согласие на обработку данных</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-display italic mb-4">
                  6. Контактная информация
                </h2>
                <p className="text-sm leading-relaxed text-foreground/80">
                  По всем вопросам, связанным с обработкой персональных данных,
                  вы можете обратиться по адресу:{" "}
                  <a
                    href="mailto:order@lovegallery.ru"
                    className="text-accent hover:underline"
                  >
                    order@lovegallery.ru
                  </a>
                </p>
              </div>
            </section>
          </article>
        </DSContainer>
      </main>

      <Footer />
    </div>
  );
}

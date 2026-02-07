import { DSContainer, DSHeading, DSText } from "@/components/ui/design-system";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata = {
    title: "Реквизиты | Любовь",
    description: "Юридические реквизиты компании",
};

export default function LegalDetailsPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />

            <main className="pt-32 pb-20">
                <DSContainer>
                    <article className="max-w-3xl mx-auto">
                        <DSHeading level="h1" className="text-3xl md:text-4xl mb-8">
                            Реквизиты компании
                        </DSHeading>

                        <DSText className="text-muted-foreground mb-12">
                            Юридическая информация для заключения договоров и оплаты
                        </DSText>

                        <div className="grid gap-12 md:grid-cols-2">
                            {/* Основные реквизиты */}
                            <section className="space-y-6">
                                <h2 className="text-lg font-display italic border-b border-border pb-3">
                                    Основные реквизиты
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                                            Наименование
                                        </p>
                                        <p className="text-sm font-medium">ИП Любовь</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                                            ИНН
                                        </p>
                                        <p className="text-sm font-medium">7701234567</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                                            ОГРНИП
                                        </p>
                                        <p className="text-sm font-medium">1234567890123</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                                            ОКПО
                                        </p>
                                        <p className="text-sm font-medium">12345678</p>
                                    </div>
                                </div>
                            </section>

                            {/* Банковские реквизиты */}
                            <section className="space-y-6">
                                <h2 className="text-lg font-display italic border-b border-border pb-3">
                                    Банковские реквизиты
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                                            Банк
                                        </p>
                                        <p className="text-sm font-medium">ПАО Сбербанк</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                                            Расчетный счет
                                        </p>
                                        <p className="text-sm font-medium font-mono">40802810938000012345</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                                            Корр. счет
                                        </p>
                                        <p className="text-sm font-medium font-mono">30101810400000000225</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                                            БИК
                                        </p>
                                        <p className="text-sm font-medium font-mono">044525225</p>
                                    </div>
                                </div>
                            </section>

                            {/* Адрес */}
                            <section className="space-y-6">
                                <h2 className="text-lg font-display italic border-b border-border pb-3">
                                    Адрес
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                                            Юридический адрес
                                        </p>
                                        <p className="text-sm">
                                            119019, г. Москва, ул. Арбат, д. 1, офис 100
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                                            Фактический адрес
                                        </p>
                                        <p className="text-sm">
                                            119019, г. Москва, ул. Арбат, д. 1, офис 100
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Контакты */}
                            <section className="space-y-6">
                                <h2 className="text-lg font-display italic border-b border-border pb-3">
                                    Контакты
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                                            Телефон
                                        </p>
                                        <a href="tel:+79991234567" className="text-sm text-accent hover:underline">
                                            +7 (999) 123-45-67
                                        </a>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                                            Email
                                        </p>
                                        <a href="mailto:info@lubov-art.ru" className="text-sm text-accent hover:underline">
                                            info@lubov-art.ru
                                        </a>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                                            Режим работы
                                        </p>
                                        <p className="text-sm">Пн-Пт: 10:00 — 19:00</p>
                                    </div>
                                </div>
                            </section>
                        </div>

                        <div className="mt-16 p-6 bg-muted/30 rounded-lg">
                            <p className="text-xs text-muted-foreground">
                                Для получения счёта на оплату или заключения договора свяжитесь с нами
                                по телефону или электронной почте. Мы подготовим все необходимые документы.
                            </p>
                        </div>
                    </article>
                </DSContainer>
            </main>

            <Footer />
        </div>
    );
}

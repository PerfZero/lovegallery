"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { DSContainer, DSHeading, DSText } from "@/components/ui/design-system";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

interface FAQItem {
    question: string;
    answer: string;
    category: string;
}

const faqData: FAQItem[] = [
    // Заказ и оплата
    {
        category: "Заказ и оплата",
        question: "Как оформить заказ?",
        answer: "Выберите понравившееся произведение в каталоге, нажмите кнопку «Заказать» и заполните форму. Наш менеджер свяжется с вами для уточнения деталей в течение 2 часов в рабочее время."
    },
    {
        category: "Заказ и оплата",
        question: "Какие способы оплаты доступны?",
        answer: "Мы принимаем оплату банковскими картами Visa, Mastercard, МИР через защищённый платёжный шлюз Сбербанка. Также доступна оплата через SberPay и по безналичному расчёту для юридических лиц."
    },
    {
        category: "Заказ и оплата",
        question: "Могу ли я оплатить заказ при получении?",
        answer: "К сожалению, оплата при получении недоступна. Это связано с особенностями работы с произведениями искусства и необходимостью предварительной подготовки заказа."
    },
    // Доставка
    {
        category: "Доставка",
        question: "Сколько стоит доставка по Москве?",
        answer: "Доставка по Москве в пределах МКАД бесплатна при заказе от 10 000 ₽. За МКАД — от 500 ₽ в зависимости от удалённости. Доставку осуществляет специалист галереи."
    },
    {
        category: "Доставка",
        question: "Как осуществляется доставка в регионы?",
        answer: "Мы отправляем заказы по России и всему миру через DHL и СДЭК. Каждая работа упаковывается в индивидуальный деревянный короб (art-box) с полным страхованием груза."
    },
    {
        category: "Доставка",
        question: "Какие сроки доставки?",
        answer: "По Москве — 1-3 рабочих дня. По России — 3-14 дней в зависимости от региона. Международная доставка — от 5 до 21 дня."
    },
    // Товары
    {
        category: "Товары",
        question: "Все ли работы в каталоге — оригиналы?",
        answer: "В нашем каталоге представлены как оригинальные работы художников, так и авторские постеры и репродукции. Тип работы всегда указан в описании товара."
    },
    {
        category: "Товары",
        question: "Можно ли заказать картину на заказ?",
        answer: "Да, мы работаем с художниками и можем организовать создание работы по вашему заказу. Оставьте заявку, и наш арт-консультант свяжется с вами для обсуждения деталей."
    },
    {
        category: "Товары",
        question: "Как ухаживать за картиной?",
        answer: "Рекомендуем размещать работы вдали от прямых солнечных лучей и источников влаги. Для удаления пыли используйте мягкую сухую ткань. Подробные рекомендации прилагаются к каждому заказу."
    },
    // Возврат
    {
        category: "Возврат и гарантии",
        question: "Можно ли вернуть товар?",
        answer: "Да, вы можете вернуть товар в течение 14 дней с момента получения, если он не подошёл. Работа должна быть в оригинальной упаковке без следов использования."
    },
    {
        category: "Возврат и гарантии",
        question: "Что если товар повреждён при доставке?",
        answer: "Все наши отправления застрахованы. При обнаружении повреждения сразу свяжитесь с нами и сохраните упаковку. Мы организуем возврат и отправим новую работу или вернём деньги."
    },
];

const categories = [...new Set(faqData.map(item => item.category))];

function FAQAccordionItem({ item, isOpen, onToggle }: {
    item: FAQItem;
    isOpen: boolean;
    onToggle: () => void;
}) {
    return (
        <div className="border-b border-border/20">
            <button
                onClick={onToggle}
                className="w-full py-6 flex items-start justify-between gap-4 text-left group"
            >
                <span className="text-lg font-medium group-hover:text-accent transition-colors">
                    {item.question}
                </span>
                <ChevronDown
                    size={20}
                    className={`shrink-0 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                        }`}
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <p className="pb-6 text-muted-foreground leading-relaxed">
                            {item.answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const [activeCategory, setActiveCategory] = useState<string>("all");

    const filteredFAQ = activeCategory === "all"
        ? faqData
        : faqData.filter(item => item.category === activeCategory);

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />

            <main className="pt-28 pb-24">
                {/* Hero */}
                <section className="mb-16 md:mb-24">
                    <DSContainer>
                        {/* Breadcrumbs */}
                        <Breadcrumbs className="mb-8" />

                        <div className="max-w-3xl mx-auto text-center">

                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full mb-8">
                                <HelpCircle size={14} className="text-accent" />
                                <span className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium">
                                    Помощь
                                </span>
                            </div>

                            <DSHeading level="h1" className="text-4xl md:text-5xl lg:text-6xl mb-6">
                                Частые <span className="italic">вопросы</span>
                            </DSHeading>

                            <DSText className="text-lg text-muted-foreground">
                                Ответы на популярные вопросы о заказе, доставке и работе с нашей галереей
                            </DSText>
                        </div>
                    </DSContainer>
                </section>

                <DSContainer>
                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-3 justify-center mb-12">
                        <button
                            onClick={() => setActiveCategory("all")}
                            className={`px-5 py-2 text-[10px] uppercase tracking-[0.2em] border transition-all ${activeCategory === "all"
                                ? "bg-foreground text-background border-foreground"
                                : "border-border hover:border-accent hover:text-accent"
                                }`}
                        >
                            Все
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-5 py-2 text-[10px] uppercase tracking-[0.2em] border transition-all ${activeCategory === cat
                                    ? "bg-foreground text-background border-foreground"
                                    : "border-border hover:border-accent hover:text-accent"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* FAQ List */}
                    <div className="max-w-3xl mx-auto">
                        {filteredFAQ.map((item, index) => (
                            <FAQAccordionItem
                                key={index}
                                item={item}
                                isOpen={openIndex === index}
                                onToggle={() => setOpenIndex(openIndex === index ? null : index)}
                            />
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="max-w-2xl mx-auto mt-20 text-center p-12 bg-muted/30 rounded-lg">
                        <Sparkles size={32} className="text-accent mx-auto mb-6" />
                        <h3 className="text-2xl font-display italic mb-4">
                            Не нашли ответ?
                        </h3>
                        <p className="text-muted-foreground mb-8">
                            Свяжитесь с нами любым удобным способом, и мы с радостью поможем
                        </p>
                        <a
                            href="/contact"
                            className="inline-flex px-8 py-4 bg-foreground text-background text-[10px] uppercase tracking-[0.2em] font-semibold hover:bg-accent hover:text-foreground transition-all"
                        >
                            Связаться с нами
                        </a>
                    </div>
                </DSContainer>
            </main>

            <Footer />
        </div>
    );
}

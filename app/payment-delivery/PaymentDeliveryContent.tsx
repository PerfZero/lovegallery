"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import { DSContainer, DSHeading, DSText } from '@/components/ui/design-system';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ShieldCheck, Truck, Globe, CreditCard, Package, Clock, MapPin, CheckCircle2 } from 'lucide-react';

export default function PaymentDeliveryPage() {
    return (
        <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden">
            <Header />

            <main className="pt-28 pb-24">
                {/* Hero Section */}
                <section className="relative overflow-hidden mb-24 md:mb-32">
                    <DSContainer>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1 }}
                            className="max-w-5xl mx-auto text-center"
                        >
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full mb-8">
                                <Package size={14} className="text-accent" />
                                <span className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium">
                                    Сервис и Доставка
                                </span>
                            </div>

                            <DSHeading level="h1" className="text-5xl md:text-6xl lg:text-7xl font-light leading-[1.1] mb-8">
                                <span className="italic">Искусство требует.</span>
                                <br />
                                <span className="text-accent">Заботу мы берём на себя.</span>
                            </DSHeading>

                            <DSText size="lg" className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                                Мы создали сервис, который делает процесс приобретения искусства таким же вдохновляющим, как и само произведение.
                            </DSText>
                        </motion.div>
                    </DSContainer>

                    {/* Decorative Elements */}
                    <div className="absolute top-1/2 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
                    <div className="absolute top-1/2 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                </section>

                <DSContainer>
                    {/* Features Grid */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32"
                    >
                        {[
                            { icon: Truck, title: "Бесплатная доставка", desc: "По Москве в пределах МКАД" },
                            { icon: ShieldCheck, title: "Страхование", desc: "100% защита груза" },
                            { icon: Clock, title: "Точные сроки", desc: "Согласованный интервал" },
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="text-center p-8 border border-border/10 hover:border-accent/30 transition-colors group"
                            >
                                <div className="w-16 h-16 mx-auto mb-6 bg-accent/5 rounded-full flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                                    <item.icon size={24} className="text-accent" strokeWidth={1.5} />
                                </div>
                                <h3 className="font-display text-lg italic mb-2">{item.title}</h3>
                                <p className="text-sm text-muted-foreground">{item.desc}</p>
                            </div>
                        ))}
                    </motion.section>

                    {/* Section 1: Concierge Service */}
                    <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center mb-32 lg:mb-48">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                            className="relative aspect-[4/5] overflow-hidden order-2 lg:order-1"
                        >
                            <Image
                                src="/images/white_glove_service_1767629664547.webp"
                                alt="Персональный сервис"
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-cover"
                            />
                            {/* Overlay gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                            {/* Badge */}
                            <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/90 backdrop-blur-sm">
                                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">Москва и МО</p>
                                <p className="text-sm font-medium">Бесплатная доставка от 10 000 ₽</p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="space-y-8 order-1 lg:order-2"
                        >
                            <span className="inline-block px-4 py-2 bg-accent text-accent-foreground text-[9px] uppercase tracking-[0.2em] font-semibold">
                                Москва и область
                            </span>

                            <h2 className="text-4xl md:text-5xl font-display italic leading-tight">
                                Персональный<br />консьерж-сервис
                            </h2>

                            <DSText className="text-muted-foreground leading-loose text-lg">
                                Для наших клиентов в Москве мы исключили безликие курьерские службы. Ваш заказ доставит специалист галереи, который знает, как обращаться с искусством.
                            </DSText>

                            <ul className="space-y-4">
                                {[
                                    "Согласуем удобный часовой интервал",
                                    "Поможем с распаковкой и примеркой",
                                    "Консультация по размещению на месте"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <CheckCircle2 size={16} className="text-accent shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </section>

                    {/* Section 2: Global Logistics */}
                    <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center mb-32 lg:mb-48">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                            className="space-y-8"
                        >
                            <span className="inline-block px-4 py-2 bg-foreground text-background text-[9px] uppercase tracking-[0.2em] font-semibold">
                                Россия и Мир
                            </span>

                            <h2 className="text-4xl md:text-5xl font-display italic leading-tight">
                                Безопасная<br />логистика
                            </h2>

                            <DSText className="text-muted-foreground leading-loose text-lg">
                                Расстояние не имеет значения. Мы сотрудничаем с DHL и СДЭК, обеспечивая полное страхование груза. Каждая картина упаковывается в индивидуальный деревянный короб (art-box).
                            </DSText>

                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { label: "Защита от влаги", icon: ShieldCheck },
                                    { label: "Температурный контроль", icon: Globe },
                                    { label: "Амортизация ударов", icon: Package },
                                    { label: "Трекинг 24/7", icon: MapPin },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                                        <item.icon size={18} className="text-accent shrink-0" />
                                        <span className="text-xs">{item.label}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-4 pt-4">
                                <div className="px-6 py-3 border border-border rounded-full text-xs uppercase tracking-widest">DHL Express</div>
                                <div className="px-6 py-3 border border-border rounded-full text-xs uppercase tracking-widest">СДЭК</div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="relative aspect-square lg:aspect-[5/4] overflow-hidden bg-[#f5f3f0]"
                        >
                            <Image
                                src="/images/art_packaging_premium.webp"
                                alt="Премиум упаковка для искусства"
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-cover"
                            />
                        </motion.div>
                    </section>

                    {/* Section 3: Safe Payment */}
                    <section className="relative py-24 mb-16">
                        {/* Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-muted/30 to-accent/5 -mx-6 md:-mx-12" />

                        <div className="relative max-w-4xl mx-auto text-center">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="space-y-8"
                            >
                                <div className="w-20 h-20 mx-auto bg-accent/10 rounded-full flex items-center justify-center">
                                    <CreditCard strokeWidth={1} size={36} className="text-accent" />
                                </div>

                                <h2 className="text-4xl md:text-5xl font-display italic">Прозрачность сделки</h2>

                                <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                                    Мы ценим ваше доверие, поэтому работаем только официально. Оплата производится через защищенный шлюз Сбербанка без комиссий. Вы получаете электронный чек и договор-оферту сразу после транзакции.
                                </p>

                                {/* Payment Methods - Consistent Card Grid */}
                                <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                                    {/* Visa */}
                                    <motion.div
                                        whileHover={{ y: -4, borderColor: 'rgb(var(--foreground) / 0.2)' }}
                                        className="h-24 md:h-28 bg-white/50 backdrop-blur-sm border border-border/30 rounded-xl flex items-center justify-center p-6 grayscale hover:grayscale-0 transition-all duration-700 opacity-70 hover:opacity-100 group shadow-sm hover:shadow-md"
                                    >
                                        <img src="/images/payments/visa.webp" alt="Visa" className="h-8 md:h-10 w-full object-contain" />
                                    </motion.div>

                                    {/* Mastercard */}
                                    <motion.div
                                        whileHover={{ y: -4, borderColor: 'rgb(var(--foreground) / 0.2)' }}
                                        className="h-24 md:h-28 bg-white/50 backdrop-blur-sm border border-border/30 rounded-xl flex items-center justify-center p-6 grayscale hover:grayscale-0 transition-all duration-700 opacity-70 hover:opacity-100 group shadow-sm hover:shadow-md"
                                    >
                                        <img src="/images/payments/mastercard.webp" alt="Mastercard" className="h-8 md:h-10 w-full object-contain" />
                                    </motion.div>

                                    {/* МИР */}
                                    <motion.div
                                        whileHover={{ y: -4, borderColor: 'rgb(var(--foreground) / 0.2)' }}
                                        className="h-24 md:h-28 bg-white/50 backdrop-blur-sm border border-border/30 rounded-xl flex items-center justify-center p-6 grayscale hover:grayscale-0 transition-all duration-700 opacity-70 hover:opacity-100 group shadow-sm hover:shadow-md"
                                    >
                                        <img src="/images/payments/mir.webp" alt="МИР" className="h-8 md:h-10 w-full object-contain" />
                                    </motion.div>

                                    {/* SberPay */}
                                    <motion.div
                                        whileHover={{ y: -4, borderColor: 'rgb(var(--foreground) / 0.2)' }}
                                        className="h-24 md:h-28 bg-white/50 backdrop-blur-sm border border-border/30 rounded-xl flex items-center justify-center p-6 grayscale hover:grayscale-0 transition-all duration-700 opacity-70 hover:opacity-100 group shadow-sm hover:shadow-md"
                                    >
                                        <img src="/images/payments/sberpay.webp" alt="SberPay" className="h-8 md:h-10 w-full object-contain" />
                                    </motion.div>
                                </div>



                                {/* Trust badges */}
                                <div className="flex flex-wrap justify-center gap-6 pt-8 text-muted-foreground">
                                    <div className="flex items-center gap-2 text-sm">
                                        <ShieldCheck size={16} className="text-accent" />
                                        <span>SSL-шифрование</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <CheckCircle2 size={16} className="text-accent" />
                                        <span>PCI DSS сертификат</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </section>
                </DSContainer>
            </main>

            <Footer />
        </div>
    );
}

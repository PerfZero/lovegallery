"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { DSContainer, DSHeading, DSText } from "@/components/ui/design-system";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  ShieldCheck,
  Truck,
  Globe,
  CreditCard,
  Package,
  Clock,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import {
  paymentDeliveryContent,
  type PaymentDeliveryContentData,
} from "@/data/payment-delivery-content";
import { isPaymentDeliveryContent } from "@/lib/payment-delivery-content";

const FEATURE_ICONS = [Truck, ShieldCheck, Clock];
const LOGISTICS_ICONS = [ShieldCheck, Globe, Package, MapPin];
const TRUST_ICONS = [ShieldCheck, CheckCircle2];

export default function PaymentDeliveryPage() {
  const [content, setContent] = useState<PaymentDeliveryContentData>(
    paymentDeliveryContent,
  );
  const { hero, features, concierge, logistics, payment } = content;

  useEffect(() => {
    let mounted = true;
    fetch("/api/payment-delivery", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        if (isPaymentDeliveryContent(data?.item)) {
          setContent(data.item);
        }
      })
      .catch(() => {
        // keep fallback content
      });

    return () => {
      mounted = false;
    };
  }, []);

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
                  {hero.badge}
                </span>
              </div>

              <DSHeading
                level="h1"
                className="text-5xl md:text-6xl lg:text-7xl font-light leading-[1.1] mb-8"
              >
                <span className="italic">{hero.titlePrimary}</span>
                <br />
                <span className="text-accent">{hero.titleAccent}</span>
              </DSHeading>

              <DSText
                size="lg"
                className="text-muted-foreground max-w-2xl mx-auto leading-relaxed"
              >
                {hero.description}
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
            {features.map((item, index) => {
              const Icon = FEATURE_ICONS[index % FEATURE_ICONS.length];
              return (
                <div
                  key={`${item.title}-${index}`}
                  className="text-center p-8 border border-border/10 hover:border-accent/30 transition-colors group"
                >
                  <div className="w-16 h-16 mx-auto mb-6 bg-accent/5 rounded-full flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                    <Icon size={24} className="text-accent" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-display text-lg italic mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              );
            })}
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
                src={concierge.image}
                alt="Персональный сервис"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/90 backdrop-blur-sm">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
                  {concierge.imageBadge.kicker}
                </p>
                <p className="text-sm font-medium">{concierge.imageBadge.text}</p>
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
                {concierge.badge}
              </span>

              <h2 className="text-4xl md:text-5xl font-display italic leading-tight">
                {concierge.titlePrimary}
                <br />
                {concierge.titleAccent}
              </h2>

              <DSText className="text-muted-foreground leading-loose text-lg">
                {concierge.description}
              </DSText>

              <ul className="space-y-4">
                {concierge.bullets.map((item, i) => (
                  <li key={`${item}-${i}`} className="flex items-center gap-3 text-sm">
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
                {logistics.badge}
              </span>

              <h2 className="text-4xl md:text-5xl font-display italic leading-tight">
                {logistics.titlePrimary}
                <br />
                {logistics.titleAccent}
              </h2>

              <DSText className="text-muted-foreground leading-loose text-lg">
                {logistics.description}
              </DSText>

              <div className="grid grid-cols-2 gap-4">
                {logistics.highlights.map((item, i) => {
                  const Icon = LOGISTICS_ICONS[i % LOGISTICS_ICONS.length];
                  return (
                    <div
                      key={`${item}-${i}`}
                      className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg"
                    >
                      <Icon size={18} className="text-accent shrink-0" />
                      <span className="text-xs">{item}</span>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-4 pt-4">
                {logistics.partners.map((partner, i) => (
                  <div
                    key={`${partner}-${i}`}
                    className="px-6 py-3 border border-border rounded-full text-xs uppercase tracking-widest"
                  >
                    {partner}
                  </div>
                ))}
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
                src={logistics.image}
                alt="Премиум упаковка для искусства"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </motion.div>
          </section>

          {/* Section 3: Safe Payment */}
          <section className="relative py-24 mb-16">
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

                <h2 className="text-4xl md:text-5xl font-display italic">
                  {payment.title}
                </h2>

                <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                  {payment.description}
                </p>

                <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  {payment.logos.map((logo, index) => (
                    <motion.div
                      key={`${logo.name}-${index}`}
                      whileHover={{
                        y: -4,
                        borderColor: "rgb(var(--foreground) / 0.2)",
                      }}
                      className="h-24 md:h-28 bg-white/50 backdrop-blur-sm border border-border/30 rounded-xl flex items-center justify-center p-6 grayscale hover:grayscale-0 transition-all duration-700 opacity-70 hover:opacity-100 group shadow-sm hover:shadow-md"
                    >
                      <img
                        src={logo.image}
                        alt={logo.alt}
                        className="h-8 md:h-10 w-full object-contain"
                      />
                    </motion.div>
                  ))}
                </div>

                <div className="flex flex-wrap justify-center gap-6 pt-8 text-muted-foreground">
                  {payment.trustBadges.map((badge, i) => {
                    const Icon = TRUST_ICONS[i % TRUST_ICONS.length];
                    return (
                      <div key={`${badge}-${i}`} className="flex items-center gap-2 text-sm">
                        <Icon size={16} className="text-accent" />
                        <span>{badge}</span>
                      </div>
                    );
                  })}
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

"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { DSContainer, DSHeading, DSText } from "@/components/ui/design-system";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { faqContent, type FAQContentData, type FAQItem } from "@/data/faq-content";
import { isFAQContent } from "@/lib/faq-content";

function FAQAccordionItem({
  item,
  isOpen,
  onToggle,
}: {
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
          className={`shrink-0 text-muted-foreground transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
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
  const [content, setContent] = useState<FAQContentData>(faqContent);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  useEffect(() => {
    let mounted = true;
    fetch("/api/faq", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        if (isFAQContent(data?.item)) {
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

  const categories = useMemo(() => {
    if (content.categories.length > 0) {
      return content.categories;
    }
    return Array.from(
      new Set(content.items.map((item) => item.category).filter(Boolean)),
    );
  }, [content.categories, content.items]);

  const effectiveCategory =
    activeCategory === "all" || categories.includes(activeCategory)
      ? activeCategory
      : "all";

  const filteredFAQ =
    effectiveCategory === "all"
      ? content.items
      : content.items.filter((item) => item.category === effectiveCategory);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="pt-28 pb-24">
        <section className="mb-16 md:mb-24">
          <DSContainer>
            <Breadcrumbs className="mb-8" />

            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full mb-8">
                <HelpCircle size={14} className="text-accent" />
                <span className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium">
                  {content.hero.badge}
                </span>
              </div>

              <DSHeading
                level="h1"
                className="text-4xl md:text-5xl lg:text-6xl mb-6"
              >
                {content.hero.titlePrimary}{" "}
                <span className="italic">{content.hero.titleAccent}</span>
              </DSHeading>

              <DSText className="text-lg text-muted-foreground">
                {content.hero.description}
              </DSText>
            </div>
          </DSContainer>
        </section>

        <DSContainer>
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            <button
              onClick={() => {
                setActiveCategory("all");
                setOpenIndex(0);
              }}
              className={`px-5 py-2 text-[10px] uppercase tracking-[0.2em] border transition-all ${
                effectiveCategory === "all"
                  ? "bg-foreground text-background border-foreground"
                  : "border-border hover:border-accent hover:text-accent"
              }`}
            >
              Все
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setActiveCategory(category);
                  setOpenIndex(0);
                }}
                className={`px-5 py-2 text-[10px] uppercase tracking-[0.2em] border transition-all ${
                  effectiveCategory === category
                    ? "bg-foreground text-background border-foreground"
                    : "border-border hover:border-accent hover:text-accent"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="max-w-3xl mx-auto">
            {filteredFAQ.map((item, index) => (
              <FAQAccordionItem
                key={`${item.question}-${index}`}
                item={item}
                isOpen={openIndex === index}
                onToggle={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
              />
            ))}
          </div>

          <div className="max-w-2xl mx-auto mt-20 text-center p-12 bg-muted/30 rounded-lg">
            <Sparkles size={32} className="text-accent mx-auto mb-6" />
            <h3 className="text-2xl font-display italic mb-4">
              {content.cta.title}
            </h3>
            <p className="text-muted-foreground mb-8">
              {content.cta.description}
            </p>
            <Link
              href={content.cta.buttonHref || "/contact"}
              className="inline-flex px-8 py-4 bg-foreground text-background text-[10px] uppercase tracking-[0.2em] font-semibold hover:bg-accent hover:text-foreground transition-all"
            >
              {content.cta.buttonLabel}
            </Link>
          </div>
        </DSContainer>
      </main>

      <Footer />
    </div>
  );
}

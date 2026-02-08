"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { DSContainer, DSHeading, DSText } from "@/components/ui/design-system";
import { ArrowRight, Calendar, Clock, Sparkles } from "lucide-react";
import { NewsletterForm } from "@/components/ui/NewsletterForm";

type FeedArticle = {
  id: number;
  slug: string;
  title: string;
  subtitle?: string | null;
  excerpt?: string | null;
  category?: string | null;
  date?: string | null;
  readTime?: string | null;
  image?: string | null;
};

export const ArtInsightsFeed = () => {
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [articles, setArticles] = useState<FeedArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch("/api/blog", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        const raw = Array.isArray(data.items) ? data.items : [];
        setArticles(
          raw.map((item: any) => ({
            id: item.id,
            slug: item.slug,
            title: item.title,
            subtitle: item.subtitle,
            excerpt: item.excerpt || item.subtitle || "",
            category: item.category,
            date: item.date,
            readTime: item.read_time || item.readTime,
            image: item.image,
          })),
        );
      })
      .catch(() => {
        if (!mounted) return;
        setArticles([]);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    articles.forEach((a) => a.category && set.add(a.category));
    return ["Все", ...Array.from(set)];
  }, [articles]);

  const filteredArticles = articles.filter((article) => {
    if (selectedCategory === "Все") return true;
    return article.category === selectedCategory;
  });

  const featuredArticle = articles[0];
  const showFeatured =
    !!featuredArticle &&
    (selectedCategory === "Все" ||
      featuredArticle.category === selectedCategory);

  const displayArticles =
    selectedCategory === "Все"
      ? articles.slice(1)
      : articles.filter((a) => a.category === selectedCategory);

  return (
    <main className="pt-28 pb-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden mb-20">
        <DSContainer>
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge/Label */}
            <div className="inline-flex items-center gap-2 mb-8">
              <Sparkles size={14} className="text-accent" />
              <span className="text-[11px] md:text-xs uppercase tracking-[0.2em] text-accent font-medium">
                На одном языке с искусством: что, где, как и зачем вам это нужно
                знать!
              </span>
            </div>

            {/* Title */}
            <DSHeading
              level="h1"
              className="text-5xl md:text-6xl lg:text-7xl mb-6"
            >
              <span className="block">Арт-</span>
              <span className="italic font-light">инсайты</span>
            </DSHeading>

            {/* Subtitle */}
            <DSText className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Погружаемся в мир искусства. Статьи о живописи, фотографии,
              интерьерном дизайне и тонкостях выбора произведений для вашего
              пространства.
            </DSText>
          </div>
        </DSContainer>

        {/* Decorative Elements */}
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      </section>

      <DSContainer>
        {/* Featured Article - only show if appropriate */}
        {loading && (
          <section className="mb-20 text-center text-sm text-muted-foreground">
            Загрузка статей...
          </section>
        )}

        {!loading && showFeatured && (
          <section className="mb-20">
            <FeaturedArticle article={featuredArticle} />
          </section>
        )}

        {/* Category Filter */}
        <section className="mb-12">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category, index) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2 text-[10px] uppercase tracking-[0.2em] border transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-foreground text-background border-foreground"
                    : "border-border hover:border-accent hover:text-accent"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* Articles Grid */}
        <section className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {displayArticles.map((article, index) => (
              <ArticleCard key={article.id} article={article} index={index} />
            ))}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="relative overflow-hidden">
          <div className="bg-gradient-to-br from-muted/50 to-accent/10 p-12 md:p-20 text-center">
            <div className="max-w-2xl mx-auto">
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4">
                Не пропустите новые статьи
              </p>
              <h2 className="font-display text-3xl md:text-4xl italic mb-6">
                Подпишитесь на рассылку
              </h2>
              <p className="text-muted-foreground mb-8">
                Получайте лучшие материалы об искусстве и дизайне интерьера
                прямо на почту
              </p>
              <NewsletterForm />
            </div>
          </div>
        </section>
      </DSContainer>
    </main>
  );
};

// Featured Article Component
function FeaturedArticle({ article }: { article: FeedArticle }) {
  return (
    <Link href={`/art-insights/${article.slug}`} className="group block">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={article.image || "/images/gallery-1.webp"}
            alt={article.title}
            className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Featured Badge */}
          <div className="absolute top-6 left-6">
            <span className="px-4 py-2 bg-accent text-accent-foreground text-[9px] uppercase tracking-[0.2em] font-semibold">
              Рекомендуем
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="lg:pr-8">
          {/* Category */}
          <span className="text-[10px] uppercase tracking-[0.2em] text-accent mb-4 block">
            {article.category || "Арт-инсайт"}
          </span>

          {/* Title */}
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl italic mb-6 group-hover:text-accent transition-colors duration-300 leading-tight">
            {article.title}
          </h2>

          {/* Excerpt */}
          <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
            {article.excerpt || article.subtitle || ""}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-6 text-[11px] text-muted-foreground mb-8">
            <span className="flex items-center gap-2">
              <Calendar size={14} />
              {article.date}
            </span>
            <span className="flex items-center gap-2">
              <Clock size={14} />
              {article.readTime || "—"} чтения
            </span>
          </div>

          {/* CTA */}
          <div className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.2em] font-semibold group-hover:text-accent transition-colors">
            Читать статью
            <ArrowRight
              size={16}
              className="group-hover:translate-x-2 transition-transform duration-300"
            />
          </div>
        </div>
      </div>
    </Link>
  );
}

// Article Card Component
interface ArticleCardProps {
  article: FeedArticle;
  index: number;
}

function ArticleCard({ article, index }: ArticleCardProps) {
  return (
    <article className="group" style={{ animationDelay: `${index * 100}ms` }}>
      <Link href={`/art-insights/${article.slug}`} className="block">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden mb-6">
          <img
            src={article.image || "/images/gallery-1.webp"}
            alt={article.title}
            className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
          />

          {/* Category Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
            <span className="text-[9px] uppercase tracking-[0.2em] text-white/90">
              {article.category || "Арт-инсайт"}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {/* Title */}
          <h3 className="font-display text-xl md:text-2xl italic group-hover:text-accent transition-colors duration-300 line-clamp-2 leading-snug">
            {article.title}
          </h3>

          {/* Excerpt */}
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {article.excerpt || article.subtitle || ""}
          </p>

          {/* Meta & CTA */}
          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {article.readTime || "—"}
              </span>
            </div>

            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-accent opacity-0 group-hover:opacity-100 transition-all duration-300">
              Читать
              <ArrowRight
                size={12}
                className="group-hover:translate-x-1 transition-transform"
              />
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}

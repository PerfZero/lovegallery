import type { Metadata } from "next";
import Link from "next/link";
import { DSContainer, DSHeading, DSText } from "@/components/ui/design-system";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ArrowLeft, Calendar, Clock, Share2 } from "lucide-react";
import { ShareSection } from "@/components/features/art-insights/ShareSection";
import { BackButton } from "@/components/ui/BackButton";
import { getBlogPostBySlug, listBlogPosts } from "@/lib/db";
import { ensureBlogSeeded } from "@/lib/blog-seed";
import { buildPageMetadata } from "@/lib/seo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

type ArticleMetaRow = {
  title: string;
  excerpt: string | null;
  subtitle: string | null;
  image: string | null;
  category: string | null;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  ensureBlogSeeded();
  const article = getBlogPostBySlug(slug) as ArticleMetaRow | undefined;

  if (!article) {
    return buildPageMetadata({
      title: "Статья не найдена",
      description:
        "Статья не найдена или была перенесена. Перейдите в раздел Арт-инсайты, чтобы открыть актуальные материалы о подборе искусства и интерьерных решениях.",
      path: `/art-insights/${slug}`,
      noIndex: true,
      image: "/images/art_insights_detail.webp",
    });
  }

  const baseDescription =
    article.excerpt ||
    article.subtitle ||
    "Статья из раздела Арт-инсайты галереи Любовь.";
  const keywords = [
    "арт-инсайты",
    "искусство",
    "дизайн интерьера",
    article.category,
  ].filter((value): value is string => Boolean(value));

  return buildPageMetadata({
    title: article.title,
    description: `${baseDescription} В материале собраны практические рекомендации и примеры, которые помогут выбрать искусство под стиль и задачи вашего пространства.`,
    path: `/art-insights/${slug}`,
    image: article.image || "/images/art_insights_detail.webp",
    type: "article",
    keywords,
  });
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  ensureBlogSeeded();
  const articleRow = getBlogPostBySlug(slug) as any;
  const article = articleRow
    ? {
        ...articleRow,
        readTime: (articleRow as any).read_time || (articleRow as any).readTime,
      }
    : null;

  if (!article) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="pt-32 pb-20">
          <DSContainer>
            <div className="text-center">
              <h1 className="font-display text-3xl italic mb-4">
                Статья не найдена
              </h1>
              <Link
                href="/art-insights"
                className="text-accent hover:underline"
              >
                Вернуться к статьям
              </Link>
            </div>
          </DSContainer>
        </main>
        <Footer />
      </div>
    );
  }

  const relatedArticles = listBlogPosts(3)
    .filter((p: any) => p.slug !== slug)
    .slice(0, 3)
    .map((p: any) => ({
      slug: p.slug,
      title: p.title,
      category: p.category,
      image: p.image,
    }));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
          {/* Background Image */}
          <img
            src={article.image || "/images/gallery-1.webp"}
            alt={article.title}
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

          {/* Content */}
          <DSContainer className="relative h-full flex flex-col justify-end pb-16 md:pb-24">
            {/* Back Link */}
            <div className="absolute top-32 left-6 md:left-12 lg:left-16">
              <BackButton
                label="Вернуться назад"
                className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white hover:text-white transition-colors group px-3 py-2 bg-black/20 backdrop-blur-md rounded-sm border border-white/10"
              />
            </div>

            {/* Article Info */}
            <div className="max-w-4xl">
              {/* Category */}
              <span className="inline-block px-4 py-2 bg-accent text-accent-foreground text-[9px] uppercase tracking-[0.2em] font-semibold mb-6">
                {article.category || "Арт-инсайт"}
              </span>

              {/* Title */}
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white italic mb-8 leading-tight drop-shadow-md">
                {article.title}
              </h1>

              {article.subtitle && (
                <p className="text-white/85 text-lg md:text-xl mb-6 max-w-3xl">
                  {article.subtitle}
                </p>
              )}

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-white/90 drop-shadow-sm">
                <span className="flex items-center gap-2">
                  <Calendar size={14} />
                  {article.date}
                </span>
                <span className="flex items-center gap-2">
                  <Clock size={14} />
                  {article.readTime || "—"} чтения
                </span>
              </div>
            </div>
          </DSContainer>
        </section>

        {/* Article Content */}
        <section className="py-16 md:py-24">
          <DSContainer>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
              {/* Main Content */}
              <article className="lg:col-span-8">
                {/* Lead Paragraph */}
                {(article.excerpt || article.subtitle) && (
                  <p className="text-xl md:text-2xl text-foreground/80 leading-relaxed mb-12 font-light">
                    {article.excerpt || article.subtitle}
                  </p>
                )}

                {/* Divider */}
                <div className="flex items-center gap-4 mb-12">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-accent text-lg">✦</span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                {/* Article Body */}
                <div className="prose-custom">
                  {(() => {
                    let blocks: any[] | null = null;
                    if (article.content_json) {
                      try {
                        blocks = JSON.parse(article.content_json);
                      } catch {
                        blocks = null;
                      }
                    }

                    if (blocks && Array.isArray(blocks)) {
                      return blocks.map((block, index) => {
                        if (block.type === "heading") {
                          return (
                            <h2
                              key={index}
                              className="text-2xl md:text-3xl font-display italic mt-16 mb-8 text-foreground"
                            >
                              {block.text}
                            </h2>
                          );
                        }
                        if (block.type === "list") {
                          return (
                            <ul key={index} className="ml-6 mb-6 list-disc">
                              {(block.items || []).map(
                                (item: string, i: number) => (
                                  <li
                                    key={i}
                                    className="text-foreground/80 mb-2"
                                  >
                                    {item}
                                  </li>
                                ),
                              )}
                            </ul>
                          );
                        }
                        return (
                          <p
                            key={index}
                            className="text-lg text-foreground/80 leading-relaxed mb-6"
                          >
                            {block.text}
                          </p>
                        );
                      });
                    }

                    const contentText = article.content_text || "";
                    if (/<[^>]+>/.test(contentText)) {
                      return (
                        <div
                          dangerouslySetInnerHTML={{ __html: contentText }}
                        />
                      );
                    }

                    return contentText
                      .split("\n")
                      .map((paragraph: string, index: number) => {
                        if (paragraph.startsWith("## ")) {
                          return (
                            <h2
                              key={index}
                              className="text-2xl md:text-3xl font-display italic mt-16 mb-8 text-foreground"
                            >
                              {paragraph.replace("## ", "")}
                            </h2>
                          );
                        }
                        if (
                          paragraph.startsWith("**") &&
                          paragraph.endsWith("**")
                        ) {
                          return (
                            <p
                              key={index}
                              className="text-lg font-medium mt-8 mb-4 text-foreground"
                            >
                              {paragraph.replace(/\*\*/g, "")}
                            </p>
                          );
                        }
                        if (paragraph.startsWith("- ")) {
                          return (
                            <li
                              key={index}
                              className="text-foreground/80 ml-6 mb-2 list-disc"
                            >
                              {paragraph.replace("- ", "")}
                            </li>
                          );
                        }
                        if (paragraph.trim()) {
                          return (
                            <p
                              key={index}
                              className="text-lg text-foreground/80 leading-relaxed mb-6"
                            >
                              {paragraph}
                            </p>
                          );
                        }
                        return null;
                      });
                  })()}
                </div>

                {/* Tags */}
                <div className="mt-16 pt-8 border-t border-border">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-4">
                    Теги
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-4 py-2 bg-muted text-xs">
                      {article.category}
                    </span>
                    <span className="px-4 py-2 bg-muted text-xs">
                      Искусство
                    </span>
                    <span className="px-4 py-2 bg-muted text-xs">Интерьер</span>
                  </div>
                </div>
              </article>

              {/* Sidebar */}
              <aside className="lg:col-span-4">
                <div className="lg:sticky lg:top-32 space-y-8">
                  {/* Share */}
                  <ShareSection title={article.title} />

                  {/* CTA Card */}
                  <div className="p-8 bg-gradient-to-br from-accent/10 to-muted/30">
                    <p className="font-display text-xl italic mb-4">
                      Нужна помощь в выборе?
                    </p>
                    <p className="text-sm text-muted-foreground mb-6">
                      Наши эксперты помогут подобрать идеальное произведение для
                      вашего интерьера
                    </p>
                    <Link
                      href="/catalog"
                      className="block w-full py-4 bg-foreground text-background text-center text-[10px] uppercase tracking-[0.2em] font-semibold hover:bg-accent hover:text-foreground transition-all"
                    >
                      Смотреть каталог
                    </Link>
                  </div>
                </div>
              </aside>
            </div>
          </DSContainer>
        </section>

        {/* Related Articles */}
        <section className="py-16 md:py-24 bg-muted/20">
          <DSContainer>
            <div className="text-center mb-12">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-4">
                Продолжить чтение
              </p>
              <h2 className="font-display text-3xl md:text-4xl italic">
                Похожие статьи
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedArticles.map((relatedArticle: any) => (
                <Link
                  key={relatedArticle.slug}
                  href={`/art-insights/${relatedArticle.slug}`}
                  className="group"
                >
                  <div className="aspect-[4/3] overflow-hidden mb-4">
                    <img
                      src={relatedArticle.image}
                      alt={relatedArticle.title}
                      className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                    />
                  </div>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-accent">
                    {relatedArticle.category}
                  </span>
                  <h3 className="font-display text-lg italic mt-2 group-hover:text-accent transition-colors line-clamp-2">
                    {relatedArticle.title}
                  </h3>
                </Link>
              ))}
            </div>
          </DSContainer>
        </section>
      </main>

      <Footer />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Play } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  DSSection,
  DSContainer,
  DSLabel,
  DSText,
  DSHeading,
  DSDecorativeAsterisk,
} from "@/components/ui/design-system";
import { Reveal } from "@/components/ui/reveal";
import { aboutContent, type AboutContent } from "@/data/about-content";
import { isAboutContent } from "@/lib/about-content";
import { Z_INDEX } from "@/lib/constants";

export default function AboutPage() {
  const [videoModal, setVideoModal] = useState<{
    isOpen: boolean;
    src: string | null;
  }>({ isOpen: false, src: null });
  const [content, setContent] = useState<AboutContent>(aboutContent);
  const { hero, categories, alphabet, outro } = content;

  useEffect(() => {
    let mounted = true;
    fetch("/api/about", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        const incoming = data?.item;
        if (!isAboutContent(incoming)) return;
        setContent(incoming);
      })
      .catch(() => {
        // keep static fallback content
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent selection:text-white overflow-auto">
      <Header />

      <main className="pt-32 md:pt-48 pb-0">
        {/* 1. HERO: Minimalist Sophistication */}
        <DSSection className="mb-40 md:mb-64">
          <DSContainer size="narrow" className="text-center">
            <Reveal direction="down">
              <DSDecorativeAsterisk className="mb-12" />
              <DSLabel className="mb-8 text-accent font-medium tracking-[0.3em]">
                {hero.subtitle}
              </DSLabel>
              <h1 className="text-6xl md:text-9xl font-display font-light leading-[0.9] tracking-tighter mb-12">
                {hero.title}
              </h1>
              <div className="max-w-xl mx-auto border-t border-black/5 pt-12">
                <DSText
                  size="lg"
                  className="italic font-display text-2xl text-muted-foreground/80 leading-relaxed"
                >
                  {hero.description}
                </DSText>
              </div>
            </Reveal>
          </DSContainer>
        </DSSection>

        {/* 2. CATEGORIES: Editorial Grid */}
        <DSSection className="mb-40 md:mb-80 overflow-hidden">
          <DSContainer size="wide">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-px bg-black/5 p-px">
              {categories.map((cat, index) => (
                <Reveal
                  key={index}
                  delay={index * 100}
                  className="bg-background group relative overflow-hidden aspect-[3/4]"
                >
                  {cat.href ? (
                    <Link href={cat.href} className="block h-full">
                      <Image
                        src={cat.image}
                        alt={cat.title}
                        fill
                        className="object-cover transition-transform duration-[2.5s] group-hover:scale-110 grayscale-[0.5] group-hover:grayscale-0 opacity-90 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors duration-700" />

                      {/* Bottom Gradient for better text contrast */}
                      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/40 to-transparent opacity-100 transition-opacity duration-700" />

                      <div className="absolute inset-0 p-8 flex flex-col justify-end translate-y-8 group-hover:translate-y-0 transition-transform duration-700">
                        <div className="space-y-4">
                          <h4 className="text-white font-display italic text-2xl md:text-3xl drop-shadow-md">
                            {cat.title}
                          </h4>
                          <p className="text-white/80 font-body text-[10px] md:text-[11px] leading-relaxed max-w-[80%] opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100 italic">
                            — {cat.description}
                          </p>
                        </div>
                      </div>

                      {/* Numbering UI */}
                      <div className="absolute top-8 right-8 overflow-hidden">
                        <span className="text-white/30 font-display italic text-4xl block translate-y-full group-hover:translate-y-0 transition-transform duration-700">
                          0{index + 1}
                        </span>
                      </div>
                    </Link>
                  ) : (
                    <>
                      <Image
                        src={cat.image}
                        alt={cat.title}
                        fill
                        className="object-cover transition-transform duration-[2.5s] group-hover:scale-110 grayscale-[0.5] group-hover:grayscale-0 opacity-90 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors duration-700" />

                      {/* Bottom Gradient for better text contrast */}
                      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/40 to-transparent opacity-100 transition-opacity duration-700" />

                      <div className="absolute inset-0 p-8 flex flex-col justify-end translate-y-8 group-hover:translate-y-0 transition-transform duration-700">
                        <div className="space-y-4">
                          <h4 className="text-white font-display italic text-2xl md:text-3xl drop-shadow-md">
                            {cat.title}
                          </h4>
                          <p className="text-white/80 font-body text-[10px] md:text-[11px] leading-relaxed max-w-[80%] opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100 italic">
                            — {cat.description}
                          </p>
                        </div>
                      </div>

                      {/* Numbering UI */}
                      <div className="absolute top-8 right-8 overflow-hidden">
                        <span className="text-white/30 font-display italic text-4xl block translate-y-full group-hover:translate-y-0 transition-transform duration-700">
                          0{index + 1}
                        </span>
                      </div>
                    </>
                  )}
                </Reveal>
              ))}
            </div>
          </DSContainer>
        </DSSection>

        {/* 3. ALPHABET NARRATIVE: Multi-layered Experience */}
        {alphabet.map((item, index) => {
          const isEven = index % 2 === 0;
          const hasCaptionLink = Boolean(
            item.captionLinkLabel && item.captionLinkHref,
          );
          return (
            <DSSection key={item.letter} className="mb-32 md:mb-64">
              <DSContainer>
                <div
                  className={`flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-16 md:gap-32`}
                >
                  {/* Visual Side */}
                  <div className="w-full md:w-1/2 relative">
                    <Reveal
                      direction={isEven ? "left" : "right"}
                      className="relative z-10"
                    >
                      <div
                        className={`relative overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] ${item.video ? "cursor-pointer group/video-container" : "aspect-[4/5] md:aspect-[5/6]"}`}
                        onClick={() =>
                          item.video &&
                          setVideoModal({ isOpen: true, src: item.video })
                        }
                      >
                        {/* Video for items with video property, images for others */}
                        {item.video ? (
                          <div className="relative w-full h-auto">
                            <video
                              autoPlay
                              loop
                              muted
                              playsInline
                              className="w-full h-auto block object-contain transition-transform duration-700 group-hover/video-container:scale-[1.02]"
                            >
                              <source src={item.video} type="video/mp4" />
                            </video>

                            {/* Play Button Overlay */}
                            <div className="absolute inset-0 bg-black/20 group-hover/video-container:bg-black/10 transition-colors duration-700 z-10 flex items-center justify-center">
                              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover/video-container:scale-110 transition-transform duration-500">
                                <Play className="w-6 h-6 md:w-8 md:h-8 text-white fill-white translate-x-1" />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <Image
                            src={
                              item.image ||
                              `/images/gallery-${(index % 6) + 1}.webp`
                            }
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                    </Reveal>

                    {/* Floating Big Letter Label */}
                    <div
                      className={`absolute top-0 ${isEven ? "-right-12" : "-left-12"} z-0 select-none hidden md:block opacity-10`}
                    >
                      <span className="text-[25rem] font-display leading-none text-accent">
                        {item.letter}
                      </span>
                    </div>

                    {/* Captions Detail */}
                    <Reveal
                      delay={400}
                      className="md:absolute md:-bottom-[158px] md:-right-12 bg-white/80 backdrop-blur-md p-6 md:p-10 shadow-2xl border border-black/5 max-w-[280px] w-full md:w-auto z-20 transition-all duration-700 hover:bg-white/90 mt-4 md:mt-0"
                    >
                      <div className="relative">
                        <DSLabel className="mb-3 text-accent transition-colors">
                          Принцип {item.letter}
                        </DSLabel>
                        <p className="font-display italic text-lg md:text-xl leading-snug text-foreground/80">
                          {item.caption || "Эстетика и совершенство в деталях"}
                          {hasCaptionLink && (
                            <>
                              {" "}
                              <Link
                                href={item.captionLinkHref!}
                                className="text-accent underline decoration-accent/30 hover:decoration-accent transition-all"
                              >
                                {item.captionLinkLabel}
                              </Link>
                            </>
                          )}
                        </p>
                        <div className="absolute -top-2 -left-2 w-4 h-4 border-t border-l border-accent/20" />
                      </div>
                    </Reveal>
                  </div>

                  {/* Content Side */}
                  <div className="w-full md:w-1/2">
                    <Reveal delay={200} direction="up">
                      <div className="space-y-12">
                        <div className="flex items-center gap-6">
                          <span className="w-12 h-px bg-accent/30" />
                          <DSLabel className="text-accent">
                            {item.title}
                          </DSLabel>
                        </div>

                        <DSHeading
                          level="h2"
                          className="text-5xl md:text-7xl lg:text-8xl leading-[0.9] -ml-2"
                        >
                          {item.title.split(" ")[0]}
                          <br />
                          <span className="text-accent/80 italic text-4xl md:text-6xl">
                            {item.title.split(" ").slice(1).join(" ")}
                          </span>
                        </DSHeading>

                        <div className="space-y-8 pl-0 md:pl-12">
                          <DSText
                            size="base"
                            className="leading-loose font-light text-foreground/70"
                          >
                            {item.description}
                          </DSText>
                          <DSDecorativeAsterisk />
                        </div>
                      </div>
                    </Reveal>
                  </div>
                </div>
              </DSContainer>
            </DSSection>
          );
        })}

        {/* 4. THE FINALE: Immersive Brand Statement */}
        <DSSection className="relative bg-[#0a0a0a] py-40 md:py-80 text-white overflow-hidden">
          <div className="absolute inset-0 z-0">
            {/* Static Image Background (for performance) */}
            <Image
              src="/images/about-video-poster.webp"
              alt="Фон"
              fill
              className="object-cover opacity-40"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-[#0a0a0a]" />
          </div>

          <DSContainer size="narrow" className="relative z-10 text-center">
            <Reveal>
              <div className="max-w-4xl mx-auto mb-16">
                <DSHeading
                  level="h2"
                  className="text-3xl md:text-5xl lg:text-6xl text-white font-medium leading-snug drop-shadow-2xl mb-6 tracking-wide"
                >
                  {outro.headlinePrimary || "Искусство требует."}
                </DSHeading>
                <DSHeading
                  level="h2"
                  className="text-2xl md:text-4xl lg:text-5xl text-accent font-medium leading-snug tracking-wide"
                >
                  {outro.headlineSecondary || "Заботу мы берём на себя."}
                </DSHeading>
              </div>

              <div className="max-w-3xl mx-auto mb-24">
                <DSText size="lg" className="text-white/70 leading-relaxed">
                  {outro.description}
                </DSText>
              </div>

              <div className="inline-block relative py-20 px-12 md:px-24 border border-white/5 bg-white/[0.02] backdrop-blur-sm">
                <p className="text-sm md:text-base uppercase tracking-[0.5em] font-light text-white/50 leading-relaxed max-w-xl mx-auto">
                  {outro.footerText}
                </p>

                {/* Decorative corners */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-accent/40" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-accent/40" />
              </div>
            </Reveal>
          </DSContainer>
        </DSSection>
      </main>

      <div className="relative" style={{ zIndex: Z_INDEX.footer }}>
        <Footer />
      </div>

      {/* Video Modal */}
      <Dialog
        open={videoModal.isOpen}
        onOpenChange={(open) =>
          !open && setVideoModal((prev) => ({ ...prev, isOpen: false }))
        }
      >
        <DialogContent className="max-w-6xl p-0 bg-black border-none text-white overflow-hidden aspect-video">
          <DialogTitle className="sr-only">Просмотр видео</DialogTitle>
          {videoModal.src && (
            <video
              src={videoModal.src}
              controls
              autoPlay
              className="w-full h-full object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

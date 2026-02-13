export interface HomeAnimatedOverlayContent {
  line1: string;
  line2: string;
}

export interface HomeHeroTaglineContent {
  intro: string;
  emphasis: string;
  highlight: string;
}

export interface HomeHeroDescriptionContent {
  main: string;
  continuation: string;
  adjectives: string[];
  suffix: string;
}

export interface HomeHeroContent {
  tagline: HomeHeroTaglineContent;
  description: HomeHeroDescriptionContent;
}

export interface HomeContactContent {
  headline: {
    line1: string;
    line2: string;
  };
  cta: {
    label: string;
  };
}

export interface HomeContentData {
  animatedOverlay: HomeAnimatedOverlayContent;
  hero: HomeHeroContent;
  contact: HomeContactContent;
}

export const homeContent: HomeContentData = {
  animatedOverlay: {
    line1: "ИСКУССТВО",
    line2: "ЭТО ПО ЛЮБВИ",
  },
  hero: {
    tagline: {
      intro: "Студия интерьерного дизайна полного цикла,",
      emphasis: "специализирующаяся на",
      highlight: "искусстве и деталях.",
    },
    description: {
      main: "Мы помогаем пространству обрести связь с людьми",
      continuation: "через",
      adjectives: ["уникальный", "выразительный"],
      suffix: "подход.",
    },
  },
  contact: {
    headline: {
      line1: "Есть проект в планах?",
      line2: "Давайте воплотим его в жизнь.",
    },
    cta: {
      label: "Напишите мне на почту",
    },
  },
};

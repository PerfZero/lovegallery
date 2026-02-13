export const CATALOG_CATEGORY_IDS = [
  "painting",
  "photo",
  "textile",
  "pet-furniture",
  "collections",
] as const;

export type CatalogCategoryId = (typeof CATALOG_CATEGORY_IDS)[number];

export interface CatalogPageHeroContent {
  title: string;
  subtitle: string;
}

export interface CatalogPageCategoryItem {
  id: CatalogCategoryId;
  title: string;
  description: string;
  videoPlaceholderColor: string;
  videoSrc?: string;
}

export interface CatalogCategorySubnavItem {
  label: string;
  href?: string;
}

export interface CatalogCategoryPageItem {
  id: CatalogCategoryId;
  navTitle: string;
  headline: string;
  accentColor: string;
  subnav: CatalogCategorySubnavItem[];
}

export interface CatalogProductPageContent {
  backButtonLabel: string;
  materialsTitle: string;
  materialsDescription: string;
  deliveryTitle: string;
  deliveryDescription: string;
}

export interface CatalogPageContentData {
  hero: CatalogPageHeroContent;
  categories: CatalogPageCategoryItem[];
  categoryPages: CatalogCategoryPageItem[];
  productPage: CatalogProductPageContent;
}

export const catalogPageContent: CatalogPageContentData = {
  hero: {
    title: "Каталог интерьерного искусства",
    subtitle: "выберите направление для вдохновения и подбора",
  },
  categories: [
    {
      id: "painting",
      title: "Живопись",
      description: "Эмоциональный центр вашего пространства",
      videoPlaceholderColor: "from-orange-900 to-amber-900",
      videoSrc: "/videos/painting-hover.mp4",
    },
    {
      id: "photo",
      title: "Фотография",
      description: "Запечатленные моменты вечности",
      videoPlaceholderColor: "from-slate-900 to-gray-900",
      videoSrc: "/videos/photo-hover.mp4",
    },
    {
      id: "textile",
      title: "Текстиль",
      description: "Тепло и тактильный комфорт",
      videoPlaceholderColor: "from-amber-900 to-yellow-900",
      videoSrc: "/videos/textile-hover.mp4",
    },
    {
      id: "pet-furniture",
      title: "Мебель для животных",
      description: "Эстетика для любимых питомцев",
      videoPlaceholderColor: "from-emerald-900 to-teal-900",
      videoSrc: "/videos/pet-furniture-hover-revised.mp4",
    },
    {
      id: "collections",
      title: "Коллекции",
      description: "Идеальная синергия наших изделий в каждой капсуле",
      videoPlaceholderColor: "from-zinc-900 to-neutral-900",
    },
  ],
  categoryPages: [
    {
      id: "painting",
      navTitle: "Живопись",
      headline:
        "Наши арты - это не просто картины, а объект, созданный для вашего вдохновения.",
      accentColor: "from-orange-950/20 to-transparent",
      subnav: [
        {
          label: "Как выбрать цвет",
          href: "/art-insights/how-to-choose-art-for-interior",
        },
        {
          label: "Картина или принт",
          href: "/art-insights/original-vs-print",
        },
        {
          label: "Психология цвета",
          href: "/art-insights/color-psychology-in-art",
        },
      ],
    },
    {
      id: "photo",
      navTitle: "Фото",
      headline: "Искусство момента, запечатленное сквозь призму вечности.",
      accentColor: "from-slate-900/20 to-transparent",
      subnav: [
        {
          label: "Форматы печати",
          href: "/art-insights/printing-formats",
        },
        {
          label: "Оформление в багет",
          href: "/art-insights/framing-guide",
        },
      ],
    },
    {
      id: "textile",
      navTitle: "Текстиль",
      headline: "Тепло и тактильная эстетика вашего дома.",
      accentColor: "from-amber-900/20 to-transparent",
      subnav: [
        {
          label: "Материалы",
          href: "/art-insights/textile-in-interior",
        },
        {
          label: "Уход за изделием",
          href: "/art-insights/caring-for-artwork",
        },
      ],
    },
    {
      id: "pet-furniture",
      navTitle: "Мебель для животных",
      headline: "Коллекция ТЕССЕРА. Премиальная мебель для любимых питомцев",
      accentColor: "from-emerald-900/20 to-transparent",
      subnav: [
        {
          label: "Размерная сетка",
          href: "/art-insights/how-to-choose-pet-furniture-size",
        },
        {
          label: "Материалы",
          href: "/art-insights/pet-furniture-materials",
        },
      ],
    },
    {
      id: "collections",
      navTitle: "КОЛЛЕКЦИИ",
      headline: "Идеальная синергия наших изделий в каждой капсуле.",
      accentColor: "from-zinc-900/20 to-transparent",
      subnav: [
        {
          label: "Шантарам",
          href: "/art-insights/collection-shantaram",
        },
        {
          label: "Начало",
          href: "/art-insights/collection-nachalo",
        },
        {
          label: "UniVers",
          href: "/art-insights/collection-univers",
        },
        {
          label: "Уно",
          href: "/art-insights/collection-uno",
        },
        {
          label: "Эредина",
          href: "/art-insights/collection-eredina",
        },
        {
          label: "Орбис",
          href: "/art-insights/collection-orbis",
        },
        {
          label: "Вельвет",
          href: "/art-insights/collection-velvet",
        },
      ],
    },
  ],
  productPage: {
    backButtonLabel: "Вернуться в каталог",
    materialsTitle: "Материалы",
    materialsDescription:
      "Натуральный массив дерева, экологичный шпон, водоотталкивающая ткань. Премиальная отделка лаком.",
    deliveryTitle: "Доставка",
    deliveryDescription:
      "Бережная упаковка. Доставка по всей России через СДЭК или курьером.",
  },
};

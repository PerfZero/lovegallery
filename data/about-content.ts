export interface AboutHeroContent {
  subtitle: string;
  title: string;
  description: string;
}

export interface AboutCategoryContent {
  title: string;
  image: string;
  description: string;
  href?: string;
}

export interface AboutAlphabetItem {
  letter: string;
  title: string;
  image: string;
  video?: string;
  caption?: string;
  captionLinkLabel?: string;
  captionLinkHref?: string;
  description: string;
}

export interface AboutOutroContent {
  letter: string;
  title: string;
  headlinePrimary?: string;
  headlineSecondary?: string;
  description: string;
  footerText: string;
}

export interface AboutContent {
  hero: AboutHeroContent;
  categories: AboutCategoryContent[];
  alphabet: AboutAlphabetItem[];
  outro: AboutOutroContent;
}

export const aboutContent: AboutContent = {
  hero: {
    subtitle: "О НАС",
    title: "От А до Я",
    description:
      "лучшие решения для частных и общественных пространств на любой бюджет и в нужные сроки",
  },
  categories: [
    {
      title: "Каталог",
      image: "/images/interior_catalog_aesthetic.webp",
      description:
        "Эксклюзивная подборка предметов интерьера и искусства для вашего дома.",
      href: "/catalog",
    },
    {
      title: "Услуги",
      image: "/images/interior_services_studio.webp",
      description:
        "Полный спектр профессиональных решений от проектирования до реализации.",
      href: "/offer",
    },
    {
      title: "Арт-Инсайты",
      image: "/images/art_insights_detail.webp",
      description:
        "Вдохновение и глубокое понимание мира современного искусства.",
      href: "/art-insights",
    },
    {
      title: "Оплата и доставка",
      image: "/images/payment_delivery_luxury.webp",
      description:
        "Безупречный сервис логистики и бережное отношение к вашим заказам.",
      href: "/payment-delivery",
    },
    {
      title: "Сервис",
      image: "/images/premium_service_concierge.webp",
      description:
        "Индивидуальный подход и премиальное сопровождение на каждом этапе.",
      href: "/contact",
    },
  ],
  alphabet: [
    {
      letter: "А",
      title: "Арткор (Artcore)",
      image: "/images/artcore_concept.webp",
      video: "/videos/about-video.mp4",
      caption:
        "На видео представлены панно САНГИТА и ковер ШИНАМ из нашей коллекции",
      captionLinkLabel: "ШАНТАРАМ",
      captionLinkHref: "/catalog/collections",
      description:
        "В основе нашей работы лежит Арткор - использование искусства как центрального элемента дизайна интерьера. Картины, постеры, текстиль и их соединение в персональные лаконичные коллекции придадут вашему пространству индивидуальность, эстетику и нужное настроение.",
    },
    {
      letter: "Б",
      title: "Бюджет",
      image: "/images/budget_luxury_detail.webp",
      video:
        "/videos/9a00b6a3067d67a31c3da1ea8b0b0b03_eee82134-afb9-443b-b7c7-018c2fcaaede.mp4",
      caption:
        "На видео представлены панно UNIvers и ковер Уно из нашей коллекции",
      captionLinkLabel: "НАЧАЛО",
      captionLinkHref: "/catalog/collections/coll-nachalo/",
      description:
        "Бюджет на исходе, а интерьер безлик и требует завершения? У нас есть эксклюзивные и элегантные решения, которые мгновенно преобразят ваше пространство на любом этапе проекта без лишних затрат. Картины и авторские постеры — это решающие акценты, которые впишутся в ваш бюджет. Еще один важный секрет под буквой К!",
    },
    {
      letter: "В",
      title: "Время",
      image: "/images/interior_services_studio.webp",
      description:
        "Экономия вашего времени гарантирована нашей компетентностью и опытом. У нас вы найдете не просто набор вещей, а идеальную капсулу интерьерного декора, которая гарантирует безупречный результат, неподдельный интерес гостей и экономию вашего времени.",
    },
    {
      letter: "К",
      title: "Кастомизация + коллекция",
      image: "/images/custom_fabric_craftsmanship.webp",
      video: "/videos/textile-hover.mp4",
      description:
        "Обновление существующей мебели: перетяжка и реставрация мебели подарят вашим предметам новую жизнь и уникальность. В отличие от магазинов, где вы ограничены 2−3 вариантами ткани для конкретной модели, при перетяжке или даже пошиве декоративных подушек различных форм и размеров мы поможем вам выбрать из множества образцов — от ярких принтов до спокойных оттенков. Вы ищете не просто декор, а гармоничное и завершенное решение для вашего дома? Мы предлагаем уникальную возможность: готовые коллекции настенного декора и текстиля для вашей мебели, разработанные нашими дизайнерами в едином стилевом и цветовом ключе или индивидуальный подбор решений именно для вас.",
    },
    {
      letter: "Л",
      title: "Любовь",
      image: "/images/love_interior_emotion.webp",
      description:
        "Мы не просто оживляем интерьеры — мы дарим эмоции! Наша команда — это люди, влюбленные в свое дело. Для нас картина, постер или текстильное решение — это не просто товар, это способ зажечь радость в ваших глазах.",
    },
    {
      letter: "О",
      title: "Оформление",
      image: "/images/baguette_frame_detail.webp",
      description:
        "Магия багета: Превращаем любой памятный для вас предмет в шедевр! Секрет прост: качественная рама. Любые предметы: от картин и постеров до вышивок, футболок, шахмат, зеркал, медалей и объемного декора. Багет — это не просто обрамление. Это завершающий штрих, который придает статус, создает фокус, отделяя арт от стены, заставляя взгляд остановиться на красоте, интегрирует в интерьер, связывая предмет оформления с общим стилем вашего пространства. Правильная рама превращает любой, даже самый бюджетный постер, в законченный арт-объект, достойный вашей уникальной коллекции. Наша компетентность поможет подобрать идеальный багет для вашего интерьера.",
    },
  ],
  outro: {
    letter: "Я",
    title: "",
    headlinePrimary: "Искусство требует.",
    headlineSecondary: "Заботу мы берём на себя.",
    description:
      "Мы создали сервис, который делает процесс приобретения искусства таким же вдохновляющим, как и само произведение.",
    footerText:
      "Мы — не просто галерея. Мы — бюро полного цикла с собственными типографией, мебельным производством и багетной мастерской.",
  },
};

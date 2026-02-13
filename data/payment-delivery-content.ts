export interface PaymentDeliveryHero {
  badge: string;
  titlePrimary: string;
  titleAccent: string;
  description: string;
}

export interface PaymentDeliveryFeature {
  title: string;
  description: string;
}

export interface PaymentDeliveryImageTextBadge {
  kicker: string;
  text: string;
}

export interface PaymentDeliveryConcierge {
  badge: string;
  titlePrimary: string;
  titleAccent: string;
  description: string;
  image: string;
  imageBadge: PaymentDeliveryImageTextBadge;
  bullets: string[];
}

export interface PaymentDeliveryLogistics {
  badge: string;
  titlePrimary: string;
  titleAccent: string;
  description: string;
  image: string;
  highlights: string[];
  partners: string[];
}

export interface PaymentDeliveryLogo {
  name: string;
  image: string;
  alt: string;
}

export interface PaymentDeliveryPayment {
  title: string;
  description: string;
  logos: PaymentDeliveryLogo[];
  trustBadges: string[];
}

export interface PaymentDeliveryContentData {
  hero: PaymentDeliveryHero;
  features: PaymentDeliveryFeature[];
  concierge: PaymentDeliveryConcierge;
  logistics: PaymentDeliveryLogistics;
  payment: PaymentDeliveryPayment;
}

export const paymentDeliveryContent: PaymentDeliveryContentData = {
  hero: {
    badge: "Сервис и Доставка",
    titlePrimary: "Искусство требует.",
    titleAccent: "Заботу мы берём на себя.",
    description:
      "Мы создали сервис, который делает процесс приобретения искусства таким же вдохновляющим, как и само произведение.",
  },
  features: [
    {
      title: "Бесплатная доставка",
      description: "По Москве в пределах МКАД",
    },
    {
      title: "Страхование",
      description: "100% защита груза",
    },
    {
      title: "Точные сроки",
      description: "Согласованный интервал",
    },
  ],
  concierge: {
    badge: "Москва и область",
    titlePrimary: "Персональный",
    titleAccent: "консьерж-сервис",
    description:
      "Для наших клиентов в Москве мы исключили безликие курьерские службы. Ваш заказ доставит специалист галереи, который знает, как обращаться с искусством.",
    image: "/images/white_glove_service_1767629664547.webp",
    imageBadge: {
      kicker: "Москва и МО",
      text: "Бесплатная доставка от 10 000 ₽",
    },
    bullets: [
      "Согласуем удобный часовой интервал",
      "Поможем с распаковкой и примеркой",
      "Консультация по размещению на месте",
    ],
  },
  logistics: {
    badge: "Россия и Мир",
    titlePrimary: "Безопасная",
    titleAccent: "логистика",
    description:
      "Расстояние не имеет значения. Мы сотрудничаем с DHL и СДЭК, обеспечивая полное страхование груза. Каждая картина упаковывается в индивидуальный деревянный короб (art-box).",
    image: "/images/art_packaging_premium.webp",
    highlights: [
      "Защита от влаги",
      "Температурный контроль",
      "Амортизация ударов",
      "Трекинг 24/7",
    ],
    partners: ["DHL Express", "СДЭК"],
  },
  payment: {
    title: "Прозрачность сделки",
    description:
      "Мы ценим ваше доверие, поэтому работаем только официально. Оплата производится через защищенный шлюз Сбербанка без комиссий. Вы получаете электронный чек и договор-оферту сразу после транзакции.",
    logos: [
      { name: "Visa", image: "/images/payments/visa.webp", alt: "Visa" },
      {
        name: "Mastercard",
        image: "/images/payments/mastercard.webp",
        alt: "Mastercard",
      },
      { name: "МИР", image: "/images/payments/mir.webp", alt: "МИР" },
      {
        name: "SberPay",
        image: "/images/payments/sberpay.webp",
        alt: "SberPay",
      },
    ],
    trustBadges: ["SSL-шифрование", "PCI DSS сертификат"],
  },
};

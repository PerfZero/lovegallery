// =============================================================================
// Site Configuration
// =============================================================================

import type {
  NavigationItem,
  ContactInfo,
  SocialLink,
  FooterColumn,
} from "@/types";

/**
 * Main site configuration - single source of truth for site-wide settings
 */
export const siteConfig = {
  /** Site name (brand) */
  name: "Любовь",

  /** Full site title with tagline */
  fullName: "Любовь — Галерея Интерьерного Искусства",

  /** SEO description */
  description:
    "Галерея Любовь подбирает искусство для интерьеров: авторская живопись, фотография, текстиль и коллекции с персональной консультацией и сопровождением заказа.",

  /** Base URL for production */
  url: "https://love.design",

  /** Default locale */
  locale: "ru-RU",
} as const;

/**
 * Contact information
 */
export const contactConfig: ContactInfo = {
  email: "order@lovegallery.ru",
  phone: "+7 (999) 123-45-67",
  instagram: "https://instagram.com/lubov.art.gallery",
  telegram: "https://t.me/lubov_art",
  whatsapp: "https://wa.me/79991234567",
};

/**
 * Main navigation items
 */
export const navigationConfig: NavigationItem[] = [
  { name: "О нас", href: "/about" },
  { name: "Каталог", href: "/catalog" },
  { name: "Арт-инсайты", href: "/art-insights" },
  { name: "Оплата и доставка", href: "/payment-delivery" },
];

/**
 * Social media links
 */
export const socialLinks: SocialLink[] = [
  {
    name: "Instagram*",
    href: contactConfig.instagram,
    label: "Мы в Instagram",
  },
  { name: "Telegram", href: contactConfig.telegram, label: "Мы в Telegram" },
  {
    name: "WhatsApp",
    href: contactConfig.whatsapp,
    label: "Написать в WhatsApp",
  },
];

/**
 * Footer column configuration
 */
export const footerConfig: FooterColumn[] = [
  {
    title: "Контакты",
    links: [
      { label: contactConfig.email, href: `mailto:${contactConfig.email}` },
      {
        label: contactConfig.phone,
        href: `tel:${contactConfig.phone.replace(/\\s/g, "")}`,
      },
    ],
  },
  {
    title: "Помощь",
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "Связаться с нами", href: "/contact" },
      { label: "Оплата и доставка", href: "/payment-delivery" },
    ],
  },
  {
    title: "Мы в сети",
    links: socialLinks.map((link) => ({ label: link.name, href: link.href })),
  },
  {
    title: "Документы",
    links: [
      { label: "Политика конфиденциальности", href: "/privacy" },
      { label: "Публичная оферта", href: "/offer" },
      { label: "Реквизиты", href: "/legal-details" },
    ],
  },
];

// Legacy export for backwards compatibility
export { siteConfig as default };

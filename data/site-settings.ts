export interface SiteMaintenanceSettings {
  enabled: boolean;
  brandLabel: string;
  title: string;
  description: string;
}

export interface SiteContactsSettings {
  email: string;
  phone: string;
  instagram: string;
  telegram: string;
  whatsapp: string;
  address: string;
  workHoursWeekdays: string;
  workHoursWeekend: string;
  showroomNote: string;
}

export interface SiteContactPageSettings {
  heroBadge: string;
  heroTitle: string;
  heroTitleAccent: string;
  heroDescription: string;
  infoTitle: string;
  formTitle: string;
  successTitle: string;
  successDescription: string;
  privacyText: string;
  sendButtonLabel: string;
}

export interface SiteSettingsData {
  maintenance: SiteMaintenanceSettings;
  contacts: SiteContactsSettings;
  contactPage: SiteContactPageSettings;
}

export const siteSettings: SiteSettingsData = {
  maintenance: {
    enabled: false,
    brandLabel: "Beloved",
    title: "Сайт временно недоступен",
    description:
      "Мы обновляем сайт. Пожалуйста, зайдите немного позже или свяжитесь с нами по электронной почте.",
  },
  contacts: {
    email: "order@lovegallery.ru",
    phone: "+7 495 477-34-34",
    instagram: "https://instagram.com/lubov.art.gallery",
    telegram: "https://t.me/+79804773434",
    whatsapp: "https://wa.me/+79804773434",
    address: "Москва, ул. Примерная, 1",
    workHoursWeekdays: "Пн-Пт: 10:00 - 19:00",
    workHoursWeekend: "Сб-Вс: по записи",
    showroomNote: "Шоу-рум по записи",
  },
  contactPage: {
    heroBadge: "Связь с нами",
    heroTitle: "Свяжитесь",
    heroTitleAccent: "с нами",
    heroDescription:
      "Мы всегда рады ответить на ваши вопросы и помочь с выбором",
    infoTitle: "Контакты",
    formTitle: "Напишите нам",
    successTitle: "Сообщение отправлено!",
    successDescription: "Мы свяжемся с вами в ближайшее время",
    privacyText: "Нажимая кнопку, вы соглашаетесь с",
    sendButtonLabel: "Отправить",
  },
};

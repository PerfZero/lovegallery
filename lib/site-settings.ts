import {
  siteSettings as defaultSiteSettings,
  type SiteSettingsData,
} from "@/data/site-settings";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function readString(
  source: Record<string, unknown> | undefined,
  key: string,
  fallback: string,
) {
  const value = source?.[key];
  return typeof value === "string" ? value : fallback;
}

function readBoolean(
  source: Record<string, unknown> | undefined,
  key: string,
  fallback: boolean,
) {
  const value = source?.[key];
  return typeof value === "boolean" ? value : fallback;
}

export function isSiteSettings(value: unknown): value is SiteSettingsData {
  if (!isObject(value)) return false;
  if (!isObject(value.maintenance)) return false;
  if (!isObject(value.contacts)) return false;
  if (!isObject(value.contactPage)) return false;

  const maintenanceOk =
    typeof value.maintenance.enabled === "boolean" &&
    isString(value.maintenance.brandLabel) &&
    isString(value.maintenance.title) &&
    isString(value.maintenance.description);

  const contactsOk =
    isString(value.contacts.email) &&
    isString(value.contacts.phone) &&
    isString(value.contacts.instagram) &&
    isString(value.contacts.telegram) &&
    isString(value.contacts.whatsapp) &&
    isString(value.contacts.address) &&
    isString(value.contacts.workHoursWeekdays) &&
    isString(value.contacts.workHoursWeekend) &&
    isString(value.contacts.showroomNote);

  const contactPageOk =
    isString(value.contactPage.heroBadge) &&
    isString(value.contactPage.heroTitle) &&
    isString(value.contactPage.heroTitleAccent) &&
    isString(value.contactPage.heroDescription) &&
    isString(value.contactPage.infoTitle) &&
    isString(value.contactPage.formTitle) &&
    isString(value.contactPage.successTitle) &&
    isString(value.contactPage.successDescription) &&
    isString(value.contactPage.privacyText) &&
    isString(value.contactPage.sendButtonLabel);

  return maintenanceOk && contactsOk && contactPageOk;
}

export function cloneSiteSettings(data: SiteSettingsData): SiteSettingsData {
  return JSON.parse(JSON.stringify(data)) as SiteSettingsData;
}

export function resolveSiteSettings(value: unknown): SiteSettingsData {
  const defaults = defaultSiteSettings;

  if (!isObject(value)) {
    return cloneSiteSettings(defaults);
  }

  const maintenance = isObject(value.maintenance) ? value.maintenance : undefined;
  const contacts = isObject(value.contacts) ? value.contacts : undefined;
  const contactPage = isObject(value.contactPage) ? value.contactPage : undefined;

  return {
    maintenance: {
      enabled: readBoolean(
        maintenance,
        "enabled",
        defaults.maintenance.enabled,
      ),
      brandLabel: readString(
        maintenance,
        "brandLabel",
        defaults.maintenance.brandLabel,
      ),
      title: readString(maintenance, "title", defaults.maintenance.title),
      description: readString(
        maintenance,
        "description",
        defaults.maintenance.description,
      ),
    },
    contacts: {
      email: readString(contacts, "email", defaults.contacts.email),
      phone: readString(contacts, "phone", defaults.contacts.phone),
      instagram: readString(contacts, "instagram", defaults.contacts.instagram),
      telegram: readString(contacts, "telegram", defaults.contacts.telegram),
      whatsapp: readString(contacts, "whatsapp", defaults.contacts.whatsapp),
      address: readString(contacts, "address", defaults.contacts.address),
      workHoursWeekdays: readString(
        contacts,
        "workHoursWeekdays",
        defaults.contacts.workHoursWeekdays,
      ),
      workHoursWeekend: readString(
        contacts,
        "workHoursWeekend",
        defaults.contacts.workHoursWeekend,
      ),
      showroomNote: readString(
        contacts,
        "showroomNote",
        defaults.contacts.showroomNote,
      ),
    },
    contactPage: {
      heroBadge: readString(
        contactPage,
        "heroBadge",
        defaults.contactPage.heroBadge,
      ),
      heroTitle: readString(
        contactPage,
        "heroTitle",
        defaults.contactPage.heroTitle,
      ),
      heroTitleAccent: readString(
        contactPage,
        "heroTitleAccent",
        defaults.contactPage.heroTitleAccent,
      ),
      heroDescription: readString(
        contactPage,
        "heroDescription",
        defaults.contactPage.heroDescription,
      ),
      infoTitle: readString(
        contactPage,
        "infoTitle",
        defaults.contactPage.infoTitle,
      ),
      formTitle: readString(
        contactPage,
        "formTitle",
        defaults.contactPage.formTitle,
      ),
      successTitle: readString(
        contactPage,
        "successTitle",
        defaults.contactPage.successTitle,
      ),
      successDescription: readString(
        contactPage,
        "successDescription",
        defaults.contactPage.successDescription,
      ),
      privacyText: readString(
        contactPage,
        "privacyText",
        defaults.contactPage.privacyText,
      ),
      sendButtonLabel: readString(
        contactPage,
        "sendButtonLabel",
        defaults.contactPage.sendButtonLabel,
      ),
    },
  };
}

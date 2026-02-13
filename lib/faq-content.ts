import {
  faqContent as defaultFAQContent,
  type FAQContentData,
  type FAQItem,
} from "@/data/faq-content";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isString);
}

function isFAQItem(value: unknown): value is FAQItem {
  return (
    isObject(value) &&
    isString(value.category) &&
    isString(value.question) &&
    isString(value.answer)
  );
}

export function isFAQContent(value: unknown): value is FAQContentData {
  if (!isObject(value)) return false;
  if (!isObject(value.hero)) return false;
  if (!isObject(value.cta)) return false;
  if (!Array.isArray(value.items)) return false;

  const heroOk =
    isString(value.hero.badge) &&
    isString(value.hero.titlePrimary) &&
    isString(value.hero.titleAccent) &&
    isString(value.hero.description);
  const ctaOk =
    isString(value.cta.title) &&
    isString(value.cta.description) &&
    isString(value.cta.buttonLabel) &&
    isString(value.cta.buttonHref);

  if (!heroOk || !ctaOk) return false;
  if (!isStringArray(value.categories)) return false;
  if (!value.items.every(isFAQItem)) return false;

  return true;
}

export function cloneFAQContent(content: FAQContentData): FAQContentData {
  return JSON.parse(JSON.stringify(content)) as FAQContentData;
}

export function resolveFAQContent(value: unknown): FAQContentData {
  if (isFAQContent(value)) {
    return cloneFAQContent(value);
  }
  return cloneFAQContent(defaultFAQContent);
}

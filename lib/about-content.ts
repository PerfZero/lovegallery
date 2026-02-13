import {
  aboutContent as defaultAboutContent,
  type AboutAlphabetItem,
  type AboutCategoryContent,
  type AboutContent,
} from "@/data/about-content";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isAboutCategoryContent(value: unknown): value is AboutCategoryContent {
  if (!isObject(value)) return false;
  const base =
    isString(value.title) &&
    isString(value.image) &&
    isString(value.description);
  if (!base) return false;

  if (typeof value.href !== "undefined" && !isString(value.href)) {
    return false;
  }

  return true;
}

function isAboutAlphabetItem(value: unknown): value is AboutAlphabetItem {
  if (!isObject(value)) return false;
  if (
    !isString(value.letter) ||
    !isString(value.title) ||
    !isString(value.image) ||
    !isString(value.description)
  ) {
    return false;
  }

  if (typeof value.video !== "undefined" && !isString(value.video)) {
    return false;
  }
  if (typeof value.caption !== "undefined" && !isString(value.caption)) {
    return false;
  }
  if (
    typeof value.captionLinkLabel !== "undefined" &&
    !isString(value.captionLinkLabel)
  ) {
    return false;
  }
  if (
    typeof value.captionLinkHref !== "undefined" &&
    !isString(value.captionLinkHref)
  ) {
    return false;
  }

  return true;
}

export function isAboutContent(value: unknown): value is AboutContent {
  if (!isObject(value)) return false;
  if (!isObject(value.hero)) return false;
  if (!isObject(value.outro)) return false;
  if (!Array.isArray(value.categories) || !Array.isArray(value.alphabet)) {
    return false;
  }

  const heroOk =
    isString(value.hero.subtitle) &&
    isString(value.hero.title) &&
    isString(value.hero.description);
  const outroOk =
    isString(value.outro.letter) &&
    isString(value.outro.title) &&
    isString(value.outro.description) &&
    isString(value.outro.footerText);

  if (!heroOk || !outroOk) return false;
  if (
    typeof value.outro.headlinePrimary !== "undefined" &&
    !isString(value.outro.headlinePrimary)
  ) {
    return false;
  }
  if (
    typeof value.outro.headlineSecondary !== "undefined" &&
    !isString(value.outro.headlineSecondary)
  ) {
    return false;
  }
  if (!value.categories.every(isAboutCategoryContent)) return false;
  if (!value.alphabet.every(isAboutAlphabetItem)) return false;

  return true;
}

export function cloneAboutContent(content: AboutContent): AboutContent {
  return JSON.parse(JSON.stringify(content)) as AboutContent;
}

export function resolveAboutContent(value: unknown): AboutContent {
  if (isAboutContent(value)) {
    return cloneAboutContent(value);
  }
  return cloneAboutContent(defaultAboutContent);
}

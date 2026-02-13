import {
  homeContent as defaultHomeContent,
  type HomeContentData,
} from "@/data/home-content";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isString);
}

export function isHomeContent(value: unknown): value is HomeContentData {
  if (!isObject(value)) return false;
  if (!isObject(value.animatedOverlay)) return false;
  if (!isObject(value.hero)) return false;
  if (!isObject(value.hero.tagline)) return false;
  if (!isObject(value.hero.description)) return false;
  if (!isObject(value.contact)) return false;
  if (!isObject(value.contact.headline)) return false;
  if (!isObject(value.contact.cta)) return false;

  const overlayOk =
    isString(value.animatedOverlay.line1) && isString(value.animatedOverlay.line2);
  const heroTaglineOk =
    isString(value.hero.tagline.intro) &&
    isString(value.hero.tagline.emphasis) &&
    isString(value.hero.tagline.highlight);
  const heroDescriptionOk =
    isString(value.hero.description.main) &&
    isString(value.hero.description.continuation) &&
    isStringArray(value.hero.description.adjectives) &&
    isString(value.hero.description.suffix);
  const contactOk =
    isString(value.contact.headline.line1) &&
    isString(value.contact.headline.line2) &&
    isString(value.contact.cta.label);

  return overlayOk && heroTaglineOk && heroDescriptionOk && contactOk;
}

export function cloneHomeContent(content: HomeContentData): HomeContentData {
  return JSON.parse(JSON.stringify(content)) as HomeContentData;
}

export function resolveHomeContent(value: unknown): HomeContentData {
  if (isHomeContent(value)) {
    return cloneHomeContent(value);
  }
  return cloneHomeContent(defaultHomeContent);
}

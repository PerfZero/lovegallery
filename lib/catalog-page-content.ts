import {
  CATALOG_CATEGORY_IDS,
  catalogPageContent as defaultCatalogPageContent,
  type CatalogCategoryId,
  type CatalogCategoryPageItem,
  type CatalogPageCategoryItem,
  type CatalogPageContentData,
  type CatalogCategorySubnavItem,
} from "@/data/catalog-page-content";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isCatalogCategoryId(value: unknown): value is CatalogCategoryId {
  return (
    isString(value) &&
    (CATALOG_CATEGORY_IDS as readonly string[]).includes(value)
  );
}

function isCategorySubnavItem(
  value: unknown,
): value is CatalogCategorySubnavItem {
  if (!isObject(value)) return false;
  if (!isString(value.label)) return false;
  if (typeof value.href !== "undefined" && !isString(value.href)) return false;
  return true;
}

function isPageCategoryItem(value: unknown): value is CatalogPageCategoryItem {
  if (!isObject(value)) return false;
  if (!isCatalogCategoryId(value.id)) return false;
  if (
    !isString(value.title) ||
    !isString(value.description) ||
    !isString(value.videoPlaceholderColor)
  ) {
    return false;
  }
  if (typeof value.videoSrc !== "undefined" && !isString(value.videoSrc)) {
    return false;
  }
  return true;
}

function isCategoryPageItem(value: unknown): value is CatalogCategoryPageItem {
  if (!isObject(value)) return false;
  if (!isCatalogCategoryId(value.id)) return false;
  if (
    !isString(value.navTitle) ||
    !isString(value.headline) ||
    !isString(value.accentColor) ||
    !Array.isArray(value.subnav)
  ) {
    return false;
  }
  if (!value.subnav.every(isCategorySubnavItem)) return false;
  return true;
}

function hasAllCategoryIds(items: { id: CatalogCategoryId }[]): boolean {
  const ids = items.map((item) => item.id);
  return CATALOG_CATEGORY_IDS.every((id) => ids.includes(id));
}

export function isCatalogPageContent(
  value: unknown,
): value is CatalogPageContentData {
  if (!isObject(value)) return false;
  if (!isObject(value.hero)) return false;
  if (!isObject(value.productPage)) return false;
  if (!Array.isArray(value.categories) || !Array.isArray(value.categoryPages)) {
    return false;
  }

  const heroOk = isString(value.hero.title) && isString(value.hero.subtitle);
  const productOk =
    isString(value.productPage.backButtonLabel) &&
    isString(value.productPage.materialsTitle) &&
    isString(value.productPage.materialsDescription) &&
    isString(value.productPage.deliveryTitle) &&
    isString(value.productPage.deliveryDescription);

  if (!heroOk || !productOk) return false;
  if (!value.categories.every(isPageCategoryItem)) return false;
  if (!value.categoryPages.every(isCategoryPageItem)) return false;
  if (!hasAllCategoryIds(value.categories)) return false;
  if (!hasAllCategoryIds(value.categoryPages)) return false;

  return true;
}

export function cloneCatalogPageContent(
  content: CatalogPageContentData,
): CatalogPageContentData {
  return JSON.parse(JSON.stringify(content)) as CatalogPageContentData;
}

function withLegacyCategoryVideos(value: unknown): unknown {
  if (!isObject(value)) return value;
  if (!Array.isArray(value.categories) || !Array.isArray(value.categoryPages)) {
    return value;
  }

  let cloned: Record<string, unknown>;
  try {
    cloned = JSON.parse(JSON.stringify(value)) as Record<string, unknown>;
  } catch {
    return value;
  }

  const categories = Array.isArray(cloned.categories) ? cloned.categories : [];
  const categoryPages = Array.isArray(cloned.categoryPages)
    ? cloned.categoryPages
    : [];
  const legacyVideoMap = new Map<CatalogCategoryId, string>();

  categoryPages.forEach((item) => {
    if (!isObject(item) || !isCatalogCategoryId(item.id)) return;
    const legacyVideo = item.backgroundVideoSrc;
    if (typeof legacyVideo !== "string") return;
    const trimmed = legacyVideo.trim();
    if (!trimmed) return;
    legacyVideoMap.set(item.id, trimmed);
  });

  categories.forEach((item) => {
    if (!isObject(item) || !isCatalogCategoryId(item.id)) return;
    const currentVideo = item.videoSrc;
    if (typeof currentVideo === "string" && currentVideo.trim()) return;
    const legacyVideo = legacyVideoMap.get(item.id);
    if (legacyVideo) {
      item.videoSrc = legacyVideo;
    }
  });

  return cloned;
}

export function resolveCatalogPageContent(
  value: unknown,
): CatalogPageContentData {
  const migrated = withLegacyCategoryVideos(value);
  if (isCatalogPageContent(migrated)) {
    return cloneCatalogPageContent(migrated);
  }
  return cloneCatalogPageContent(defaultCatalogPageContent);
}

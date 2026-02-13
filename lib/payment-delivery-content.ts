import {
  paymentDeliveryContent as defaultContent,
  type PaymentDeliveryContentData,
  type PaymentDeliveryFeature,
  type PaymentDeliveryLogo,
} from "@/data/payment-delivery-content";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isString);
}

function isFeature(value: unknown): value is PaymentDeliveryFeature {
  return (
    isObject(value) && isString(value.title) && isString(value.description)
  );
}

function isLogo(value: unknown): value is PaymentDeliveryLogo {
  return (
    isObject(value) &&
    isString(value.name) &&
    isString(value.image) &&
    isString(value.alt)
  );
}

export function isPaymentDeliveryContent(
  value: unknown,
): value is PaymentDeliveryContentData {
  if (!isObject(value)) return false;
  if (!isObject(value.hero)) return false;
  if (!isObject(value.concierge)) return false;
  if (!isObject(value.logistics)) return false;
  if (!isObject(value.payment)) return false;
  if (!Array.isArray(value.features)) return false;

  const heroOk =
    isString(value.hero.badge) &&
    isString(value.hero.titlePrimary) &&
    isString(value.hero.titleAccent) &&
    isString(value.hero.description);

  const conciergeOk =
    isString(value.concierge.badge) &&
    isString(value.concierge.titlePrimary) &&
    isString(value.concierge.titleAccent) &&
    isString(value.concierge.description) &&
    isString(value.concierge.image) &&
    isObject(value.concierge.imageBadge) &&
    isString(value.concierge.imageBadge.kicker) &&
    isString(value.concierge.imageBadge.text) &&
    isStringArray(value.concierge.bullets);

  const logisticsOk =
    isString(value.logistics.badge) &&
    isString(value.logistics.titlePrimary) &&
    isString(value.logistics.titleAccent) &&
    isString(value.logistics.description) &&
    isString(value.logistics.image) &&
    isStringArray(value.logistics.highlights) &&
    isStringArray(value.logistics.partners);

  const paymentOk =
    isString(value.payment.title) &&
    isString(value.payment.description) &&
    Array.isArray(value.payment.logos) &&
    value.payment.logos.every(isLogo) &&
    isStringArray(value.payment.trustBadges);

  if (!heroOk || !conciergeOk || !logisticsOk || !paymentOk) return false;
  if (!value.features.every(isFeature)) return false;

  return true;
}

export function clonePaymentDeliveryContent(
  content: PaymentDeliveryContentData,
): PaymentDeliveryContentData {
  return JSON.parse(JSON.stringify(content)) as PaymentDeliveryContentData;
}

export function resolvePaymentDeliveryContent(
  value: unknown,
): PaymentDeliveryContentData {
  if (isPaymentDeliveryContent(value)) {
    return clonePaymentDeliveryContent(value);
  }
  return clonePaymentDeliveryContent(defaultContent);
}

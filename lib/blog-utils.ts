const RU_MAP: Record<string, string> = {
  а: "a",
  б: "b",
  в: "v",
  г: "g",
  д: "d",
  е: "e",
  ё: "e",
  ж: "zh",
  з: "z",
  и: "i",
  й: "y",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "h",
  ц: "c",
  ч: "ch",
  ш: "sh",
  щ: "sch",
  ъ: "",
  ы: "y",
  ь: "",
  э: "e",
  ю: "yu",
  я: "ya",
};

export function slugify(input: string) {
  const lower = input.trim().toLowerCase();
  const translit = lower
    .split("")
    .map((ch) => RU_MAP[ch] ?? ch)
    .join("");
  return translit
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "")
    .replace(/\-+/g, "-")
    .replace(/^\-+|\-+$/g, "");
}

function stripHtml(text: string) {
  return text.replace(/<[^>]*>/g, " ");
}

export function computeReadTime(text: string) {
  const plain = stripHtml(text);
  const words = plain
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} мин`;
}

export function formatDateRu(date = new Date()) {
  return date.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function buildExcerptFromText(text: string) {
  if (/<[^>]+>/.test(text)) {
    const withBreaks = text
      .replace(/<\/p>\s*<p>/gi, "\n\n")
      .replace(/<\/h[1-6]>\s*<p>/gi, "\n\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<li>/gi, "\n")
      .replace(/<\/li>/gi, "\n");
    const plain = stripHtml(withBreaks);
    const paragraph = plain.split(/\n\s*\n/)[0] || plain;
    return paragraph.replace(/\n+/g, " ").trim().slice(0, 300);
  }

  const plain = stripHtml(text);
  const paragraph = plain.split(/\n\s*\n/)[0] || plain;
  return paragraph.replace(/\n+/g, " ").trim().slice(0, 300);
}

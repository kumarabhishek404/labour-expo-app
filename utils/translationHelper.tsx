import i18n from "./i18n";

export const t = (key: string, options?: object): string => i18n.t(key, options);

/**
 * Bilingual label helper for rural/low-literacy UX: shows Hindi + English together.
 * Falls back gracefully when a key is missing in either locale.
 */
export const tBi = (key: string, options?: object): string => {
  const hi = i18n.t(key, { ...(options || {}), locale: "hi" });
  const en = i18n.t(key, { ...(options || {}), locale: "en" });

  if (!hi && !en) return "";
  if (!hi) return String(en);
  if (!en) return String(hi);
  if (String(hi) === String(en)) return String(hi);

  return `${hi} / ${en}`;
};

// translationHelper.ts
import i18n from "./i18n";

export const t = (key: string, options?: object): string => {
  return i18n.t(key, options);
};

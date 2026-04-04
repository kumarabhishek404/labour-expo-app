import * as Linking from "expo-linking";

/**
 * Custom scheme from `app.json` → `expo.scheme`.
 */
export const APP_LINK_SCHEME = "apnarojgar" as const;

/** Host used for HTTPS App Links / Universal Links (`app.json` intent filters). */
export const UNIVERSAL_LINK_HOST = "apnarojgar.com" as const;

/** Android package — must match `app.json` → `android.package`. */
export const ANDROID_PACKAGE = "com.kumarabhishek404.labourapp" as const;

/** Play Store listing (India / global). */
export const PLAY_STORE_LISTING_URL = `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}`;

/**
 * Short HTTPS link — opens the app via Android App Links / iOS Universal Links when verified.
 * If the app is not installed, the user must open the Play Store via the hosted fallback page
 * (see `assets/deep-link-fallback.html`) or the note in the shared message.
 */
export function getServiceDetailsUniversalLink(serviceId: string): string {
  const id = String(serviceId ?? "").trim();
  if (!id) return "";
  return `https://${UNIVERSAL_LINK_HOST}/job/${id}`;
}

/** Same screen; longer path (matches `app/screens/service/[id].tsx`). */
export function getServiceDetailsUniversalLinkScreensPath(serviceId: string): string {
  const id = String(serviceId ?? "").trim();
  if (!id) return "";
  return `https://${UNIVERSAL_LINK_HOST}/screens/service/${id}`;
}

/**
 * Custom scheme — works when the app is already installed (`apnarojgar://job/...`).
 */
export function getServiceDetailsDeepLink(serviceId: string): string {
  const id = String(serviceId ?? "").trim();
  if (!id) return "";
  return `${APP_LINK_SCHEME}://job/${id}`;
}

export function getServiceDetailsDeepLinkScreensPath(serviceId: string): string {
  const id = String(serviceId ?? "").trim();
  if (!id) return "";
  return `${APP_LINK_SCHEME}://screens/service/${id}`;
}

/**
 * Android Chrome: try to open the app via HTTPS App Link; if not installed, send user to Play Store.
 * (Useful for SMS / QR; optional.)
 */
export function getAndroidJobIntentUrl(serviceId: string): string {
  const id = String(serviceId ?? "").trim();
  if (!id) return PLAY_STORE_LISTING_URL;
  const fallback = encodeURIComponent(PLAY_STORE_LISTING_URL);
  return `intent://apnarojgar.com/job/${id}#Intent;scheme=https;package=${ANDROID_PACKAGE};S.browser_fallback_url=${fallback};end`;
}

/**
 * Extract service id from custom scheme, HTTPS universal links, or query `?id=`.
 */
export function parseServiceIdFromUrl(url: string): string | undefined {
  if (!url || typeof url !== "string") return undefined;

  const parsed = Linking.parse(url.trim());
  const scheme = (parsed.scheme || "").toLowerCase();

  // --- https / http (App Links) ---
  if (scheme === "https" || scheme === "http") {
    const host = (parsed.hostname || "").replace(/^www\./i, "").toLowerCase();
    if (host !== UNIVERSAL_LINK_HOST) return undefined;

    let path = (parsed.path || "").replace(/^\/+|\/+$/g, "");

    const jobMatch = path.match(/^job\/([^/?#]+)$/i);
    if (jobMatch) return decodeURIComponent(jobMatch[1]);

    const screenMatch = path.match(/^screens\/service\/([^/?#]+)$/i);
    if (screenMatch) return decodeURIComponent(screenMatch[1]);

    const queryId = parsed.queryParams?.id;
    if (typeof queryId === "string" && queryId.trim()) {
      return queryId.trim();
    }
    if (Array.isArray(queryId) && queryId[0]) {
      return String(queryId[0]).trim();
    }

    return undefined;
  }

  // --- apnarojgar:// ---
  if (scheme === APP_LINK_SCHEME) {
    const rawPath = parsed.hostname
      ? `${parsed.hostname}/${parsed.path ?? ""}`.replace(/\/+$/, "")
      : parsed.path ?? "";
    const fullPath = rawPath.replace(/^\//, "");

    const jobMatch = fullPath.match(/^job\/(.+)$/);
    if (jobMatch) return jobMatch[1];

    const screenMatch = fullPath.match(/^screens\/service\/(.+)$/);
    if (screenMatch) return screenMatch[1];

    if (fullPath.startsWith("job/")) {
      return fullPath.slice("job/".length);
    }
  }

  return undefined;
}

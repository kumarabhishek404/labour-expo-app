/**
 * Deep links are handled by **Expo Router** (see `app.json` scheme + `extra.router.origin`).
 * Do **not** block the root layout or call `router.replace` before the Stack mounts — that breaks navigation.
 *
 * Supported URLs → routes:
 * - `https://apnarojgar.com/job/<id>` → `app/job/[id].tsx` → redirects to service details
 * - `https://apnarojgar.com/screens/service/<id>` → `app/screens/service/[id].tsx`
 * - `apnarojgar://job/<id>` → same path resolution inside Expo Router
 *
 * Re-exports for share / notifications:
 */
export {
  getServiceDetailsDeepLink,
  getServiceDetailsDeepLinkScreensPath,
  getServiceDetailsUniversalLink,
  getServiceDetailsUniversalLinkScreensPath,
  parseServiceIdFromUrl,
  PLAY_STORE_LISTING_URL,
} from "@/utils/serviceDeepLink";

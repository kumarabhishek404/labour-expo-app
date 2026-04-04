export type AnalyticsPlatform = "ios" | "android" | "web";

export type AnalyticsQueuedEvent = {
  name: string;
  properties?: Record<string, unknown>;
  clientTimestamp: string;
};

/**
 * Single POST body for `POST /analytics/events/batch`.
 * Persist **only on the server** (e.g. MongoDB). The app does not use AsyncStorage or sessionStorage for analytics.
 *
 * @see docs/backend/app-analytics-backend.md
 */
export type AnalyticsBatchPayload = {
  /** Correlates events from one app process launch; not persisted locally — only sent to API. */
  sessionId: string;
  platform: AnalyticsPlatform;
  appVersion: string | null;
  osVersion?: string | null;
  deviceModel?: string | null;
  deviceManufacturer?: string | null;
  /** `false` often means simulator. */
  isPhysicalDevice?: boolean | null;
  /** Device locale (e.g. `en-IN`). */
  locale?: string | null;
  /** IANA timezone (e.g. `Asia/Kolkata`). */
  timezone?: string | null;
  /** Native build string when available (Expo Constants). */
  nativeBuildVersion?: string | null;
  /**
   * EAS / Expo `runtimeVersion` — always a string for API validators (may be `""`).
   * Expo config may use an object policy; the client stringifies it when needed.
   */
  expoRuntimeVersion: string;
  /** App display name from config. */
  appName?: string | null;
  /** ISO 8601 — when this HTTP batch was assembled (client clock). */
  batchSentAt: string;
  events: AnalyticsQueuedEvent[];
};


import type { AnalyticsBatchPayload } from "@/utils/analyticsTypes";
import API_CLIENT from ".";

/**
 * Path is appended to `EXPO_PUBLIC_BASE_URL` (e.g. `http://host:4000/api/v1` + path).
 * Override if your backend uses a different route (must start with `/`).
 */
const batchPath =
  process.env.EXPO_PUBLIC_ANALYTICS_BATCH_PATH?.trim() || "/analytics/events/batch";

/**
 * Analytics uses the same axios client as the rest of the app (`makePostRequest`).
 * Errors are swallowed here so analytics never surfaces toasts; failures are dev-logged only.
 */
const postBatch = async (payload: AnalyticsBatchPayload): Promise<void> => {
  // if (process.env.EXPO_PUBLIC_ANALYTICS_DISABLED === "true") {
  //   return;
  // }
  // if (!process.env.EXPO_PUBLIC_BASE_URL) {
  //   if (__DEV__) {
  //     console.warn("[analytics] EXPO_PUBLIC_BASE_URL missing — events skipped");
  //   }
  //   return;
  // }
  try {
    await API_CLIENT.makePostRequest(batchPath, payload);
  } catch (error: unknown) {
    const err = error as { response?: { data?: unknown }; message?: string };
    if (__DEV__) {
      console.warn(`[analytics] POST ${batchPath} failed`, err?.response?.data ?? err?.message);
    }
  }
};

const ANALYTICS = {
  postBatch,
};

export default ANALYTICS;

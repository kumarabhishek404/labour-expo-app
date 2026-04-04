import React, { useEffect, useRef } from "react";
import { AppState } from "react-native";
import { flushAnalyticsQueue, trackEvent } from "@/utils/analytics";
import { AnalyticsEvents } from "@/utils/analyticsEvents";

/**
 * Registers session / foreground events and flushes the queue on background.
 * Renders nothing.
 */
export default function AnalyticsSession() {
  const appState = useRef(AppState.currentState);
  /** First transition to `active` is cold start — do not count as foreground. */
  const hasSeenActive = useRef(false);

  useEffect(() => {
    trackEvent(AnalyticsEvents.SESSION_START, {});
  }, []);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (next) => {
      const prev = appState.current;
      appState.current = next;

      if (next === "active") {
        if (!hasSeenActive.current) {
          hasSeenActive.current = true;
        } else if (prev === "background" || prev === "inactive") {
          trackEvent(AnalyticsEvents.APP_FOREGROUND, {});
        }
      }
      if (next === "background") {
        trackEvent(AnalyticsEvents.APP_BACKGROUND, {});
        void flushAnalyticsQueue();
      }
    });

    return () => sub.remove();
  }, []);

  return null;
}

import { Platform } from "react-native";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Localization from "expo-localization";

export type ClientPlatform = "ios" | "android" | "web";

export type ClientDeviceInfo = {
  platform: ClientPlatform;
  appVersion: string | null;
  osVersion: string | null;
  deviceModel: string | null;
  deviceManufacturer: string | null;
  isPhysicalDevice: boolean | null;
  locale: string | null;
  timezone: string | null;
  nativeBuildVersion: string | null;
  expoRuntimeVersion: string;
  appName: string | null;
};

function getTimezone(): string | null {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone ?? null;
  } catch {
    return null;
  }
}

function getLocaleTag(): string | null {
  try {
    const locales = Localization.getLocales();
    return locales[0]?.languageTag ?? null;
  } catch {
    return null;
  }
}

/** Expo may set `runtimeVersion` to a string or a policy object. */
export function normalizeExpoRuntimeVersion(
  ec: typeof Constants.expoConfig,
): string {
  if (!ec || typeof ec !== "object") return "";
  const raw = (ec as { runtimeVersion?: unknown }).runtimeVersion;
  if (raw == null) return "";
  if (typeof raw === "string") return raw;
  if (typeof raw === "number" || typeof raw === "boolean") {
    return String(raw);
  }
  try {
    return JSON.stringify(raw);
  } catch {
    return "";
  }
}

function getPlatform(): ClientPlatform {
  if (Platform.OS === "ios") return "ios";
  if (Platform.OS === "android") return "android";
  return "web";
}

/**
 * Device / app context shared by analytics payloads and every HTTP API call (headers).
 */
export function getClientDeviceInfo(): ClientDeviceInfo {
  const ec = Constants.expoConfig;
  return {
    platform: getPlatform(),
    appVersion:
      ec?.version ??
      Constants.nativeAppVersion ??
      (Constants as { manifest?: { version?: string } }).manifest?.version ??
      null,
    osVersion: Device.osVersion ?? null,
    deviceModel: Device.modelName ?? Device.deviceName ?? null,
    deviceManufacturer: Device.manufacturer ?? null,
    isPhysicalDevice:
      typeof Device.isDevice === "boolean" ? Device.isDevice : null,
    locale: getLocaleTag(),
    timezone: getTimezone(),
    nativeBuildVersion: Constants.nativeBuildVersion ?? null,
    expoRuntimeVersion: normalizeExpoRuntimeVersion(ec),
    appName: ec?.name ?? null,
  };
}

/** Prefix for headers added to every `API_CLIENT` request. */
const H = {
  platform: "X-Client-Platform",
  appVersion: "X-Client-App-Version",
  osVersion: "X-Client-OS-Version",
  deviceModel: "X-Client-Device-Model",
  deviceManufacturer: "X-Client-Device-Manufacturer",
  physicalDevice: "X-Client-Physical-Device",
  locale: "X-Client-Locale",
  timezone: "X-Client-Timezone",
  nativeBuild: "X-Client-Native-Build",
  expoRuntime: "X-Client-Expo-Runtime-Version",
  appName: "X-Client-App-Name",
} as const;

/**
 * String headers merged onto every axios request from `app/api/index.tsx`.
 * Omit empty values so backends can treat missing headers as unknown.
 */
export function getClientDeviceHeaders(): Record<string, string> {
  const d = getClientDeviceInfo();
  const out: Record<string, string> = {};

  const set = (key: string, value: string | null | undefined) => {
    if (value == null || value === "") return;
    out[key] = value;
  };

  set(H.platform, d.platform);
  set(H.appVersion, d.appVersion);
  set(H.osVersion, d.osVersion);
  set(H.deviceModel, d.deviceModel);
  set(H.deviceManufacturer, d.deviceManufacturer);
  if (d.isPhysicalDevice != null) {
    out[H.physicalDevice] = d.isPhysicalDevice ? "1" : "0";
  }
  set(H.locale, d.locale);
  set(H.timezone, d.timezone);
  set(H.nativeBuild, d.nativeBuildVersion);
  out[H.expoRuntime] = d.expoRuntimeVersion;
  set(H.appName, d.appName);

  return out;
}

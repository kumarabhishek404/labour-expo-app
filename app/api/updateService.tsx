import { Platform } from "react-native";
import Constants from "expo-constants";
import API_CLIENT from ".";

const DEFAULT_CONFIG = {
  latestVersion: Constants.expoConfig?.version ?? "1.0.0",
  minSupportedVersion: Constants.expoConfig?.version ?? "1.0.0",
  forceUpdate: false,
  message: "",
  playStoreUrl: "",
};

export async function fetchAppVersionConfig(): Promise<any> {
  try {
    const response = await API_CLIENT.makeGetRequest(
      `/appVersion/info?platform=${Platform.OS}&currentVersion=${Constants.expoConfig?.version}`,
    );

    if (!response?.data) {
      return DEFAULT_CONFIG;
    }

    return {
      latestVersion: response.data.latestVersion,
      minSupportedVersion: response.data.minSupportedVersion,
      forceUpdate: response.data.forceUpdate,
      updateMessage: response.data.updateMessage,
      playStoreUrl: response.data.playStoreUrl,
    };
  } catch (error) {
    console.warn("Version check failed, using fallback", error);
    return DEFAULT_CONFIG;
  }
}

const UPDATESERVICE = {
  fetchAppVersionConfig,
};

export default UPDATESERVICE;

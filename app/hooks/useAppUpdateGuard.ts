import { useEffect, useState } from "react";
import Constants from "expo-constants";
import { isVersionLess } from "@/utils/version";
import { checkForUpdates } from "@/components/commons/InAppUpdates";
import UPDATESERVICE from "../api/updateService";

export function useAppUpdateGuard() {
  const [forceUpdate, setForceUpdate] = useState(false);
  const [message, setMessage] = useState("");
  const [appUrl, setAppUrl] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const currentVersion = Constants.expoConfig?.version || "0.0.0";

        const config = await UPDATESERVICE?.fetchAppVersionConfig();

        if (
          config.forceUpdate &&
          isVersionLess(currentVersion, config.minSupportedVersion)
        ) {
          setForceUpdate(config?.forceUpdate);
          setMessage(config.updateMessage);
          setAppUrl(config?.playStoreUrl);
          return;
        }

        // Only check OTA if native version is valid
        await checkForUpdates();
      } catch (err) {
        console.log("Update guard failed", err);
      }
    })();
  }, []);

  return { forceUpdate, message, appUrl };
}

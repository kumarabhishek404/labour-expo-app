// UpdateManager.tsx

import React, { useEffect } from "react";
import { Alert } from "react-native";
import * as Updates from "expo-updates";

const UpdateManager = () => {
  useEffect(() => {
    const checkForUpdate = async () => {
      try {
        const update = await Updates.checkForUpdateAsync();

        if (update.isAvailable) {
          console.log("📡 OTA update available via Expo. Fetching...");

          await Updates.fetchUpdateAsync();

          // Prompt the user to restart and apply update
          Alert.alert(
            "Update Available",
            "A new version of the app is ready. Restart now?",
            [
              {
                text: "Later",
                style: "cancel",
              },
              {
                text: "Restart",
                onPress: async () => {
                  await Updates.reloadAsync();
                },
              },
            ]
          );
        } else {
          console.log("✅ App is up to date.");
        }
      } catch (error) {
        console.warn("⚠️ Failed to check for updates:", error);
      }
    };

    // Only check for updates on app launch
    checkForUpdate();
  }, []);

  return null;
};

export default UpdateManager;

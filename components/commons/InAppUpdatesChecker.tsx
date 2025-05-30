// UpdateManager.tsx

import React, { useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import InAppUpdates, { IAUUpdateKind } from 'react-native-in-app-updates';
import * as Updates from 'expo-updates';

const inAppUpdates = new InAppUpdates(true); // true = debug mode (optional)

const UpdateManager = () => {
  useEffect(() => {
    const checkPlayStoreUpdate = async () => {
      if (Platform.OS === 'android') {
        try {
          const result = await inAppUpdates.checkNeedsUpdate();

          if (result.shouldUpdate) {
            console.log("⬆️ Native update required. Launching Play Store update...");

            await inAppUpdates.startUpdate({
              updateType: Platform.Version >= 21 ? IAUUpdateKind.FLEXIBLE : IAUUpdateKind.IMMEDIATE,
            });

            return; // Exit if native update is triggered
          }
        } catch (err) {
          console.warn("❌ Failed to check Play Store update:", err);
        }
      }

      // If no native update is needed or not Android, check for OTA
      checkExpoUpdate();
    };

    const checkExpoUpdate = async () => {
      try {
        const updateAvailable = await Updates.checkForUpdateAsync();
        if (updateAvailable.isAvailable) {
          console.log("📡 OTA update available via Expo. Fetching...");
          await Updates.fetchUpdateAsync();

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
                onPress: () => Updates.reloadAsync(),
              },
            ]
          );
        }
      } catch (error) {
        console.warn("⚠️ OTA update check failed:", error);
      }
    };

    checkPlayStoreUpdate();
  }, []);

  return null;
};

export default UpdateManager;
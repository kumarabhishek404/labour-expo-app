import { t } from "@/utils/translationHelper";
import * as Updates from "expo-updates";
import { Alert } from "react-native";

export async function checkForUpdates() {
  try {
    console.log("Updates---", Updates);

    // ❗ OTA updates only work in production builds
    if (!Updates.isEnabled) return;

    const update = await Updates.checkForUpdateAsync();

    console.log("Updates logs---", {
      isEnabled: Updates.isEnabled,
      channel: Updates.channel,
      runtimeVersion: Updates.runtimeVersion,
      updateId: Updates.updateId,
    });

    if (update.isAvailable) {
      Alert.alert(
        t("updateAvailable"),
        t("newVersionIsAvailable"),
        [
          {
            text: t("restart"),
            onPress: async () => {
              try {
                await Updates.fetchUpdateAsync();
                await Updates.reloadAsync();
              } catch (e) {
                console.log("Update failed:", e);
              }
            },
          },
          {
            text: t("later"),
            style: "cancel",
          },
        ],
        { cancelable: false },
      );
    }
  } catch (error) {
    console.log("Error checking updates:", error);
  }
}

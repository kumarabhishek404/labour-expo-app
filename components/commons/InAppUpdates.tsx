import { t } from "@/utils/translationHelper";
import * as Updates from "expo-updates";
import { Alert } from "react-native";

export async function checkForUpdates() {
  try {
    const update = await Updates.checkForUpdateAsync();
    if (update.isAvailable) {
      await Updates.fetchUpdateAsync();
      Alert.alert(t("updateAvailable"), t("newVersionIsAvailable"), [
        { text: t("restart"), onPress: () => Updates.reloadAsync() },
        { text: t("later"), style: "cancel" },
      ]);
    }
  } catch (error) {
    console.log("Error checking updates:", error);
  }
}

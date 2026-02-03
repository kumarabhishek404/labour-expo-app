import React, { useState } from "react";
import { View, StyleSheet, Linking, Text, Button } from "react-native";
import Colors from "@/constants/Colors";
import { t } from "@/utils/translationHelper";

export default function ForceUpdateScreen({
  message,
  appUrl,
}: {
  message: string;
  appUrl: string;
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("updateRequired")}</Text>
      <Text style={styles.message}>{t(message)}</Text>
      <Button
        title={t("updateNow")}
        onPress={() => {
          Linking.openURL(appUrl);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: Colors.white,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
  },
  message: {
    marginVertical: 20,
    textAlign: "center",
    fontSize: 15,
    color: "#555",
  },
});

import React from "react";
import { View, StyleSheet } from "react-native";
import CustomHeading from "./CustomHeading";
import CustomText from "./CustomText";
import { t } from "@/utils/translationHelper";
import Colors from "@/constants/Colors";

const OurVision = () => {
  return (
    <View style={styles.container}>
      <CustomHeading>{t("ourVision")}</CustomHeading>

      <View style={styles.divider}></View>

      <CustomText baseFont={14}>{t("ourVisionDescription")}</CustomText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingVertical: 80,
    backgroundColor: Colors?.white,
  },
  divider: {
    alignSelf: "center",
    width: 50,
    height: 2,
    backgroundColor: "#ccc",
    marginTop: 8,
    marginBottom: 14,
  },
  iconsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  iconContainer: {
    alignItems: "center",
    flex: 1,
  },
});

export default OurVision;

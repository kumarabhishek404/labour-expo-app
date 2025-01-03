import {
  AntDesign,
  FontAwesome6,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import React from "react";
import { View, StyleSheet } from "react-native";
import CustomHeading from "./CustomHeading";
import CustomText from "./CustomText";
import { t } from "@/utils/translationHelper";
import Colors from "@/constants/Colors";

const HowAppWorks = () => {
  return (
    <View style={styles.container}>
      {/* Replaced hardcoded text with t('key') */}
      <CustomHeading>{t("howAppWorks")}</CustomHeading>

      <View style={styles.divider}></View>

      <View style={styles?.roleDescription}>
        <CustomHeading textAlign="left">
          {t("employer")} -{" "}
          <CustomText fontSize={14} textAlign="left">
            {t("howAppWorkEmployer")}
          </CustomText>
        </CustomHeading>
      </View>

      <View style={styles?.roleDescription}>
        <CustomHeading textAlign="left">
          {t("worker")} -{" "}
          <CustomText fontSize={14}>{t("howAppWorkWorker")}</CustomText>
        </CustomHeading>
      </View>

      <View style={styles?.roleDescription}>
        <CustomHeading textAlign="left">
          {t("mediator")} -{" "}
          <CustomText fontSize={14}>{t("howAppWorkMediator")}</CustomText>
        </CustomHeading>
      </View>
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
  roleDescription: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
});

export default HowAppWorks;

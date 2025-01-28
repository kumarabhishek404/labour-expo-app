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

const AboutCompany = () => {
  return (
    <View style={styles.container}>
      {/* Replaced hardcoded text with t('key') */}
      <CustomHeading>{t("aboutOurCompany")}</CustomHeading>

      <View style={styles.divider}></View>

      <CustomText baseFont={14}>
        {t("companyDescription1")}
      </CustomText>

      <CustomText baseFont={14}>
        {t("companyDescription2")}
      </CustomText>

      <View style={styles.iconsRow}>
        {/* Vision Icon */}
        <View style={styles.iconContainer}>
          <AntDesign name="staro" size={40} color="#1F3E72" />
          <CustomHeading baseFont={14}>{t("vision")}</CustomHeading>
        </View>

        {/* Missions Icon */}
        <View style={styles.iconContainer}>
          <FontAwesome6 name="medal" size={40} color="#1F3E72" />
          <CustomHeading baseFont={14}>{t("missions")}</CustomHeading>
        </View>

        {/* Goals Icon */}
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name="bullseye-arrow"
            size={40}
            color="#1F3E72"
          />
          <CustomHeading baseFont={14}>{t("goals")}</CustomHeading>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingVertical: 60,
    backgroundColor: "#F0F4FA",
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

export default AboutCompany;
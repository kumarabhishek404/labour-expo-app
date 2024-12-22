import Colors from "@/constants/Colors";
import React from "react";
import { StyleSheet, View } from "react-native";
import CustomHeading from "./CustomHeading";
import CustomText from "./CustomText";
import { useTranslation } from "@/utils/i18n";

interface WallletInformationProps {
  type: string;
  wallet: any;
  style?: any;
}

const WallletInformation = ({
  type,
  wallet,
  style,
}: WallletInformationProps) => {
  const { t } = useTranslation();

  const renderSpentsSection = () => (
    <View style={styles.infoBoxWrapper}>
      <View
        style={[
          styles.infoBox,
          {
            borderRightColor: "#dddddd",
            borderRightWidth: 1,
          },
        ]}
      >
        <CustomHeading fontSize={20}>₹ {wallet?.work || 0}</CustomHeading>
        <CustomText fontSize={14}>{t("spents")}</CustomText>
      </View>
      <View style={styles.infoBox}>
        <CustomHeading fontSize={20}>₹ {wallet?.tip || 0}</CustomHeading>
        <CustomText fontSize={14}>{t("tip")}</CustomText>
      </View>
    </View>
  );

  const renderEarningsSection = () => (
    <View style={styles.infoBoxWrapper}>
      <View
        style={[
          styles.infoBox,
          {
            borderRightColor: "#dddddd",
            borderRightWidth: 1,
          },
        ]}
      >
        <CustomHeading fontSize={20}>₹ {wallet?.work || 0}</CustomHeading>
        <CustomText fontSize={14}>{t("earnings")}</CustomText>
      </View>
      <View style={styles.infoBox}>
        <CustomHeading fontSize={20}>₹ {wallet?.rewards || 0}</CustomHeading>
        <CustomText fontSize={14}>{t("rewards")}</CustomText>
      </View>
    </View>
  );

  return (
    <View style={styles?.container}>
      {(type === "spents" || type === "both") && (
        <>
          <CustomHeading textAlign="left" style={[style]}>
            {t("spents")}
          </CustomHeading>
          {renderSpentsSection()}
        </>
      )}
      {(type === "earnings" || type === "both") && (
        <>
          <CustomHeading textAlign="left" style={[style]}>
            {t("earnings")}
          </CustomHeading>
          {renderEarningsSection()}
        </>
      )}
    </View>
  );
};

export default WallletInformation;

const styles = StyleSheet.create({
  container: {
    // padding: 20,
  },
  workInfoHeading: {
    color: Colors.primary,
    fontWeight: "700",
    fontSize: 16,
    lineHeight: 26,
  },
  infoBoxWrapper: {
    marginTop: 10,
    marginBottom: 20,
    borderBottomColor: "#dddddd",
    borderBottomWidth: 1,
    borderTopColor: "#dddddd",
    borderTopWidth: 1,
    backgroundColor: "#ffffff",
    flexDirection: "row",
    height: 100,
  },
  infoBox: {
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
});

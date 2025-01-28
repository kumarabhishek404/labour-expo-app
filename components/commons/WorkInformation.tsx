import Colors from "@/constants/Colors";
import React from "react";
import { StyleSheet, View } from "react-native";
import CustomHeading from "./CustomHeading";
import CustomText from "./CustomText";
import { t } from "@/utils/translationHelper";

interface WorkInformationProps {
  information: any;
  style?: any;
}

const WorkInformation = ({ information, style }: WorkInformationProps) => {
  return (
    <View style={styles?.container}>
      <CustomHeading textAlign="left" style={[style]}>
        {t("workInformation")}
      </CustomHeading>
      <View style={[styles.workInfoWrapper, { marginTop: 10 }]}>
        <View
          style={[
            styles.workInfoBox,
            {
              borderRightColor: "#dddddd",
              borderRightWidth: 1,
            },
          ]}
        >
          <View style={styles?.iconWrapper}>
            <CustomHeading baseFont={26}>
              {information?.total || 0}
            </CustomHeading>
          </View>
          <CustomText baseFont={14}>{t("totalTasks")}</CustomText>
        </View>
        <View style={styles.workInfoBox}>
          <View style={styles?.iconWrapper}>
            <CustomHeading baseFont={26}>
              {information?.completed || 0}
            </CustomHeading>
          </View>
          <CustomText baseFont={14}>{t("completed")}</CustomText>
        </View>
      </View>
      <View style={[styles.workInfoWrapper, { borderTopWidth: 0 }]}>
        <View
          style={[
            styles.workInfoBox,
            {
              borderRightColor: "#dddddd",
              borderRightWidth: 1,
            },
          ]}
        >
          <View style={styles?.iconWrapper}>
            <CustomHeading baseFont={26}>
              {information?.pending || 0}
            </CustomHeading>
          </View>
          <CustomText baseFont={14}>{t("pending")}</CustomText>
        </View>
        <View style={styles.workInfoBox}>
          <View style={styles?.iconWrapper}>
            <CustomHeading baseFont={26}>
              {information?.cancelled || 0}
            </CustomHeading>
          </View>
          <CustomText baseFont={14}>{t("cancelled")}</CustomText>
        </View>
      </View>
    </View>
  );
};

export default WorkInformation;

const styles = StyleSheet.create({
  container: {
    // padding: 20,
  },
  workInfoHeading: {
    color: Colors.primary,
    // marginLeft: 30,
    fontWeight: "700",
    fontSize: 16,
    lineHeight: 26,
  },
  workInfoWrapper: {
    // marginTop: 10,
    borderBottomColor: "#dddddd",
    borderBottomWidth: 1,
    borderTopColor: "#dddddd",
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    height: 100,
    display: "flex",
    flexDirection: "row",
  },
  workInfoBox: {
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  menuWrapper: {
    marginTop: 10,
  },
  iconWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 6,
  },
  itemValue: {
    fontSize: 22,
    fontWeight: "600",
  },
});

import React from "react";
import { View, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import CustomHeading from "./CustomHeading";
import Colors from "@/constants/Colors";
import CustomText from "./CustomText";
import { t } from "@/utils/translationHelper";

const PendingApprovalMessage = () => {
  return (
    <View style={styles.container}>
      <View style={styles.background}>
        <FontAwesome name="hourglass-half" size={80} color="#fff" />
        <CustomHeading baseFont={24} color={Colors?.white}>
          {t("pendingApprovalHeading")}
        </CustomHeading>
        <CustomText color={Colors?.white} baseFont={16} fontWeight="500">
          {t("pendingApprovalMessage")}
        </CustomText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  background: {
    width: "100%",
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderRadius: 15,
    alignItems: "center",
    backgroundColor: "#FFBF00",
    gap: 10,
  },
});

export default PendingApprovalMessage;

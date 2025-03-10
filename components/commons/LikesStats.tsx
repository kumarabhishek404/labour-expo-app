import Atoms from "@/app/AtomStore";
import { useAtomValue } from "jotai";
import React from "react";
import { View, StyleSheet } from "react-native";
import CustomHeading from "./CustomHeading";
import CustomText from "./CustomText";
import { t } from "@/utils/translationHelper";
import Colors from "@/constants/Colors";

const StatsCard = () => {
  const userDetails = useAtomValue(Atoms?.UserAtom);

  return (
    <View style={styles.container}>
      <View>
        <CustomHeading baseFont={24}>
          {userDetails?.myBookings?.length || 0}
        </CustomHeading>
        <CustomText
          color={Colors?.heading}
          style={{ textTransform: "uppercase" }}
        >
          {t("myBookings")}
        </CustomText>
      </View>
      <View>
        <CustomHeading baseFont={24}>
          {userDetails?.likedServices?.length || 0}
        </CustomHeading>
        <CustomText color={Colors?.heading}>{t("savedServices")}</CustomText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: Colors?.background,
    borderRadius: 8,
    padding: 15,
    marginHorizontal: 20,
    alignItems: "center",
    justifyContent: "space-around",
    elevation: 6, // For Android shadow
    shadowColor: "#000", // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    marginBottom: 20,
  },
});

export default StatsCard;

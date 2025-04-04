import React from "react";
import CustomText from "./CustomText";
import { t } from "@/utils/translationHelper";
import { View } from "react-native";
import { StyleSheet } from "react-native";

interface ShowAddressProps {
  address: string;
  numberOfLines?: number; // Optional prop for controlling text wrapping
}

const ShowAddress: React.FC<ShowAddressProps> = ({
  address,
  numberOfLines,
}) => {
  return (
    <View style={styles.container}>
      <CustomText textAlign="left" baseFont={17} numberOfLines={numberOfLines}>
        📍
      </CustomText>
      <CustomText
        textAlign="left"
        baseFont={17}
        numberOfLines={numberOfLines}
        style={{ flex: 1 }}
      >
        {address || t("addressNotFound")}
      </CustomText>
    </View>
  );
};

export default ShowAddress;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 3,
  },
});

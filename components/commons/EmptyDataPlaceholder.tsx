import Colors from "@/constants/Colors";
import React from "react";
import { View, Image, StyleSheet, useWindowDimensions } from "react-native";
import EmptyPlaceholder from "../../assets/empty-placeholder.png";
import CustomText from "./CustomText";
import { t } from "@/utils/translationHelper";

const HEADER_HEIGHT = 200; // Adjust based on your actual header height

const EmptyDatePlaceholder = ({
  title,
  parentHeight,
  leftHeight = HEADER_HEIGHT,
}: any) => {
  const { height } = useWindowDimensions(); // Get dynamic height of the screen

  return (
    <View
      style={[
        styles.container,
        { height: (parentHeight ?? height) - leftHeight },
      ]}
    >
      <Image source={EmptyPlaceholder} style={styles.image} />
      <CustomText baseFont={14} fontWeight="medium">
        {t("notFoundAny", { title: t(title) })}
      </CustomText>
    </View>
  );
};

export default EmptyDatePlaceholder;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center", // Centers vertically
    alignItems: "center", // Centers horizontally
    paddingBottom: 20, // Adjust if needed
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 10,
    resizeMode: "contain",
  },
});

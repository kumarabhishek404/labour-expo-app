import Colors from "@/constants/Colors";
import React from "react";
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  useWindowDimensions,
} from "react-native";
import EmptyPlaceholder from "../../assets/empty-placeholder.png";
import CustomText from "./CustomText";

const HEADER_HEIGHT = 200; // Adjust based on your actual header height

const EmptyDatePlaceholder = ({ title, leftHeight = HEADER_HEIGHT }: any) => {
  const { height } = useWindowDimensions(); // Get dynamic height of the screen

  return (
    <View style={[styles.container, { height: height - leftHeight }]}>
      <Image source={EmptyPlaceholder} style={styles.image} />
      <CustomText baseFont={14} fontWeight="medium">
        Not Found Any {title}
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

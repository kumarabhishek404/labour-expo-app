import Colors from "@/constants/Colors";
import React from "react";
import { StyleSheet, View, Modal, ActivityIndicator } from "react-native";

const OnPageLoader = (props: any) => {
  const { parentStyle, ...attributes } = props;

  return (
    <View style={[styles.modalBackground, parentStyle]}>
      <View style={styles.activityIndicatorWrapper}>
        <ActivityIndicator size={50} color={Colors?.primary} animating={true} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000040", // Semi-transparent background to focus on the loader
  },
  activityIndicatorWrapper: {
    backgroundColor: "#FFFFFF",
    height: 100,
    width: 100,
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center", // Adjusted to ensure the loader is centered
  },
});

export default OnPageLoader;

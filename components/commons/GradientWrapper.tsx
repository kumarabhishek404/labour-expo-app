import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/Colors";

interface GradientWrapperProps {
  children: React.ReactNode;
  height?: number | string;
}

const GradientWrapper: React.FC<GradientWrapperProps> = ({ children, height }) => {
  const defaultHeight = height || Dimensions.get("window").height;

  return (
    <LinearGradient
      colors={[Colors?.primary, Colors?.secondaryButton]} // Light to dark gradient
      style={[styles.container, { height: defaultHeight as number | undefined }]}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 10,
  },
});

export default GradientWrapper;
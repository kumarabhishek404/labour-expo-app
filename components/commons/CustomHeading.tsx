import Colors from "@/constants/Colors";
import React from "react";
import { Text, StyleSheet } from "react-native";

interface CustomTextProps {
  children: any;
  color?: string;
  fontSize?: number;
  fontWeight?: string;
  textAlign?: string;
  margin?: number;
  padding?: number;
  lineHeight?: number;
  style?: any;
  restProps?: any;
}

const CustomHeading = ({
  children,
  color = Colors?.heading,
  fontSize = 16,
  fontWeight = "bold",
  textAlign = "center",
  margin = 0,
  padding = 0,
  lineHeight,
  style,
  ...restProps
}: CustomTextProps) => {
  return (
    <Text
      style={[
        styles.text,
        {
          color,
          fontSize,
          fontWeight,
          textAlign,
          margin,
          padding,
        },
        style,
      ]}
      {...restProps}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {},
});

export default CustomHeading;

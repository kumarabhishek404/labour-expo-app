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

const CustomText = ({
  children,
  color = Colors?.text,
  fontSize = 12,
  fontWeight = "normal",
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
        styles?.text,
        {
          color,
          fontSize,
          fontWeight,
          textAlign,
          margin,
          padding,
          lineHeight: lineHeight || fontSize * 1.5,
        },
        style, // Any extra styles passed in
      ]}
      {...restProps} // Pass through any extra props to Text
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    // Global styles can go here if needed
  },
});

export default CustomText;

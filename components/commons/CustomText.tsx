import LOCAL_CONTEXT from "@/app/context/locale";
import Colors from "@/constants/Colors";
import { getFontSize } from "@/constants/functions";
import React from "react";
import { Text, StyleSheet } from "react-native";

interface CustomTextProps {
  children: any;
  color?: string;
  baseFont?: number;
  fontWeight?: string;
  textAlign?: string;
  margin?: number;
  padding?: number;
  lineHeight?: number;
  numberOfLines?: number; // Added prop
  style?: any;
  restProps?: any;
}

const CustomText = ({
  children,
  color = Colors?.text,
  baseFont = 16,
  fontWeight = "normal",
  textAlign = "center",
  margin = 0,
  padding = 0,
  lineHeight,
  numberOfLines, // Extracted from props
  style,
  ...restProps
}: CustomTextProps) => {
  const { locale } = LOCAL_CONTEXT.useLocale();
  return (
    <Text
      style={[
        styles?.text,
        {
          color,
          fontWeight,
          textAlign,
          margin,
          padding,
          // lineHeight: lineHeight || baseFont * 1.2,
        },
        style,
        { fontSize: getFontSize(locale, baseFont) },
      ]}
      numberOfLines={numberOfLines} // ✅ Applied numberOfLines
      ellipsizeMode="tail" // ✅ Ensures truncated text has "..."
      {...restProps}
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

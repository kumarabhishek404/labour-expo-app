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
  style?: any;
  restProps?: any;
}

const CustomHeading = ({
  children,
  color = Colors?.primary,
  baseFont,
  fontWeight = "bold",
  textAlign = "center",
  margin = 0,
  padding = 0,
  lineHeight,
  style,
  ...restProps
}: CustomTextProps) => {
  const { locale } = LOCAL_CONTEXT.useLocale();
  return (
    <Text
      style={[
        styles.text,
        {
          color,
          fontWeight,
          textAlign,
          margin,
          padding,
        },
        style,
        { fontSize: getFontSize(locale, baseFont) },
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

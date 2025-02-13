import LOCAL_CONTEXT from "@/app/context/locale";
import Colors from "@/constants/Colors";
import { getFontSize } from "@/constants/functions";
import React from "react";
import { Text, StyleSheet } from "react-native";

interface ErrorTextProps {
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

const ErrorText = ({
  children,
  color = Colors?.error,
  baseFont = 12,
  fontWeight = "normal",
  textAlign = "left",
  margin = 0,
  padding = 0,
  lineHeight,
  style,
  ...restProps
}: ErrorTextProps) => {
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
          lineHeight: lineHeight || baseFont * 1.2,
        },
        style, // Any extra styles passed in
        { fontSize: getFontSize(locale, baseFont) },
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

export default ErrorText;

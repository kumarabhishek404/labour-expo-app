import { ActivityIndicator, TouchableOpacity } from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
import CustomHeading from "../commons/CustomHeading";

type ButtonProps = {
  isPrimary: boolean;
  title: string;
  onPress: any;
  icon?: any;
  style?: any;
  textStyle?: any;
  bgColor?: string;
  textColor?: string;
  loading?: boolean;
  disabled?: boolean;
};

export default function Button({
  isPrimary,
  title,
  onPress,
  icon,
  style,
  textStyle,
  bgColor,
  textColor,
  loading,
  disabled,
}: ButtonProps) {
  return (
    <>
      {isPrimary ? (
        <TouchableOpacity
          disabled={disabled || loading}
          onPress={onPress}
          style={{
            backgroundColor: bgColor || Colors?.heading,
            borderWidth: 2,
            borderColor: bgColor || Colors?.heading,
            paddingVertical: 6,
            paddingHorizontal: 14,
            borderRadius: 8,
            flexDirection: loading || icon ? "row" : "column",
            alignItems: "center",
            justifyContent: "center",
            ...style,
          }}
        >
          {icon && icon}
          <CustomHeading
            style={{
              color: textColor || Colors?.white,
              fontWeight: "700",
              textAlign: "center",
              fontSize: 16,
              display: "flex",
              flexWrap: "wrap",
              ...textStyle,
            }}
          >
            {title}
          </CustomHeading>
          {loading && (
            <ActivityIndicator
              style={{ marginLeft: 10 }}
              color={Colors?.white}
              animating={true}
            />
          )}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          disabled={disabled || loading}
          onPress={onPress}
          style={{
            backgroundColor: bgColor || Colors?.white,
            borderWidth: 2,
            borderColor: Colors?.heading,
            paddingVertical: 6,
            paddingHorizontal: 14,
            borderRadius: 8,
            flexDirection: loading || icon ? "row" : "column",
            alignItems: "center",
            justifyContent: "center",
            ...style,
          }}
        >
          {icon && icon}
          <CustomHeading
            style={{
              color: textColor || Colors?.primary,
              fontWeight: "700",
              textAlign: "center",
              fontSize: 16,
              display: "flex",
              flexWrap: "wrap",
              ...textStyle,
            }}
          >
            {title}
          </CustomHeading>
          {loading && (
            <ActivityIndicator
              style={{ marginLeft: 10 }}
              color={Colors?.primary}
              animating={true}
            />
          )}
        </TouchableOpacity>
      )}
    </>
  );
}

import { Text, TouchableOpacity } from "react-native";
import React from "react";
import Colors from "@/constants/Colors";

type ButtonProps = {
  isPrimary: boolean;
  style?: any;
  textStyle?: any;
  bgColor?: string;
  title: string;
  textColor?: string;
  onPress: any;
};

export default function Button({
  isPrimary,
  style,
  textStyle,
  bgColor,
  title,
  textColor,
  onPress,
}: ButtonProps) {
  return (
    <>
      {isPrimary ? (
        <TouchableOpacity
          onPress={onPress}
          style={{
            backgroundColor: bgColor || Colors?.primary,
            borderWidth: 2,
            borderColor: Colors?.primary,
            paddingVertical: 8,
            paddingHorizontal: 20,
            borderRadius: 4,
            ...style,
          }}
        >
          <Text
            style={{
              color: textColor || Colors?.white,
              fontWeight: "700",
              textAlign: "center",
              fontSize: 18,
              ...textStyle,
            }}
          >
            {title}
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={onPress}
          style={{
            backgroundColor: bgColor || Colors?.white,
            borderWidth: 2,
            borderColor: Colors?.primary,
            paddingVertical: 8,
            paddingHorizontal: 20,
            borderRadius: 4,
            ...style,
          }}
        >
          <Text
            style={{
              color: textColor || Colors?.primary,
              fontWeight: "700",
              textAlign: "center",
              fontSize: 18,
              ...textStyle,
            }}
          >
            {title}
          </Text>
        </TouchableOpacity>
      )}
    </>
  );
}

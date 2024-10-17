import { ActivityIndicator, Text, TouchableOpacity } from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import Loader from "./Loader";

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
}: ButtonProps) {
  return (
    <>
      {isPrimary ? (
        <TouchableOpacity
          disabled={loading}
          onPress={onPress}
          style={{
            backgroundColor: bgColor || Colors?.primary,
            borderWidth: 2,
            borderColor: bgColor || Colors?.primary,
            paddingVertical: 8,
            paddingHorizontal: 20,
            borderRadius: 8,
            flexDirection: loading || icon ? "row" : "column",
            alignItems: "center",
            justifyContent: "center",
            ...style,
          }}
        >
          {icon && icon}
          <Text
            style={{
              color: textColor || Colors?.white,
              fontWeight: "700",
              textAlign: "center",
              fontSize: 18,
              display: "flex",
              flexWrap: "wrap",
              ...textStyle,
            }}
          >
            {title}
          </Text>
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
          disabled={loading}
          onPress={onPress}
          style={{
            backgroundColor: bgColor || Colors?.white,
            borderWidth: 2,
            borderColor: Colors?.primary,
            paddingVertical: 8,
            paddingHorizontal: 20,
            borderRadius: 8,
            flexDirection: loading || icon ? "row" : "column",
            alignItems: "center",
            justifyContent: "center",
            ...style,
          }}
        >
          {icon && icon}
          <Text
            style={{
              color: textColor || Colors?.primary,
              fontWeight: "700",
              textAlign: "center",
              fontSize: 18,
              display: "flex",
              flexWrap: "wrap",
              ...textStyle,
            }}
          >
            {title}
          </Text>
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

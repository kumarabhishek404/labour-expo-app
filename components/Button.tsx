import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

export default function Button({
  style,
  bgColor,
  btnLabel,
  textColor,
  Press,
}: any) {
  return (
    <TouchableOpacity
      onPress={Press}
      style={{
        backgroundColor: bgColor,
        borderRadius: 100,
        alignItems: "center",
        width: 350,
        paddingVertical: 5,
        marginVertical: 10,
        ...style,
      }}
    >
      <Text style={{ color: textColor, fontSize: 25, fontWeight: "bold" }}>
        {btnLabel}
      </Text>
    </TouchableOpacity>
  );
}

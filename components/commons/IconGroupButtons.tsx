import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import IconButton from "./IconButtonWithText";

const IconButtonGroup = ({ buttons }: any) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10,
        gap: 40,
      }}
    >
      {buttons.map((button: any, index: number) => (
        <IconButton
          key={index}
          icon={button.icon}
          label={button.label}
          onPress={button.onPress}
        />
      ))}
    </View>
  );
};

export default IconButtonGroup;

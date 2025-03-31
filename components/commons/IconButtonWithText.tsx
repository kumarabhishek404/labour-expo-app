import Colors from "@/constants/Colors";
import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import CustomText from "./CustomText";

const IconButton = ({ icon, label, onPress }: any) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ alignItems: "center", marginHorizontal: 10 }}
    >
      <View
        style={{
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: Colors?.white,
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <Image
          source={icon}
          style={{ width: 50, height: 50, marginBottom: -13 }}
        />
      </View>
      <CustomText
        baseFont={16}
        fontWeight="600"
        color={Colors?.white}
        style={{
          marginTop: 5,
        }}
      >
        {label}
      </CustomText>
    </TouchableOpacity>
  );
};

export default IconButton;

import Colors from "@/constants/Colors";
import React from "react";
import { View, Image } from "react-native";
import EmptyPlaceholder from "../../assets/empty-placeholder.png";
import CustomText from "./CustomText";

const EmptyDatePlaceholder = ({ title }: any) => {
  return (
    <View
      style={{
        height: "60%",
        justifyContent: "center",
        alignItems: "center",
        zIndex: -1,
      }}
    >
      <Image source={EmptyPlaceholder} />
      <CustomText fontSize={20}>Not Found Any {title}</CustomText>
    </View>
  );
};

export default EmptyDatePlaceholder;

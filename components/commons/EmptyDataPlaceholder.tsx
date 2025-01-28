import Colors from "@/constants/Colors";
import React from "react";
import { View, Image } from "react-native";
import EmptyPlaceholder from "../../assets/empty-placeholder.png";
import CustomText from "./CustomText";

const EmptyDatePlaceholder = ({ title }: any) => {
  return (
    <View
      style={{
        // height: "60%",
        justifyContent: "center",
        alignItems: "center",
        zIndex: -1,
        margin: 30,
      }}
    >
      <Image
        source={EmptyPlaceholder}
        style={{ width: 100, height: 100, marginBottom: 10 }}
      />
      <CustomText baseFont={12}>Not Found Any {title}</CustomText>
    </View>
  );
};

export default EmptyDatePlaceholder;

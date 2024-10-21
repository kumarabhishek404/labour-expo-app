import Colors from "@/constants/Colors";
import React from "react";
import { View, Text, Image } from "react-native";
import EmptyPlaceholder from "../../assets/empty-placeholder.png";

const EmptyDatePlaceholder = ({ title }: any) => {
  return (
    <View
      style={{
        height: "60%",
        justifyContent: "center",
        alignItems: "center",
        zIndex: -1
      }}
    >
      <Image source={EmptyPlaceholder} />
      <Text style={{ fontSize: 20, fontWeight: '500', color: Colors?.secondary, marginTop: 20 }}>
        Not Found Any {title}
      </Text>
    </View>
  );
};

export default EmptyDatePlaceholder;

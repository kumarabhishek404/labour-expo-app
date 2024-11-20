import React from "react";
import { View, ImageBackground } from "react-native";
import backgroundImage from "../../assets/images/leaves.jpg";

const Background = ({ children }: any) => {
  return (
    <View>
      <ImageBackground source={backgroundImage} style={{ height: "100%" }} />
      <View style={{ position: "absolute" }}>{children}</View>
    </View>
  );
};

export default Background;

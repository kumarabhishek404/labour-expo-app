import Colors from "@/constants/Colors";
import React from "react";
import { Badge } from "react-native-paper";
import CustomText from "./CustomText";

const BadgeComponent = ({ count, style }: any) => {
  return (
    <Badge
      size={22}
      style={{
        alignSelf: "flex-start",
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -6,
        marginLeft: -5,
        backgroundColor: Colors?.tertiery,
        borderWidth: 1,
        borderColor: Colors?.white,
        fontSize: 12,
        fontWeight: 600,
        ...style,
      }}
    >
      {count}
    </Badge>
  );
};

export default BadgeComponent;

import Colors from "@/constants/Colors";
import React from "react";
import { Badge } from "react-native-paper";

const BadgeComponent = ({ count, style }: any) => {
  return (
    <Badge
      size={19}
      style={{
        alignSelf: "flex-start",
        marginTop: -6,
        marginLeft: -5,
        backgroundColor: Colors?.tertiery,
        fontWeight: "600",
        fontSize: 11,
        ...style,
      }}
    >
      {count}
    </Badge>
  );
};

export default BadgeComponent;

import React from "react";
import { TouchableOpacity, View } from "react-native";
import CustomText from "./CustomText";
import Colors from "@/constants/Colors";
import { t } from "@/utils/translationHelper";

const TopHeaderLinks = ({ title, onPress, icon }: any) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
      }}
    >
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 5,
        }}
        onPress={title?.length > 0 ? onPress[0] : onPress}
      >
        {icon?.length > 0 ? icon[0] : icon}
        <CustomText
          baseFont={18}
          color={Colors?.primary}
          fontWeight="bold"
          style={{
            flexWrap: "wrap",
            textAlign: "left",
          }}
        >
          {title?.length > 0 ? t(title[0]) : t(title)}
        </CustomText>
      </TouchableOpacity>

      {title?.length > 1 && (
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
          onPress={onPress[1]}
        >
          {icon[1]}
          <CustomText
            baseFont={18}
            color={Colors?.primary}
            fontWeight="bold"
            style={{
              flexWrap: "wrap",
              textAlign: "right",
            }}
          >
            {t(title[1])}
          </CustomText>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default TopHeaderLinks;

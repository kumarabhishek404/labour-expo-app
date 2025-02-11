import Colors from "@/constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import CustomText from "./CustomText";
import { t } from "@/utils/translationHelper";

interface SkillSelectorProps {
  style?: any;
  tagStyle?: any;
  userSkills: Array<string>;
}

const ShowSkills = ({ userSkills, style, tagStyle }: SkillSelectorProps) => {
  return (
    <View style={[styles.container, style]}>
      <MaterialCommunityIcons
        name="hammer-wrench"
        size={16}
        color={Colors.primary}
      />
      <View style={{ flex: 1, flexDirection: "row", gap: 4 }}>
        {userSkills?.map((skill: any, index: number) => (
          <View key={index} style={[styles?.skillTag, tagStyle]}>
            <CustomText color={Colors?.white} fontWeight="medium">
              {t(skill?.skill)}{" "}
              {skill?.pricePerDay && `- ₹${skill?.pricePerDay}`}
            </CustomText>
          </View>
        ))}
      </View>
    </View>
  );
};

export default ShowSkills;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 5,
  },
  skillTag: {
    backgroundColor: Colors?.tertiery,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
});

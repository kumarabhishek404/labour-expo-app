import Colors from "@/constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { View, StyleSheet } from "react-native";
import CustomText from "./CustomText";
import { t } from "@/utils/translationHelper";

interface SkillSelectorProps {
  style?: any;
  type?: string;
  tagStyle?: any;
  userSkills: Array<{ skill: string; pricePerDay?: number }>;
}

const ShowSkills = ({
  type,
  userSkills,
  style,
  tagStyle,
}: SkillSelectorProps) => {
  return (
    <View style={[styles.container, style]}>
      <MaterialCommunityIcons
        name="hammer-wrench"
        size={16}
        color={Colors.tertieryButton}
        style={{ paddingTop: 3 }}
      />
      {type === "small" ? (
        <View style={styles.skillWrapper}>
          {userSkills?.map((skill, index) => (
            <View key={index}>
              <CustomText color={Colors.tertieryButton} fontWeight="bold">
                {t(skill.skill)}{" "}
                {skill.pricePerDay ? `- ₹${skill.pricePerDay}` : ""}
                {userSkills?.length - 1 !== index ? ", " : ""}
              </CustomText>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.skillWrapper}>
          {userSkills?.map((skill, index) => (
            <View key={index} style={[styles.skillTag, tagStyle]}>
              <CustomText color={Colors.white} fontWeight="medium">
                {t(skill.skill)}{" "}
                {skill.pricePerDay ? `- ₹${skill.pricePerDay}` : ""}
              </CustomText>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default ShowSkills;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: 5,
  },
  skillWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    flex: 1,
  },
  skillTag: {
    backgroundColor: Colors?.tertieryButton,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
});

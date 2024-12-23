import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import ModalComponent from "./Modal";
import MultiSelectDropdownComponent from "../inputs/MultiSelectDropdown";
import { getWorkLabel, removeEmptyStrings } from "@/constants/functions";
import CustomText from "./CustomText";
import CustomHeading from "./CustomHeading";
import { t } from "@/utils/translationHelper";

interface SkillSelectorProps {
  canAddSkills: boolean;
  isShowLabel?: boolean;
  style?: any;
  tagStyle?: any;
  tagTextStyle?: any;
  selectedSkills?: Array<string>;
  setSelectedSkills?: any;
  userSkills: Array<string>;
  availableSkills: any;
  handleAddSkill?: any;
  count?: number; // Optional prop to control the number of displayed skills
}

const SkillSelector = ({
  canAddSkills,
  isShowLabel,
  style,
  tagStyle,
  tagTextStyle,
  selectedSkills,
  setSelectedSkills,
  userSkills,
  availableSkills,
  handleAddSkill,
  count,
}: SkillSelectorProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const onAddSkills = async () => {
    try {
      await handleAddSkill();
      setIsModalVisible(false);
    } catch (err) {
      console.log("Error adding skill:", err);
    }
  };

  const renderSkills = () => {
    const skillsToShow = count
      ? removeEmptyStrings(userSkills)?.slice(0, count)
      : removeEmptyStrings(userSkills);

    return (
      <>
        {skillsToShow?.length > 0 ? (
          skillsToShow?.map((skill: any) => (
            <View key={skill}>
              {getWorkLabel(availableSkills, skill) && (
                <View style={[styles.skillBox, tagStyle]}>
                  <CustomText style={[tagTextStyle]}>
                    {getWorkLabel(availableSkills, skill)}
                  </CustomText>
                </View>
              )}
            </View>
          ))
        ) : (
          <CustomText fontSize={14}>{t("noSkillsFound")}</CustomText>
        )}

        {count && count < userSkills?.length && (
          <CustomText color={Colors?.link} fontSize={18}>
            ...
          </CustomText>
        )}
      </>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        {isShowLabel && (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <View style={styles.highlightIcon}>
              <FontAwesome name="users" size={14} color={Colors.primary} />
            </View>
            <CustomHeading>{t("skills")}</CustomHeading>
          </View>
        )}
        {canAddSkills && (
          <TouchableOpacity onPress={toggleModal}>
            <CustomHeading color={Colors?.link} fontWeight="bold">
              {t("addNewSkills")}
            </CustomHeading>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.skillContainer}>{renderSkills()}</View>

      <ModalComponent
        title={t("addNewSkills")}
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        content={() => (
          <MultiSelectDropdownComponent
            value={selectedSkills}
            setValue={(state: any) => setSelectedSkills(state)}
            placeholder={t("searchAndSelectSkills")}
            options={availableSkills?.filter(
              (type: any) => !userSkills?.includes(type?.value)
            )}
            icon={
              <MaterialCommunityIcons
                style={styles.icon}
                color="black"
                name="hammer-sickle"
                size={30}
              />
            }
          />
        )}
        primaryButton={{
          title: t("addSkill"),
          action: onAddSkills,
          disabled: selectedSkills?.length === 0,
        }}
        secondaryButton={{
          action: () => setIsModalVisible(false),
        }}
      />
    </View>
  );
};

export default SkillSelector;

const styles = StyleSheet.create({
  container: {},
  skillContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-end",
  },
  skillBox: {
    backgroundColor: Colors?.white,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 8,
    marginVertical: 6,
  },
  highlightIcon: {
    width: 25,
    height: 25,
    display: "flex",
    justifyContent: "center",
    backgroundColor: "#F4F4F4",
    borderRadius: 8,
    alignItems: "center",
  },
  icon: {
    marginRight: 10,
    color: Colors.secondary,
  },
});

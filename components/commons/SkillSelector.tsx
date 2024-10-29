import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import ModalComponent from "./Modal";
import MultiSelectDropdownComponent from "../inputs/MultiSelectDropdown";
import { UserAtom } from "@/app/AtomStore/user";
import { useAtomValue } from "jotai";
import { getWorkLabel } from "@/constants/functions";

interface SkillSelectorProps {
  canAddSkills: boolean;
  isShowLabel?: boolean;
  style?: any;
  tagStyle?: any;
  tagTextStyle?: any,
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
  count, // Optional count parameter
}: SkillSelectorProps) => {
  const userDetails = useAtomValue(UserAtom);
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

  // Function to render the skill tags
  const renderSkills = () => {
    // Show all skills if count is not provided, otherwise limit to `count`
    const skillsToShow = count ? userSkills?.slice(0, count) : userSkills;

    return (
      <>
        {skillsToShow?.map((skill) => (
          <View key={skill}>
            {getWorkLabel(availableSkills, skill) && (
              <View style={[styles.skillBox, tagStyle]}>
                <Text style={[styles.skillText, tagTextStyle]}>
                  {getWorkLabel(availableSkills, skill)}
                </Text>
              </View>
            )}
          </View>
        ))}

        {/* Conditionally render three dots (...) if count is less than the total number of skills */}
        {count && count < userSkills?.length && (
          <Text style={styles.viewMoreText}>...</Text>
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
            <Text style={styles.title}>Skills</Text>
          </View>
        )}
        {canAddSkills && (
          <TouchableOpacity onPress={toggleModal}>
            <Text style={styles.addSkillText}>Add New Skills</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.skillContainer}>{renderSkills()}</View>

      <ModalComponent
        title="Add New Skills"
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        content={() => (
          <View style={{ paddingVertical: 20 }}>
            <MultiSelectDropdownComponent
              value={selectedSkills}
              setValue={(state: any) => setSelectedSkills(state)}
              placeholder="Search and select skills..."
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
          </View>
        )}
        primaryButton={{
          title: "Add Skill",
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
  container: {
    // paddingVertical: 10,
    // flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "500",
    color: "#000",
    // marginLeft: 6,
  },
  addSkillText: {
    color: "#007bff",
    fontWeight: "bold",
  },
  skillContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-end",
  },
  skillBox: {
    backgroundColor: Colors?.white,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginRight: 8,
    marginVertical: 6,
  },
  skillText: {
    color: Colors?.primary,
    fontSize: 14
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
  viewMoreText: {
    color: "#007bff",
    fontWeight: "bold",
    marginBottom: 2,
    fontSize: 20,
  },
});
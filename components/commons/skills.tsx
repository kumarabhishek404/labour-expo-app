import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Button,
  StyleSheet,
  FlatList,
} from "react-native";
import { MultiSelect } from "react-native-element-dropdown"; // You can use a multi-select library like this one
import axios from "axios"; // For API calls
import {
  FontAwesome,
  FontAwesome6,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import ModalComponent from "./Modal";
import DropdownComponent from "../inputs/Dropdown";
import MultiSelectDropdownComponent from "../inputs/MultiSelectDropdown";
import { UserAtom } from "@/app/AtomStore/user";
import { useAtomValue } from "jotai";
import { getWorkLabel } from "@/constants/functions";

interface SkillSelectorProps {
  canAddSkills: boolean;
  style?: any;
  selectedSkills?: Array<string>;
  setSelectedSkills?: any;
  userSkills: Array<string>;
  availableSkills: any;
  handleAddSkill?: any;
}

const SkillSelector = ({
  canAddSkills,
  style,
  selectedSkills,
  setSelectedSkills,
  userSkills,
  availableSkills,
  handleAddSkill,
}: SkillSelectorProps) => {
  const userDetails = useAtomValue(UserAtom);
  const [isModalVisible, setIsModalVisible] = useState(false);
  console.log("selectedSkills", selectedSkills);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const onAddSkills = async () => {
    try {
      await handleAddSkill();
      setIsModalVisible(false);
    } catch (err) {
      console.log("errr");
    }
  };

  const modalContent = () => {
    return (
      <View style={{ paddingVertical: 20 }}>
        <MultiSelectDropdownComponent
          value={selectedSkills}
          setValue={(state: any) => setSelectedSkills(state)}
          placeholder="Seach and select skills..."
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
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <View style={styles.highlightIcon}>
            <FontAwesome name="users" size={14} color={Colors.primary} />
          </View>
          <Text style={styles.title}>Skills</Text>
        </View>
        {canAddSkills && (
          <TouchableOpacity onPress={toggleModal}>
            <Text style={styles.addSkillText}>Add New Skills</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.skillContainer}>
        {userSkills &&
          userSkills?.length > 0 &&
          userSkills?.map((skill: any) => (
            <View key={skill}>
              {getWorkLabel(availableSkills, skill) && (
                <View style={styles.skillBox}>
                  <Text style={styles.skillText}>
                    {getWorkLabel(availableSkills, skill)}
                  </Text>
                </View>
              )}
            </View>
          ))}
      </View>

      <ModalComponent
        title="Add New Skills"
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        content={modalContent}
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
    paddingVertical: 10,
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "500",
    color: "#000",
    marginLeft: 6,
  },
  addSkillText: {
    color: "#007bff",
    fontWeight: "bold",
  },
  skillContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingTop: 5,
  },
  skillBox: {
    backgroundColor: "#333",
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginRight: 8,
    marginVertical: 6,
  },
  skillText: {
    color: "#fff",
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

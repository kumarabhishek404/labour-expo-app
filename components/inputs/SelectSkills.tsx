import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // You need to install this or use a cross icon from other libraries
import { getWorkLabel } from "@/constants/functions";
import CustomHeading from "../commons/CustomHeading";
import Colors from "@/constants/Colors";
import CustomText from "../commons/CustomText";

interface SkillsSelectorProps {
  name: string;
  selectedInterests: Array<any>;
  setSelectedInterests: any;
  availableOptions: Array<any>;
  onBlur: any;
  errors: any;
  icon?: any;
}

const SkillsSelector = ({
  name,
  selectedInterests,
  setSelectedInterests,
  availableOptions,
  onBlur,
  errors,
}: SkillsSelectorProps) => {
  const handleSelect = (interest: any) => {
    if (selectedInterests.length < 10) {
      setSelectedInterests([...selectedInterests, interest?.value]);
    }
  };

  const handleRemove = (interest: any) => {
    const updatedInterests = selectedInterests.filter(
      (item: any) => item !== interest
    );
    setSelectedInterests(updatedInterests);
  };

  return (
    <View style={styles.container}>
      <CustomHeading textAlign="left">Select Any 3 Skills</CustomHeading>
      <View
        style={[styles.selectedContainer, errors[name] && styles?.errorInput]}
      >
        {selectedInterests && selectedInterests?.length > 0 ? (
          selectedInterests.map((interest: any, index: number) => (
            <View key={index} style={styles.selectedItem}>
              <CustomHeading color={Colors?.white}>
                {getWorkLabel(availableOptions, interest)}
              </CustomHeading>
              <TouchableOpacity onPress={() => handleRemove(interest)}>
                <Ionicons name="close-circle" size={20} color="white" />
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <CustomText fontSize={14}>What you can do?</CustomText>
        )}
      </View>

      {errors[name] && (
        <CustomText textAlign="left" fontSize={10} color={Colors?.danger}>
          {errors[name]?.message || ""}
        </CustomText>
      )}

      {/* Display available interests */}
      <View style={styles.interestsContainer}>
        {availableOptions
          .filter((interest) => !selectedInterests.includes(interest?.value)) // Filter out selected interests
          .map((interest, index) => (
            <TouchableOpacity
              key={index}
              style={styles.interestItem}
              onPress={() => handleSelect(interest)}
            >
              <CustomHeading>+ {interest?.label}</CustomHeading>
            </TouchableOpacity>
          ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 5,
  },
  selectedContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#DDD",
    width: "100%",
    minHeight: 110,
    padding: 6,
  },
  placeholderText: {
    color: "#333",
    opacity: 0.7,
    fontSize: 16,
    marginRight: 5,
  },
  selectedItem: {
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    margin: 5,
    gap: 5,
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginTop: 10
  },
  interestItem: {
    backgroundColor: "#EEE",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    margin: 5,
  },
  errorInput: {
    borderWidth: 1,
    borderColor: "red",
    color: "red",
  },
});

export default SkillsSelector;

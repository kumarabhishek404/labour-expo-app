import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // You need to install this or use a cross icon from other libraries

interface SkillsSelectorProps {
  name: string;
  selectedInterests: Array<any>;
  setSelectedInterests: any;
  availableOptions: Array<any>;
  onBlur: any;
  errors: any;
  placeholder: string;
  icon?: any;
}

const SkillsSelector = ({
  name,
  selectedInterests,
  setSelectedInterests,
  availableOptions,
  onBlur,
  errors,
  placeholder,
}: SkillsSelectorProps) => {
  const handleSelect = (interest: any) => {
    if (selectedInterests.length < 10) {
      setSelectedInterests([...selectedInterests, interest]);
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
      <Text style={styles.heading}>Select Any 3 Skills</Text>
      <View
        style={[styles.selectedContainer, errors[name] && styles?.errorInput]}
      >
        {selectedInterests && selectedInterests?.length > 0 ? (
          selectedInterests.map((interest: any, index: number) => (
            <View key={index} style={styles.selectedItem}>
              <Text style={styles.selectedText}>{interest}</Text>
              <TouchableOpacity onPress={() => handleRemove(interest)}>
                <Ionicons name="close-circle" size={20} color="white" />
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.placeholderText}>What you can do?</Text>
        )}
      </View>

      {errors[name] && (
        <Text style={styles.errorText}>{errors[name]?.message || ""}</Text>
      )}

      {/* Display available interests */}
      <View style={styles.interestsContainer}>
        {availableOptions
          .filter((interest) => !selectedInterests.includes(interest)) // Filter out selected interests
          .map((interest, index) => (
            <TouchableOpacity
              key={index}
              style={styles.interestItem}
              onPress={() => handleSelect(interest)}
            >
              <Text style={styles.interestText}>+ {interest}</Text>
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
    // paddingTop: 10,
    // backgroundColor: "#F9F9F9",
  },
  heading: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  subheading: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
    textAlign: "center",
  },
  selectedContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 10,
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
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    margin: 5,
  },
  selectedText: {
    color: "white",
    fontSize: 16,
    marginRight: 5,
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  interestItem: {
    backgroundColor: "#EEE",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    margin: 5,
  },
  interestText: {
    color: "#333",
    fontSize: 16,
  },
  errorInput: {
    borderWidth: 1,
    borderColor: "red",
    color: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
});

export default SkillsSelector;

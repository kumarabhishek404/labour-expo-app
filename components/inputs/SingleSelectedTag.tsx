import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import CustomHeading from "../commons/CustomHeading";
import CustomText from "../commons/CustomText";

interface SelectableTagsProps {
  label?: string;
  name: string;
  selectedTag: string;
  setSelectedTag: any;
}

const SelectableTags = ({
  label,
  name,
  selectedTag,
  setSelectedTag,
}: SelectableTagsProps) => {
  // Tag options
  const tags = [
    "Within 10 km",
    "Within 50 km",
    "Within 100 km",
    "More Than 100 km",
  ];

  // Handle tag selection
  const handleTagPress = (tag: any) => {
    setSelectedTag(tag); // Set selected tag
  };

  return (
    <View style={styles.container}>
      <CustomHeading textAlign="left">{label}</CustomHeading>
      <View style={styles?.tagContainer}>
        {tags.map((tag, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.tag,
              selectedTag === tag && styles.selectedTag, // Apply selected style if the tag is selected
            ]}
            onPress={() => handleTagPress(tag)} // Select tag on press
          >
            <CustomText
              style={[
                styles.tagText,
                selectedTag === tag && styles.selectedTagText,
              ]}
            >
              {tag}
            </CustomText>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginVertical: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 10,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    // justifyContent: "flex-start",
    // alignItems: "flex-start",
  },
  tag: {
    backgroundColor: "#ddd", // Default unselected background color
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    margin: 5,
  },
  selectedTag: {
    backgroundColor: "#4A90E2", // Selected background color
  },
  tagText: {
    color: "#333", // Default unselected text color
    fontSize: 16,
  },
  selectedTagText: {
    color: "#fff", // Selected text color
  },
});

export default SelectableTags;

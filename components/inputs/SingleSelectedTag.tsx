import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import CustomHeading from "../commons/CustomHeading";
import CustomText from "../commons/CustomText";
import { t } from "@/utils/translationHelper";
import Colors from "@/constants/Colors";

interface SelectableTagsProps {
  label?: string;
  options: any;
  selectedTag: string;
  setSelectedTag: any;
}

const SelectableTags = ({
  label,
  options,
  selectedTag,
  setSelectedTag,
}: SelectableTagsProps) => {
  
  const handleTagPress = (tag: any) => {
    setSelectedTag(tag);
  };

  return (
    <View style={styles.container}>
      <CustomHeading textAlign="left" style={styles?.label}>
        {label}
      </CustomHeading>
      <View style={styles?.tagContainer}>
        {options.map((option: any, index: number) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.tag,
              selectedTag === option?.value && styles.selectedTag, // Apply selected style if the tag is selected
            ]}
            onPress={() => handleTagPress(option?.value)} // Select tag on press
          >
            <CustomText
              style={[
                styles.tagText,
                selectedTag === option?.value && styles.selectedTagText,
              ]}
            >
              {t(option?.label)}
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
    marginBottom: 10,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  tag: {
    backgroundColor: Colors?.white,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  selectedTag: {
    backgroundColor: "#4A90E2",
  },
  tagText: {
    color: "#333",
    fontSize: 16,
  },
  selectedTagText: {
    color: "#fff", // Selected text color
  },
});

export default SelectableTags;

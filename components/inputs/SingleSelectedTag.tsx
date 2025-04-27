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
  tagStyle?: any;
}

const SelectableTags = ({
  label,
  options,
  selectedTag,
  setSelectedTag,
  tagStyle,
}: SelectableTagsProps) => {
  const handleTagPress = (tag: any) => {
    setSelectedTag(tag);
  };

  return (
    <View style={styles.container}>
      {label && (
        <CustomHeading textAlign="left" style={styles?.label}>
          {label}
        </CustomHeading>
      )}
      <View style={styles?.tagContainer}>
        {options.map((option: any, index: number) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.tag,
              tagStyle, // Apply selected style if the tag is selected
              selectedTag === option?.value && styles.selectedTag,
            ]}
            onPress={() => handleTagPress(option?.value)} // Select tag on press
          >
            <CustomText
              fontWeight="500"
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
    justifyContent: "center",
    alignItems: "center",
  },
  selectedTag: {
    backgroundColor: Colors?.highlight,
  },
  tagText: {
    color: Colors?.black,
  },
  selectedTagText: {
    color: Colors?.white, // Selected text color
  },
});

export default SelectableTags;

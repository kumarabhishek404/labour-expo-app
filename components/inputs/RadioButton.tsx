import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Controller } from "react-hook-form";
import Colors from "@/constants/Colors";
import { t } from "@/utils/translationHelper";
import CustomHeading from "../commons/CustomHeading";
import CustomText from "../commons/CustomText";

interface SkillOption {
  skill: string;
  pricePerDay: number;
}

interface RadioSkillSelectorProps {
  name: string;
  label: string;
  value: any;
  errors: any;
  onChange: any;
  options: SkillOption[];
}

const RadioSkillSelector: React.FC<RadioSkillSelectorProps> = ({
  name,
  label,
  value,
  errors,
  onChange,
  options,
}) => {
  return (
    <View style={styles.container}>
      {label && (
        <CustomHeading
          textAlign="left"
          color={Colors?.inputLabel}
          baseFont={18}
          fontWeight="600"
        >
          {t(label)}
        </CustomHeading>
      )}
      {options?.map((option, index) => {
        const isSelected = value?.skill === option.skill;
        return (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionContainer,
              isSelected && styles.selectedOption,
            ]}
            onPress={() => onChange(option)}
          >
            <View
              style={[styles.radioCircle, isSelected && styles.radioSelected]}
            />
            <CustomText
              textAlign="left"
              style={{ flex: 1 }}
              baseFont={18}
            >{`${t(option.skill)} - ${
              option.pricePerDay
                ? `₹${option.pricePerDay} / ${t("perDay")}`
                : t("notAdded")
            }`}</CustomText>
          </TouchableOpacity>
        );
      })}
      {errors?.[name] && (
        <Text style={styles.errorText}>{errors[name]?.message}</Text>
      )}
    </View>
  );
};

export default RadioSkillSelector;

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.text,
  },
  optionContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 10,
  },
  selectedOption: {
    backgroundColor: Colors.fourth,
    borderRadius: 8,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    marginTop: 4,
  },
  radioSelected: {
    backgroundColor: Colors.primary,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 14,
  },
});

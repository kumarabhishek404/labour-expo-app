import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Colors from "@/constants/Colors";
import { t } from "@/utils/translationHelper";
import CustomHeading from "../commons/CustomHeading";
import CustomText from "../commons/CustomText";

interface RadioSelectorProps<T> {
  name: string;
  label: string;
  value: T | null;
  errors: any;
  onChange: (val: T) => void;
  options: T[];
  keyExtractor: (option: T) => string;
  renderOption: (option: T) => string;
  translationEnabled?: boolean;
}

function RadioSelector<T>({
  name,
  label,
  value,
  errors,
  onChange,
  options,
  keyExtractor,
  renderOption,
  translationEnabled,
}: RadioSelectorProps<T>) {
  return (
    <View style={styles.container}>
      {label && (
        <CustomHeading
          textAlign="left"
          color={Colors.inputLabel}
          baseFont={18}
          fontWeight="600"
        >
          {translationEnabled ? t(label) : label}
        </CustomHeading>
      )}
      {options?.map((option, index) => {
        const selectedKey = value ? keyExtractor(value) : "";
        const optionKey = keyExtractor(option);
        const isSelected = selectedKey === optionKey;

        return (
          <TouchableOpacity
            key={optionKey}
            style={[
              styles.optionContainer,
              isSelected && styles.selectedOption,
            ]}
            onPress={() => onChange(option)}
          >
            <View
              style={[styles.radioCircle, isSelected && styles.radioSelected]}
            />
            <CustomText textAlign="left" style={{ flex: 1 }} baseFont={18}>
              {translationEnabled
                ? t(renderOption(option))
                : renderOption(option)}
            </CustomText>
          </TouchableOpacity>
        );
      })}
      {errors?.[name] && (
        <Text style={styles.errorText}>{errors[name]?.message}</Text>
      )}
    </View>
  );
}

export default RadioSelector;

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
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

import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

interface CustomCheckboxProps {
  isChecked: boolean;
  onToggle: any;
  label?: string;
  checkboxStyle?: any;
  labelStyle?: any;
  containerStyle?: any;
}

const CustomCheckbox = ({
  isChecked,
  onToggle,
  label = "",
  checkboxStyle = {},
  labelStyle = {},
  containerStyle = {},
}: CustomCheckboxProps) => {
  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      <View
        style={[styles.checkbox, isChecked && styles.checked, checkboxStyle]}
      >
        {isChecked && <View style={styles.innerCheck} />}
      </View>
      {label ? <Text style={[styles.label, labelStyle]}>{label}</Text> : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#007BFF",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  checked: {
    backgroundColor: "#007BFF",
  },
  innerCheck: {
    width: 10,
    height: 10,
    backgroundColor: "white",
    borderRadius: 2,
  },
  label: {
    marginLeft: 8,
    fontSize: 14,
    color: "#333",
  },
});

export default CustomCheckbox;

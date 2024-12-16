import { Entypo } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

interface CustomCheckboxProps {
  isChecked: boolean;
  onToggle: any;
  label?: string;
  disabled?: boolean;
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
  disabled = false,
}: CustomCheckboxProps) => {
  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={onToggle}
      activeOpacity={0.7}
      disabled={disabled}
    >
      <View
        style={[styles.checkbox, checkboxStyle, disabled && styles.disabled]}
      >
        {isChecked && (
          <Text style={styles.checkmark}>
            <Entypo name="check" size={20} color="#007BFF" />
          </Text>
        )}
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
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: "#007BFF",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  checkmark: {
    color: "#007BFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  disabled: {
    borderColor: "#ccc",
    backgroundColor: "#f5f5f5",
  },
  label: {
    marginLeft: 8,
    fontSize: 14,
    color: "#333",
  },
});

export default CustomCheckbox;

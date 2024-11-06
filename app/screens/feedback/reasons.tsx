import CustomText from "@/components/commons/CustomText";
import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";

interface RoleSelectionProps {
  role: string;
  setRole: any;
  onBlur: any;
}
const ReasoneSelection = ({ role, setRole, onBlur }: RoleSelectionProps) => {
  const roles = [
    {
      label: "Screen capture feedback",
      value: "screen_capture",
    },
    {
      label: "In-app customer surveys",
      value: "in_app_surveys",
    },
    {
      label: "Feedback menu for websites",
      value: "feedback_menu",
    },
    {
      label: "Collaboration dashboard",
      value: "collaboration_dashboard",
    },
  ];

  const handleSelectRole = (selectedRole: any) => {
    setRole(selectedRole?.value);
  };

  return (
    <View style={styles.container}>
      <View style={styles.roleContainer}>
        {roles.map((selectedRole, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.roleBox,
              role === selectedRole.value && styles.selectedRoleBox,
            ]}
            onPress={() => handleSelectRole(selectedRole)}
          >
            <CustomText fontSize={14}>{selectedRole.label}</CustomText>
            <View
              style={[
                styles.radioCircle,
                role === selectedRole.value && styles.selectedRadio,
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  roleContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    width: "100%",
  },
  roleBox: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectedRoleBox: {},
  roleTitle: {},
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 100,
    borderWidth: 2,
    marginTop: 10,
  },
  selectedRadio: {
    borderColor: "#007BFF",
    backgroundColor: "#007BFF",
  },
});

export default ReasoneSelection;

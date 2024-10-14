import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface RoleSelectionProps {
  role: string;
  setRole: any;
  labourType: string;
  setLabourType: any;
}
const RoleSelection = ({
  role,
  setRole,
  labourType,
  setLabourType,
}: RoleSelectionProps) => {
  const roles = [
    {
      id: "WORKER",
      labourType: "ONE",
      title: "Worker",
      description: "Find work of your skills and EARN.",
      price: "$0.00",
    },
    {
      id: "WORKER",
      labourType: "ORG",
      title: "Mediator",
      description: "Make group of workers and EARN.",
      price: "$10.00",
    },
    {
      id: "EMPLOYER",
      labourType: "ONE",
      title: "Employer",
      description: "Hire workers to COMPLETE your Tasks.",
      price: "$20.00",
    },
  ];

  const handleSelectRole = (selectedRole: any) => {
    setRole(selectedRole?.id);
    setLabourType(selectedRole?.labourType);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Select Your Role</Text>
      <View style={styles.roleContainer}>
        {roles.map((selectedRole, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.roleBox,
              role === selectedRole.id &&
                labourType === selectedRole.labourType &&
                styles.selectedRoleBox,
            ]}
            onPress={() => handleSelectRole(selectedRole)}
          >
            <View style={styles.roleContent}>
              <Text style={styles.roleTitle}>{selectedRole.title}</Text>
              <Text style={styles.roleDescription}>
                {selectedRole.description}
              </Text>
            </View>
            <View
              style={[
                styles.radioCircle,
                role === selectedRole.id &&
                  labourType === selectedRole.labourType &&
                  styles.selectedRadio,
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
    // backgroundColor: "#F9F9F9",
    // padding: 20,
  },
  heading: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  roleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  roleBox: {
    width: "30%",
    padding: 10,
    backgroundColor: "#FFF",
    borderRadius: 4,
    borderColor: "#DDD",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "space-between",
    // marginHorizontal: 5,
  },
  selectedRoleBox: {
    borderColor: "#007BFF",
    backgroundColor: "#EAF4FF",
  },
  roleContent: {
    alignItems: "center",
  },
  roleTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 6,
  },
  roleDescription: {
    fontSize: 14,
    color: "#666",
    // marginBottom: 10,
    textAlign: "center",
  },
  rolePrice: {
    fontSize: 14,
    color: "#007BFF",
    fontWeight: "bold",
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#DDD",
    marginTop: 10,
  },
  selectedRadio: {
    borderColor: "#007BFF",
    backgroundColor: "#007BFF",
  },
});

export default RoleSelection;

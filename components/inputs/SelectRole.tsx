import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import CustomHeading from "../commons/CustomHeading";
import CustomText from "../commons/CustomText";
import { t } from "@/utils/translationHelper";

interface RoleSelectionProps {
  role: string;
  setRole: any;
}
const RoleSelection = ({ role, setRole }: RoleSelectionProps) => {
  const roles = [
    {
      id: "WORKER",
      title: t("worker"),
      description: t("workerDescription"),
      price: "$0.00",
    },
    {
      id: "MEDIATOR",
      title: t("mediator"),
      description: t("mediatorDescription"),
      price: "$10.00",
    },
    {
      id: "EMPLOYER",
      title: t("employer"),
      description: t("employerDescription"),
      price: "$20.00",
    },
  ];

  const handleSelectRole = (selectedRole: any) => {
    setRole(selectedRole?.id);
  };

  return (
    <View style={styles.container}>
      <CustomHeading textAlign="left">Select Your Role</CustomHeading>
      <View style={styles.roleContainer}>
        {roles.map((selectedRole, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.roleBox,
              role === selectedRole.id && styles.selectedRoleBox,
            ]}
            onPress={() => handleSelectRole(selectedRole)}
          >
            <View style={styles.roleContent}>
              <CustomHeading>{selectedRole.title}</CustomHeading>
              <CustomText fontWeight="600">
                {selectedRole.description}
              </CustomText>
            </View>
            <View
              style={[
                styles.radioCircle,
                role === selectedRole.id && styles.selectedRadio,
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
    gap: 5,
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
    borderRadius: 8,
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
    gap: 5,
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
    borderRadius: 100,
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

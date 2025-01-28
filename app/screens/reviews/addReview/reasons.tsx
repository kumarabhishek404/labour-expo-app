import CustomText from "@/components/commons/CustomText";
import { REASONS } from "@/constants";
import { t } from "@/utils/translationHelper";
import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";

interface RoleSelectionProps {
  reason: string;
  setReason: any;
  onBlur: any;
}
const ReasoneSelection = ({ reason, setReason, onBlur }: RoleSelectionProps) => {

  const handleSelectReason = (selectedReason: any) => {
    setReason(selectedReason?.value);
  };

  return (
    <View style={styles.container}>
      <View style={styles.roleContainer}>
        {REASONS.map((selectedReason, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.roleBox,
              reason === selectedReason.value && styles.selectedRoleBox,
            ]}
            onPress={() => handleSelectReason(selectedReason)}
          >
            <CustomText baseFont={14}>{t(selectedReason?.label)}</CustomText>
            <View
              style={[
                styles.radioCircle,
                reason === selectedReason.value && styles.selectedRadio,
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

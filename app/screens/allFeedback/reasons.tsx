import CustomText from "@/components/commons/CustomText";
import { APP_FEEDBACK_REASONS } from "@/constants";
import { t } from "@/utils/translationHelper";
import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";

interface RoleSelectionProps {
  selectedReason: string;
  setSelectedReason: any;
  onBlur: any;
}
const ReasoneSelection = ({
  selectedReason,
  setSelectedReason,
  onBlur,
}: RoleSelectionProps) => {
  const handleSelectReason = (reason: any) => {
    setSelectedReason(reason?.value);
  };

  return (
    <View style={styles.container}>
      <View style={styles.roleContainer}>
        {APP_FEEDBACK_REASONS.map((reason, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.roleBox,
              selectedReason === reason.value && styles.selectedRoleBox,
            ]}
            onPress={() => handleSelectReason(reason)}
          >
            <CustomText baseFont={14}>{t(reason.label)}</CustomText>
            <View
              style={[
                styles.radioCircle,
                selectedReason === reason.value && styles.selectedRadio,
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

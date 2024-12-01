import Colors from "@/constants/Colors";
import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import CustomHeading from "./CustomHeading";
import CustomText from "./CustomText";
import Button from "../inputs/Button";
import { t } from "@/utils/translationHelper";

const CompanySuccess = () => {
  return (
    <View style={styles.container}>
      <CustomHeading>{t("companySuccess")}</CustomHeading>
      <View style={styles.divider}></View>

      <View style={styles.factsRow}>
        <View style={styles.factContainer}>
          <CustomHeading fontSize={32}>30+</CustomHeading>
          <CustomText>Years of Excellence</CustomText>
        </View>
        <View style={styles.factContainer}>
          <CustomHeading fontSize={32}>100%</CustomHeading>
          <CustomText>Client Satisfaction</CustomText>
        </View>
        <View style={styles.factContainer}>
          <CustomHeading fontSize={32}>53k</CustomHeading>
          <CustomText>Cases Completed</CustomText>
        </View>
        <View style={styles.factContainer}>
          <CustomHeading fontSize={32}>24</CustomHeading>
          <CustomText>Consultants</CustomText>
        </View>
      </View>

      {/* Button */}
      <Button
        isPrimary={true}
        title="VIEW CASE STUDIES"
        onPress={() => {}}
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA", // Light gray background
    padding: 16,
    paddingVertical: 30,
    alignItems: "center",
  },
  divider: {
    alignSelf: "center",
    width: 50,
    height: 2,
    backgroundColor: "#ccc",
    marginVertical: 8,
  },
  factsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    width: "100%",
    marginBottom: 25,
    paddingTop: 20,
  },
  factContainer: {
    alignItems: "center",
    width: "45%",
    marginBottom: 20,
  },
  button: {
    borderRadius: 5,
    marginBottom: 10,
  },
});

export default CompanySuccess;

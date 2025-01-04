import Colors from "@/constants/Colors";
import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import CustomHeading from "./CustomHeading";
import CustomText from "./CustomText";
import Button from "../inputs/Button";
import { t } from "@/utils/translationHelper";
import { useQuery } from "@tanstack/react-query";
import { fetchCompanyStats } from "@/app/api/home";

const CompanySuccess = () => {
  const { data: companyStats } = useQuery({
    queryKey: ["companySuccessStats"],
    queryFn: () => fetchCompanyStats(),
    refetchOnMount: true,
    retry: false,
  });
  
  return (
    <View style={styles.container}>
      <CustomHeading>{t("companySuccess")}</CustomHeading>
      <View style={styles.divider}></View>

      <View style={styles.factsRow}>
        <View style={styles.factContainer}>
          <CustomHeading fontSize={32}>
            {companyStats?.workers ?? 0}
          </CustomHeading>
          <CustomText>{t("workers")}</CustomText>
        </View>
        <View style={styles.factContainer}>
          <CustomHeading fontSize={32}>
            {companyStats?.employers ?? 0}
          </CustomHeading>
          <CustomText>{t("employers")}</CustomText>
        </View>
        <View style={styles.factContainer}>
          <CustomHeading fontSize={32}>
            {companyStats?.mediators ?? 0}
          </CustomHeading>
          <CustomText>{t("mediators")}</CustomText>
        </View>
        <View style={styles.factContainer}>
          <CustomHeading fontSize={32}>
            {companyStats?.services ?? 0}
          </CustomHeading>
          <CustomText>{t("services")}</CustomText>
        </View>
      </View>

      {/* Button */}
      <Button
        isPrimary={true}
        disabled={true}
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
    opacity: 0.4,
  },
});

export default CompanySuccess;

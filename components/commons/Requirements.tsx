import Colors from "@/constants/Colors";
import React from "react";
import { View, StyleSheet } from "react-native";
import CustomHeading from "./CustomHeading";
import CustomText from "./CustomText";
import { t } from "@/utils/translationHelper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CustomeAnimatedHeading from "./CustomeAnimatedHeading";
import { getDynamicWorkerType } from "@/utils/i18n";

interface RequirementsProps {
  type: string;
  requirements: any;
}

const Requirements = ({ type, requirements }: RequirementsProps) => {
  return (
    <>
      {type === "highlights" ? (
        <View style={styles.container}>
          {requirements?.map((requirement: any, index: number) => (
            <View key={index} style={styles.tag}>
              <CustomHeading
                baseFont={14}
                color={Colors?.white}
                style={{ textTransform: "capitalize" }}
              >
                {requirement?.count}{" "}
                {`${getDynamicWorkerType(
                  requirement?.name,
                  requirement?.count
                )}`}
              </CustomHeading>
              <CustomText color={Colors?.white} baseFont={12}>
                ₹ {requirement?.payPerDay} {t("perDay")}
              </CustomText>
            </View>
          ))}
        </View>
      ) : type === "small" ? (
        <View style={styles.smallContainer}>
          {requirements?.map((requirement: any, index: number) => (
            <View key={index} style={styles.smallTag}>
              <CustomText style={styles.smallRequirementText}>
                {requirement.count}{" "}
                {getDynamicWorkerType(requirement?.name, requirement?.count)} •
                ₹{requirement.payPerDay}/{t("days")}
              </CustomText>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.requirmentContainer}>
          <CustomeAnimatedHeading />
          {requirements?.map((requirement: any, index: number) => {
            return (
              <View style={styles.card} key={index}>
                <View style={styles.header}>
                  <CustomHeading style={{ textTransform: "capitalize" }}>
                    {getDynamicWorkerType(
                      requirement?.name,
                      requirement?.count
                    )}
                  </CustomHeading>
                  <CustomText
                    baseFont={17}
                    color={Colors?.primary}
                    fontWeight="bold"
                  >
                    ₹ {requirement?.payPerDay} {t("perDay")}
                  </CustomText>
                </View>

                <View style={styles.details}>
                  <View style={styles?.detailBox}>
                    <CustomText fontWeight="700" color={Colors?.tertieryButton}>
                      {t("count")}
                    </CustomText>
                    <CustomText fontWeight="800" textAlign="left">
                      {requirement?.count}
                    </CustomText>
                  </View>
                  <View style={styles?.detailBox}>
                    <CustomText fontWeight="700" color={Colors?.tertieryButton}>
                      {t("living")}
                    </CustomText>
                    <CustomText fontWeight="800" textAlign="left">
                      {requirement?.shelterProvider ? t("yes") : t("no")}
                    </CustomText>
                  </View>
                  <View style={styles?.detailBox}>
                    <CustomText fontWeight="700" color={Colors?.tertieryButton}>
                      {t("esi_pf")}
                    </CustomText>
                    <CustomText fontWeight="800" textAlign="left">
                      {requirement?.esi_pf ? t("yes") : t("no")}
                    </CustomText>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
    paddingVertical: 6,
  },
  requirmentContainer: {
    borderRadius: 8,
    paddingTop: 20,
  },
  card: {
    backgroundColor: Colors?.white,
    padding: 15,
    marginBottom: 6,
    borderRadius: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  details: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
    marginTop: 8,
  },
  detailBox: {
    flexDirection: "column",
  },
  tag: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: Colors?.tertiery,
    borderColor: Colors?.tertiery,
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderWidth: 1,
  },
  smallContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginVertical: 8,
  },
  smallTag: {
    backgroundColor: Colors.tertiery,
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  smallRequirementText: {
    color: Colors.white,
    fontSize: 12,
  },
  requirementsHeading: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 5,
  },
});

export default Requirements;

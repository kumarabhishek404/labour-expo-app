import Colors from "@/constants/Colors";
import React from "react";
import { View, StyleSheet } from "react-native";
import CustomHeading from "./CustomHeading";
import CustomText from "./CustomText";
import { t } from "@/utils/translationHelper";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
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
          <CustomText
            textAlign="left"
            baseFont={13}
            color={Colors.secondary}
            style={styles.requirementsHint}
          >
            {t("requirementsSectionHint")}
          </CustomText>
          {requirements?.map((requirement: any, index: number) => {
            return (
              <View style={styles.card} key={index}>
                <View style={styles.header}>
                  <View style={styles.headerTitle}>
                    <MaterialCommunityIcons
                      name="account-hard-hat"
                      size={22}
                      color={Colors.primary}
                    />
                    <CustomHeading
                      style={{ textTransform: "capitalize", flex: 1 }}
                      textAlign="left"
                    >
                      {getDynamicWorkerType(
                        requirement?.name,
                        requirement?.count
                      )}
                    </CustomHeading>
                  </View>
                  <View style={styles.payPill}>
                    <CustomText baseFont={12} fontWeight="700" color={Colors.primary}>
                      ₹{requirement?.payPerDay}
                    </CustomText>
                    <CustomText baseFont={11} color={Colors.subHeading}>
                      {t("perDay")}
                    </CustomText>
                  </View>
                </View>

                <View style={styles.countRow}>
                  <Ionicons
                    name="people"
                    size={18}
                    color={Colors.tertieryButton}
                  />
                  <CustomText fontWeight="800" textAlign="left" baseFont={15}>
                    {t("count")}: {requirement?.count}
                  </CustomText>
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
    paddingTop: 12,
  },
  requirementsHint: {
    marginBottom: 14,
    lineHeight: 18,
  },
  card: {
    backgroundColor: Colors?.white,
    padding: 14,
    marginBottom: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(34, 64, 154, 0.1)",
    shadowColor: "#1e3a8a",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  },
  headerTitle: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    minWidth: 0,
  },
  payPill: {
    backgroundColor: Colors.fourth,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    alignItems: "flex-end",
    borderWidth: 1,
    borderColor: "rgba(34, 64, 154, 0.12)",
  },
  countRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(34, 64, 154, 0.12)",
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

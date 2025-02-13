import Colors from "@/constants/Colors";
import React from "react";
import { View, StyleSheet } from "react-native";
import CustomHeading from "./CustomHeading";
import CustomText from "./CustomText";
import { t } from "@/utils/translationHelper";

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
                {requirement?.count} {t(`${requirement?.name}`)}
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
                {requirement.count} {t(requirement.name)} • ₹
                {requirement.payPerDay}
                /day
              </CustomText>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.requirmentContainer}>
          {requirements?.map((requirement: any, index: number) => {
            return (
              <View style={styles.card} key={index}>
                <View style={styles.header}>
                  <CustomHeading style={{ textTransform: "capitalize" }}>
                    {t(`${requirement?.name}`)}
                  </CustomHeading>
                  <CustomText baseFont={14}>
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
                      {t("food")}
                    </CustomText>
                    <CustomText fontWeight="800" textAlign="left">
                      {requirement?.food ? "Yes" : "No"}
                    </CustomText>
                  </View>
                  <View style={styles?.detailBox}>
                    <CustomText fontWeight="700" color={Colors?.tertieryButton}>
                      {t("living")}
                    </CustomText>
                    <CustomText fontWeight="800" textAlign="left">
                      {requirement?.shelterProvider ? "Yes" : "No"}
                    </CustomText>
                  </View>
                  <View style={styles?.detailBox}>
                    <CustomText fontWeight="700" color={Colors?.tertieryButton}>
                      {t("esi/pf")}
                    </CustomText>
                    <CustomText fontWeight="800" textAlign="left">
                      No
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
    marginVertical: 10,
    borderRadius: 8,
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
});

export default Requirements;

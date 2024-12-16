import Colors from "@/constants/Colors";
import React from "react";
import { View, StyleSheet } from "react-native";
import CustomHeading from "./CustomHeading";
import CustomText from "./CustomText";
import { t } from "@/utils/translationHelper";
import { capitalizeWord, toLowerCase } from "@/constants/functions";

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
                fontSize={14}
                color={Colors?.white}
                style={{ textTransform: "capitalize" }}
              >
                {requirement?.count} {t(`${toLowerCase(requirement?.name)}`)}
              </CustomHeading>
              <CustomText color={Colors?.white} fontSize={12}>
                ₹ {requirement?.payPerDay} {t("perDay")}
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
                    {t(`${toLowerCase(requirement?.name)}`)}
                  </CustomHeading>
                  <CustomText fontSize={14}>
                    ₹ {requirement?.payPerDay} {t("perDay")}
                  </CustomText>
                </View>

                <View style={styles.details}>
                  <View style={styles?.detailBox}>
                    <CustomText fontWeight="700">{t("count")}</CustomText>
                    <CustomText fontWeight="800" textAlign="left">
                      {requirement?.count}
                    </CustomText>
                  </View>
                  <View style={styles?.detailBox}>
                    <CustomText fontWeight="700">{t("food")}</CustomText>
                    <CustomText fontWeight="800" textAlign="left">
                      {requirement?.food ? "Yes" : "No"}
                    </CustomText>
                  </View>
                  <View style={styles?.detailBox}>
                    <CustomText fontWeight="700">{t("living")}</CustomText>
                    <CustomText fontWeight="800" textAlign="left">
                      {requirement?.shelterProvider ? "Yes" : "No"}
                    </CustomText>
                  </View>
                  <View style={styles?.detailBox}>
                    <CustomText fontWeight="700">{t("esi/pf")}</CustomText>
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
    backgroundColor: "#e1e8e5",
    borderRadius: 8,
  },
  card: {
    backgroundColor: "#e1e8e5",
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
});

export default Requirements;

import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import ButtonComp from "@/components/inputs/Button";
import CustomText from "@/components/commons/CustomText";
import Colors from "@/constants/Colors";
import { t } from "@/utils/translationHelper";

const ApplicantSummary = ({
  appliedCount,
  selectedCount,
  onShowDetails,
  isLoading,
}: any) => {
  
  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color={Colors.white} />
      ) : (
        <>
          <View style={styles.infoContainer}>
            <View style={styles.countBox}>
              <CustomText baseFont={26} color={Colors.white} fontWeight="bold">
                {appliedCount}
              </CustomText>
              <CustomText baseFont={18} color={Colors.white}>
                {t("applicants")}
              </CustomText>
            </View>
            <View style={styles.countBox}>
              <CustomText baseFont={26} color={Colors.white} fontWeight="bold">
                {selectedCount}
              </CustomText>
              <CustomText baseFont={18} color={Colors.white}>
                {t("selected")}
              </CustomText>
            </View>
          </View>
          {(appliedCount > 0 || selectedCount > 0) && (
            <ButtonComp
              isPrimary
              title={t("showDetails")}
              onPress={onShowDetails}
              style={styles.button}
            />
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    paddingTop: 10,
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 8,
    backgroundColor: Colors.tertieryButton,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  countBox: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    gap: 6,
    flexDirection: "column",
  },
  button: {
    width: "100%",
    marginTop: 15,
  },
});

export default ApplicantSummary;

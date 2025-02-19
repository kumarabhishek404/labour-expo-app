import React from "react";
import { View, StyleSheet } from "react-native";
import Counter from "./Counter";
import CustomText from "../commons/CustomText";
import CustomHeading from "../commons/CustomHeading";
import Colors from "@/constants/Colors";
import { t } from "@/utils/translationHelper";

const NumberOfWorkers = ({
  noOfWorkers,
  setNoOfWorkers,
  errors,
  name,
}: any) => {
  return (
    <View style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <View style={styles.container}>
        <CustomHeading
          baseFont={16}
          color={Colors?.inputLabel}
          fontWeight="500"
        >
          {t("noOfWorkers")}
        </CustomHeading>
        <Counter counter={noOfWorkers || 0} setCounter={setNoOfWorkers} />
      </View>
      {errors?.[name] && (
        <CustomText textAlign="right" baseFont={10} color={Colors?.danger}>
          {errors?.[name]?.message || ""}
        </CustomText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

export default NumberOfWorkers;

import React from "react";
import { View, StyleSheet } from "react-native";
import Counter from "./Counter";
import CustomText from "../commons/CustomText";
import CustomHeading from "../commons/CustomHeading";
import Colors from "@/constants/Colors";
import { t } from "@/utils/translationHelper";

const Duration = ({ duration, setDuration, errors, name }: any) => {
  return (
    <View style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <View style={styles.container}>
        <CustomHeading baseFont={20}>
          {t("duration")}{" "}
          <CustomText baseFont={14}> ({t("InDays")})</CustomText>
        </CustomHeading>
        <Counter counter={duration} setCounter={setDuration} />
      </View>
      {errors[name] && (
        <CustomText textAlign="right" baseFont={10} color={Colors?.danger}>
          {errors[name]?.message || ""}
        </CustomText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
});

export default Duration;

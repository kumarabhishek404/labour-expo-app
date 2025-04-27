import React from "react";
import { View, StyleSheet } from "react-native";
import Counter from "./Counter";
import CustomText from "../commons/CustomText";
import CustomHeading from "../commons/CustomHeading";
import Colors from "@/constants/Colors";
import { t } from "@/utils/translationHelper";
import SelectableTags from "./SingleSelectedTag";
import ErrorText from "../commons/ErrorText";

const DURATION = [
  { label: "less_5_days", value: "5" },
  { label: "less_15_days", value: "15" },
  { label: "less_one_month", value: "30" },
  { label: "more_one_month", value: "100" },
  { label: "more_six_months", value: "365" },
];

const Duration = ({ duration, setDuration, errors, name }: any) => {
  return (
    <View style={{ gap: 10 }}>
      <View style={styles.container}>
        <CustomHeading
          textAlign="left"
          baseFont={18}
          fontWeight="600"
          color={Colors?.inputLabel}
        >
          {t("duration_of_service")}{" "}
          <CustomText baseFont={14}> ({t("InDays")})</CustomText>
        </CustomHeading>
        <SelectableTags
          options={DURATION}
          selectedTag={duration}
          setSelectedTag={setDuration}
          tagStyle={styles?.tagStyle}
        />
      </View>
      {errors?.[name] && (
        <ErrorText baseFont={16}> {errors?.[name]?.message || ""}</ErrorText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  tagStyle: {
    backgroundColor: Colors?.fourth,
  },
});

export default Duration;

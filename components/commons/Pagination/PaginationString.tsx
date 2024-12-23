import React from "react";
import { View, StyleSheet } from "react-native";
import CustomText from "../CustomText";
import { t } from "@/utils/translationHelper";

interface PaginationStringProps {
  type: string;
  isLoading: boolean;
  totalFetchedData: number;
  totalData: number;
}

const PaginationString = ({
  type,
  isLoading,
  totalFetchedData,
  totalData,
}: PaginationStringProps) => {
  return (
    <View style={styles.totalData}>
      <CustomText textAlign="left">
        {isLoading
          ? t("loading")
          : `${t("fetched")} ${totalFetchedData || 0} ${t("from")} ${
              totalData || 0
            } ${type}`}
      </CustomText>
    </View>
  );
};

const styles = StyleSheet.create({
  totalData: {
    paddingBottom: 6,
  },
});

export default PaginationString;

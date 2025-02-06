import React from "react";
import { View, StyleSheet } from "react-native";
import CustomText from "../CustomText";
import { t } from "@/utils/translationHelper";
import Colors from "@/constants/Colors";

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
    <>
      {totalData ? (
        <View style={styles.totalData}>
          <CustomText textAlign="left" color={Colors?.tertiery}>
            {isLoading
              ? t("loading")
              : `${t("fetched")} ${totalFetchedData || 0} ${t("from")} ${
                  totalData || 0
                } ${type}`}
          </CustomText>
        </View>
      ) : (
        <></>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  totalData: {
    paddingBottom: 6,
  },
});

export default PaginationString;

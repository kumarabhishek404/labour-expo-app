import React from "react";
import { View, StyleSheet } from "react-native";
import CustomText from "../CustomText";

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
          ? "Loading..."
          : `Fetched ${totalFetchedData || 0} from ${totalData || 0} ${type}`}
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

import React from "react";
import { View, Text, StyleSheet } from "react-native";

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
      <Text style={styles.totalItemTxt}>
        {isLoading
          ? "Loading..."
          : `Fetched ${totalFetchedData || 0} from ${totalData || 0} ${type}`}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  totalData: {
    paddingBottom: 6,
  },
  totalItemTxt: {
    fontSize: 12,
  },
});

export default PaginationString;

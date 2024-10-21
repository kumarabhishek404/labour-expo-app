import Colors from "@/constants/Colors";
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Requirements = ({ requirements }: any) => {
  return (
    <View style={styles.requirmentContainer}>
      {requirements?.map((requirement: any, index: number) => {
        return (
          <View style={styles.card} key={index}>
            <View style={styles.header}>
              <Text style={styles.title}>{requirement?.name}</Text>
              <Text style={styles.price}>
                ₹ {requirement?.payPerDay} Per Day
              </Text>
            </View>
            <Text style={styles.subTitle}>shuttering</Text>

            <View style={styles.details}>
              <Text style={styles.detailLabel}>Count</Text>
              <Text style={styles.detailLabel}>Food</Text>
              <Text style={styles.detailLabel}>Living</Text>
              <Text style={styles.detailLabel}>ESI / PF</Text>
            </View>

            <View style={styles.values}>
              <Text style={styles.value}>{requirement?.count}</Text>
              <Text style={styles.value}>
                {requirement?.food ? "Yes" : "No"}
              </Text>
              <Text style={styles.value}>
                {requirement?.shelterProvider ? "Yes" : "No"}
              </Text>
              <Text style={styles.value}>No</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  requirmentContainer: {
    marginVertical: 10,
    backgroundColor: "#e1e8e5",
    borderRadius: 8,
  },
  card: {
    backgroundColor: "#e1e8e5",
    padding: 15,
    marginBottom: 16,
    borderRadius: 8,
  },
  viewButton: {
    width: 100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors?.black,
    textTransform: "capitalize",
  },
  price: {
    fontSize: 16,
    color: Colors?.black,
  },
  subTitle: {
    fontSize: 14,
    color: Colors?.primary,
    marginBottom: 12,
  },
  details: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 12,
    color: "#4F4F4F",
    fontWeight: "600",
  },
  values: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  value: {
    fontSize: 16,
    color: "#000",
  },
});

export default Requirements;

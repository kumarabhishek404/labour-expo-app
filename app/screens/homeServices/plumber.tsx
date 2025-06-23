import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";

const plumberSubServices = [
  { title: "Tap Installation / Repair", icon: "🚰" },
  { title: "Water Pipe Leakage Fix", icon: "💧" },
  { title: "Toilet Flush Repair", icon: "🚽" },
  { title: "Bathroom Fitting Work", icon: "🛁" },
  { title: "Kitchen Sink Plumbing", icon: "🧼" },
  { title: "Water Tank Cleaning", icon: "🪣" },
  { title: "Drain Blockage Removal", icon: "🪠" },
];

const PlumberServices = ({ setShowSheet }: any) => {
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.heading}>Plumber Services</Text>
      <Text style={styles.subheading}>
        Reliable plumbing help for home and kitchen issues.
      </Text>

      <View style={styles.serviceList}>
        {plumberSubServices.map((service, index) => (
          <View key={index} style={styles.serviceItem}>
            <Text style={styles.icon}>{service.icon}</Text>
            <Text style={styles.serviceText}>{service.title}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default PlumberServices;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1e1e1e",
    marginBottom: 6,
  },
  subheading: {
    fontSize: 14,
    color: "#555",
    marginBottom: 20,
  },
  serviceList: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },
  serviceItem: {
    width: "46%",
    minHeight: 80,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  icon: {
    fontSize: 20,
    marginRight: 12,
  },
  serviceText: {
    fontSize: 16,
    color: "#333",
    flexShrink: 1,
  },
});

import CustomText from "@/components/commons/CustomText";
import { t } from "@/utils/translationHelper";
import { router } from "expo-router";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

// Replace with real icons or vector-icons if needed
const subServices = [
  {
    title: "switchBoardRepair",
    icon: "🔧",
    path: "screens/homeServices/serviceDetails",
  },
  {
    title: "fanInstallationRepair",
    icon: "🌀",
    path: "screens/homeServices/electric/fan-installation",
  },
  {
    title: "lightPointFitting",
    icon: "💡",
    path: "screens/homeServices/electric/light-point-fitting",
  },
  {
    title: "mcbRepair",
    icon: "⚡",
    path: "screens/homeServices/electric/mcb-repair",
  },
  {
    title: "roomWiring",
    icon: "🔌",
    path: "screens/homeServices/electric/room-wiring",
  },
  {
    title: "earthing",
    icon: "🌍",
    path: "screens/homeServices/electric/earthing",
  },
  {
    title: "fuseReplacement",
    icon: "🔥",
    path: "screens/homeServices/electric/fuse-replacement",
  },
];

const ElectricianSubServices = ({ setShowSheet }: any) => {
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.heading}>{t("electricianServices")}</Text>
      <Text style={styles.subheading}>
        {t("electricianServicesSubheading")}
      </Text>

      <View style={styles.serviceList}>
        {subServices.map((service, index) => (
          <TouchableOpacity
            key={index}
            style={styles.serviceItem}
            onPress={() => {
              setShowSheet(false);
              router?.push({ pathname: `/${service?.path}` });
            }}
          >
            <Text style={styles.icon}>{service.icon}</Text>
            <CustomText style={styles.serviceText}>
              {t(service.title)}
            </CustomText>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default ElectricianSubServices;

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

import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useAtomValue } from "jotai";
import { Stack } from "expo-router";
import { UserAtom } from "../../AtomStore/user";
import CustomHeader from "@/components/commons/Header";
import { t } from "@/utils/translationHelper";
import { Ionicons } from "@expo/vector-icons";

const SettingItem = ({ title, icon, onPress }: any) => (
  <TouchableOpacity style={styles.settingItem} onPress={onPress}>
    <View style={styles.settingContent}>
      <Ionicons name={icon} size={24} color="#555" />
      <Text style={styles.settingText}>{title}</Text>
    </View>
    <Ionicons name="chevron-forward" size={24} color="#999" />
  </TouchableOpacity>
);

const SectionHeader = ({ title }: any) => (
  <Text style={styles.sectionHeader}>{title}</Text>
);

const AdminSettings = () => {
  const userDetails = useAtomValue(UserAtom);

  const handleUserManagement = () => {
    // Navigate to user management screen
  };

  const handleServiceSettings = () => {
    // Navigate to service settings
  };

  const handleWorkerSettings = () => {
    // Navigate to worker settings
  };

  const handlePaymentSettings = () => {
    // Navigate to payment settings
  };

  const handleSystemSettings = () => {
    // Navigate to system settings
  };

  return (
    <>
      <Stack.Screen
        options={{
          header: () => (
            <CustomHeader
              title={t("adminSettings")}
              right="notification"
            />
          ),
        }}
      />
      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <SectionHeader title={t("userManagement")} />
          <SettingItem
            title={t("manageUsers")}
            icon="people"
            onPress={handleUserManagement}
          />
          <SettingItem
            title={t("roles")}
            icon="shield"
            onPress={handleUserManagement}
          />
        </View>

        <View style={styles.section}>
          <SectionHeader title={t("serviceManagement")} />
          <SettingItem
            title={t("serviceCategories")}
            icon="list"
            onPress={handleServiceSettings}
          />
          <SettingItem
            title={t("serviceRequests")}
            icon="clipboard"
            onPress={handleServiceSettings}
          />
        </View>

        <View style={styles.section}>
          <SectionHeader title={t("workerManagement")} />
          <SettingItem
            title={t("workerVerification")}
            icon="checkmark-circle"
            onPress={handleWorkerSettings}
          />
          <SettingItem
            title={t("skills")}
            icon="construct"
            onPress={handleWorkerSettings}
          />
        </View>

        <View style={styles.section}>
          <SectionHeader title={t("systemSettings")} />
          <SettingItem
            title={t("payments")}
            icon="card"
            onPress={handlePaymentSettings}
          />
          <SettingItem
            title={t("appSettings")}
            icon="settings"
            onPress={handleSystemSettings}
          />
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  section: {
    marginVertical: 8,
    backgroundColor: "#FFF",
    paddingVertical: 8,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#FFF",
  },
  settingContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingText: {
    fontSize: 16,
    marginLeft: 12,
    color: "#333",
  },
});

export default AdminSettings;

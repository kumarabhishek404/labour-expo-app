import React, { useState } from "react";
import { View, StyleSheet, ScrollView, StatusBar } from "react-native";
import Colors from "@/constants/Colors";
import TabSwitcher from "@/components/inputs/Tabs";
import SearchWorkers from "./searchWorkers";
import SearchServices from "./searchServices";

const Search = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const TABS = [
    {
      label: "workers",
      description:
        "Search all the active workers by search filter (name and skill) below",
    },
    {
      label: "services",
      description:
        "Search all the active services by search filter (work type and sub type) below",
    },
  ];

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={{ flex: 1, justifyContent: "flex-start", gap: 20 }}>
        <TabSwitcher
          tabs={TABS}
          actvieTab={selectedTab}
          setActiveTab={setSelectedTab}
        />
        {selectedTab === 0 && <SearchWorkers style={styles?.shadowBox} />}
        {selectedTab === 1 && <SearchServices style={styles?.shadowBox} />}
      </View>
    </ScrollView>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#EAF0FF",
    justifyContent: "space-between",
    minHeight: "100%",
  },
  shadowBox: {
    shadowColor: "#000", // Subtle black shadow
    shadowOffset: { width: 0, height: 4 }, // Shadow position
    shadowOpacity: 0.1, // Light shadow for elegance
    shadowRadius: 6, // Smooth blur effect
    elevation: 4, // Works for Android
  },
});

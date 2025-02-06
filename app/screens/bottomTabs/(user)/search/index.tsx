import React, { useState } from "react";
import { View, StyleSheet, ScrollView, StatusBar } from "react-native";
import Colors from "@/constants/Colors";
import TabSwitcher from "@/components/inputs/Tabs";
import SearchWorkers from "./searchWorkers";
import SearchServices from "./searchServices";

const Search = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <StatusBar backgroundColor={Colors?.white} />
      <View>
        <TabSwitcher
          tabs={["Workers", "Services"]}
          actvieTab={selectedTab}
          setActiveTab={setSelectedTab}
        />
        {selectedTab === 0 && <SearchWorkers />}
        {selectedTab === 1 && <SearchServices />}
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
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: Colors?.white,
    padding: 20,
    position: "relative",
  },
  tab: {
    alignItems: "center",
    alignSelf: "flex-start",
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors?.primary,
    paddingHorizontal: 15,
  },
  activeTab: {
    backgroundColor: Colors?.primary,
  },
  tabText: {
    fontSize: 14,
    color: Colors?.primary,
    fontWeight: "bold",
    marginTop: 5,
  },
  activeTabText: {
    color: Colors?.white,
  },
});

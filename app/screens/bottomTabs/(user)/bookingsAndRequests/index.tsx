import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  StatusBar,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import TabSwitcher from "@/components/inputs/Tabs";
import Bookings from "./bookings";
import Requests from "./requests";

const BookingsAndRequests = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  
  return (
    <>
      <StatusBar backgroundColor={Colors?.white} />
      <View style={styles.container}>
        <TabSwitcher
          tabs={["Bookings", "Requests"]}
          actvieTab={selectedTab}
          setActiveTab={setSelectedTab}
        />
        {selectedTab === 0 && <Bookings />}
        {selectedTab === 1 && <Requests />}
      </View>
    </>
  );
};

export default BookingsAndRequests;

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

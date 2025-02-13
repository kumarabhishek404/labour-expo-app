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
  const TABS = [
    {
      label: "allBookings",
      description: "Services in which you are selected or booked directly",
    },
    {
      label: "allRequests",
      description:
        "These are the requests which you have recieved from the employer and you send to the workers",
    },
  ];
  return (
    <>
      <View style={styles.container}>
        <TabSwitcher
          tabs={TABS}
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
});

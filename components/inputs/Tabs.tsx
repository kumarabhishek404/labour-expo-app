import Colors from "@/constants/Colors";
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
} from "react-native";

const TabSwitcher = ({ tabs, actvieTab, setActiveTab }: any) => {
  const translateX = useRef(new Animated.Value(0)).current;

  const screenWidth = Dimensions.get("window").width;
  const tabWidth = (screenWidth - 80) / tabs.length; // Adjust width dynamically

  const handleTabPress = (index: number) => {
    setActiveTab(index);
    Animated.spring(translateX, {
      toValue: index * tabWidth,
      useNativeDriver: true,
      speed: 10,
      bounciness: 10,
    }).start();
  };

  return (
    <View style={styles.container}>
      <View style={[styles.tabContainer, { width: tabWidth * tabs.length }]}>
        {/* Active Tab Background */}
        <Animated.View
          style={[
            styles.activeTab,
            { width: tabWidth, transform: [{ translateX }] },
          ]}
        />

        {/* Tab Options */}
        {tabs.map((tab: any, index: any) => (
          <TouchableOpacity
            key={tab}
            style={styles.tab}
            onPress={() => handleTabPress(index)}
          >
            <Text
              style={[styles.tabText, actvieTab === index && styles.activeText]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default TabSwitcher;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors?.white, // Background color from image
    paddingVertical: 20,
  },
  tabContainer: {
    flexDirection: "row",
    // backgroundColor: Colors?.primary, // Transparent background
    borderRadius: 30,
    paddingVertical: 8,
    paddingHorizontal: 8,
    position: "relative",
    gap: 8,
    // height: 50, // Fixed height for consistency
  },
  tab: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    zIndex: 1,
  },
  tabText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors?.primary, // Inactive text color
  },
  activeText: {
    fontWeight: "bold",
    color: Colors?.white, // Active text color
  },
  activeTab: {
    position: "absolute",
    height: "100%",
    backgroundColor: Colors?.primary,
    borderRadius: 30,
    elevation: 3, // Shadow effect
    top: 8,
    left: 0,
  },
});

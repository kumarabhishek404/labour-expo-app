import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from "react-native";
import Colors from "@/constants/Colors";

const ProfileTabs = ({ tabPositions, selectedTab, setSelectedTab }: any) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateX, {
        toValue: tabPositions[selectedTab] * 180, // Adjust based on tab width
        useNativeDriver: true,
        friction: 6,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1.1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  }, [selectedTab]);

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        {/* Animated Sliding Underline */}
        <Animated.View
          style={[styles.activeIndicator, { transform: [{ translateX }] }]}
        />

        <TouchableOpacity
          style={styles.tab}
          onPress={() => setSelectedTab("Profile Information")}
        >
          <Animated.Text
            style={[
              styles.tabText,
              selectedTab === "Profile Information" && styles.activeTabText,
              {
                opacity:
                  selectedTab === "Profile Information" ? opacityAnim : 0.6,
              },
            ]}
          >
            Profile Information
          </Animated.Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tab}
          onPress={() => setSelectedTab("Other Information")}
        >
          <Animated.Text
            style={[
              styles.tabText,
              selectedTab === "Other Information" && styles.activeTabText,
              {
                opacity:
                  selectedTab === "Other Information" ? opacityAnim : 0.6,
              },
            ]}
          >
            Other Information
          </Animated.Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Colors?.white,
  },
  tabContainer: {
    flexDirection: "row",
    width: "100%",
    position: "relative",
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
  },
  tabText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors?.black,
  },
  activeTabText: {
    color: Colors.primary,
  },
  activeIndicator: {
    position: "absolute",
    bottom: -2,
    left: 0,
    width: 180, // Adjust based on the width of your tabs
    height: 4,
    backgroundColor: Colors.primary,
    borderRadius: 10,
  },
});

export default ProfileTabs;

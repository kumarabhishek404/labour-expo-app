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
    alignSelf: "center",
    backgroundColor: Colors?.background,
  },
  tabContainer: {
    flexDirection: "row",
    width: "100%",
    position: "relative",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 20,
  },
  tabText: {
    fontSize: 15,
    fontWeight: "bold",
    color: Colors?.heading,
  },
  activeTabText: {
    color: Colors.heading,
  },
  activeIndicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "50%", // Adjust based on the width of your tabs
    height: 3,
    backgroundColor: Colors.heading,
    borderRadius: 8,
  },
});

export default ProfileTabs;

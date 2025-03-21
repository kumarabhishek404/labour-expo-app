import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
} from "react-native";
import Colors from "@/constants/Colors";
import { t } from "@/utils/translationHelper";

const ProfileTabs = ({
  tabs,
  selectedTab,
  setSelectedTab,
  containerStyle,
}: any) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const { width } = Dimensions.get("window");

  const tabWidth = width / tabs.length; // Calculate tab width percentage

  useEffect(() => {
    const index = tabs.indexOf(selectedTab);
    Animated.parallel([
      Animated.spring(translateX, {
        toValue: index * (tabWidth), // Adjust based on tab width
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
    <View style={[styles.container, containerStyle]}>
      <View style={styles.tabContainer}>
        <Animated.View
          style={[
            styles.activeIndicator,
            { transform: [{ translateX }], width: `${tabWidth/ 4}%` },
          ]}
        />
        {tabs.map((tab: string) => (
          <TouchableOpacity
            key={tab}
            style={styles.tab}
            onPress={() => setSelectedTab(tab)}
          >
            <Animated.Text
              style={[
                styles.tabText,
                selectedTab === tab && styles.activeTabText,
                { opacity: selectedTab === tab ? opacityAnim : 0.6 },
              ]}
            >
              {t(tab)}
            </Animated.Text>
          </TouchableOpacity>
        ))}
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
    height: 3,
    backgroundColor: Colors.heading,
    borderRadius: 8,
  },
});

export default ProfileTabs;

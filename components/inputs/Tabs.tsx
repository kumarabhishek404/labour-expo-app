import Colors from "@/constants/Colors";
import { t } from "@/utils/translationHelper";
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
} from "react-native";
import CustomText from "../commons/CustomText";

const TabSwitcher = ({ tabs, actvieTab, setActiveTab, textStyle }: any) => {
  const translateX = useRef(new Animated.Value(0)).current;

  const screenWidth = Dimensions.get("window").width;
  const tabWidth = (screenWidth - 40) / tabs.length; // Adjust width dynamically

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
            key={tab?.label}
            style={styles.tab}
            onPress={() => handleTabPress(index)}
          >
            <Text
              style={[
                styles.tabText,
                textStyle,
                actvieTab === index && styles.activeText,
              ]}
            >
              {t(tab?.label)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {tabs[actvieTab]?.description && (
        <View style={{ paddingHorizontal: 18, paddingBottom: 10 }}>
          <CustomText
            baseFont={14}
            textAlign={actvieTab === 0 ? "left" : "right"}
            color={Colors?.subHeading}
          >
            <CustomText
              color={Colors?.tertieryButton}
              baseFont={15}
              fontWeight="600"
            >
              NOTE :{" "}
            </CustomText>
            {tabs[actvieTab]?.description}
          </CustomText>
        </View>
      )}
    </View>
  );
};

export default TabSwitcher;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors?.background, // Background color from image
    paddingVertical: 5,
    paddingBottom: 10,
  },
  tabContainer: {
    width: "100%",
    flexDirection: "row",
    // backgroundColor: Colors?.primary, // Transparent background
    borderRadius: 30,
    paddingVertical: 8,
    paddingHorizontal: 8,
    position: "relative",
    gap: 20,
    // height: 50, // Fixed height for consistency
  },
  tab: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 5,
    zIndex: 1,
    borderWidth: 1,
    borderColor: Colors?.primary,
    borderRadius: 100,
  },
  tabText: {
    fontSize: 12,
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
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

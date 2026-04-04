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
        <View style={{ width: "100%", paddingHorizontal: 18, paddingTop: 5 }}>
          <CustomText
            baseFont={16}
            textAlign={actvieTab === 0 ? "left" : "right"}
            color={Colors?.subHeading}
          >
            <CustomText
              color={Colors?.tertieryButton}
              baseFont={18}
              fontWeight="600"
            >
              {t('note')} :{" "}
            </CustomText>
            {t(tabs[actvieTab]?.description)}
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
    backgroundColor: Colors?.primary,
    paddingVertical: 4,
    paddingBottom: 6,
  },
  tabContainer: {
    width: "100%",
    flexDirection: "row",
    // backgroundColor: "rgba(255,255,255,0.14)",
    borderRadius: 28,
    paddingVertical: 5,
    paddingHorizontal: 5,
    position: "relative",
    gap: 6,
  },
  tab: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 9,
    paddingHorizontal: 4,
    zIndex: 1,
    borderWidth: 1,
    borderColor: Colors?.white,
    borderRadius: 100,
  },
  tabText: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors?.white,
  },
  activeText: {
    fontWeight: "800",
    color: Colors?.primary,
  },
  activeTab: {
    position: "absolute",
    height: "100%",
    backgroundColor: Colors?.white,
    borderRadius: 24,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    top: 5,
    left: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

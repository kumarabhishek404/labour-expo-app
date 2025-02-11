import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

// Bottom Navigation Constants
const numTabs = 4;
const tabWidth = width / numTabs;
const tooltipWidth = 160;
const arrowSize = 32;
const bottomNavHeight = 75;

const BottomNavTutorial = ({ isVisible, onClose }: any) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Post Service",
      text: "Post your services here",
      index: 0,
      icon: "add",
    },
    {
      title: "Search",
      text: "Find services near you",
      index: 1,
      icon: "search",
    },
    {
      title: "Bookings",
      text: "View your bookings",
      index: 2,
      icon: "calendar-month",
    },
    { title: "Profile", text: "Manage your profile", index: 3, icon: "person" },
  ];

  // Get tooltip position dynamically
  const getTooltipPosition = (index: number) => {
    let leftPos = tabWidth * index + tabWidth / 2 - tooltipWidth / 2;
    if (index === 0) leftPos = 10;
    if (index === steps.length - 1) leftPos = width - tooltipWidth - 10;
    return leftPos;
  };

  // Get arrow position dynamically
  const getArrowPosition = (index: number) => {
    const centerOfTab = tabWidth * index + tabWidth / 2; // Center of the selected tab
    const arrowLeftRelativeToTooltip = centerOfTab - getTooltipPosition(index); // Adjust relative to tooltip
    return { left: arrowLeftRelativeToTooltip - arrowSize / 2 }; // Center the arrow
  };

  return (
    <Modal visible={isVisible} transparent animationType="fade">
      <View style={styles.overlay}>
        {/* Tooltip Positioned Above the Selected Tab */}
        <View
          style={[
            styles.tooltip,
            { left: getTooltipPosition(steps[step].index) },
          ]}
        >
          <MaterialIcons
            name="arrow-drop-down"
            size={arrowSize}
            color="#fff"
            style={[styles.arrowIcon, getArrowPosition(steps[step].index)]}
          />
          <View style={styles.tooltipContent}>
            <Text style={styles.title}>{steps[step].title}</Text>
            <Text style={styles.tooltipText}>{steps[step].text}</Text>
            <View style={styles.buttonContainer}>
              {step > 0 && (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => setStep(step - 1)}
                >
                  <Text style={styles.buttonText}>Back</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  step < steps.length - 1 ? setStep(step + 1) : onClose()
                }
              >
                <Text style={styles.buttonText}>
                  {step < steps.length - 1 ? "Next" : "Got it!"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Bottom Navigation Replica (Overlay for Tutorial) */}
        <View style={styles.bottomNav}>
          {steps.map((item, index) => (
            <View key={index} style={styles.tabContainer}>
              <View
                style={[
                  styles.iconWrapper,
                  { opacity: step === index ? 1 : 0 },
                ]}
              >
                <MaterialIcons
                  name={item.icon}
                  size={32}
                  color={step === index ? "#ff9800" : "#666"}
                />
                <Text
                  style={[
                    styles.tabText,
                    { color: step === index ? "#ff9800" : "#666" },
                  ]}
                >
                  {item.title}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
    paddingBottom: height * 0.1, // Adjust to position tooltip above bottom nav
  },
  tooltip: {
    position: "absolute",
    bottom: bottomNavHeight + 20, // Keep tooltip above bottom navigation
    alignItems: "center",
    width: tooltipWidth,
  },
  arrowIcon: {
    position: "absolute",
    bottom: -15, // Position arrow below the tooltip
  },
  tooltipContent: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    alignItems: "center",
    width: "100%",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  tooltipText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    backgroundColor: "#ff9800",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    width: width,
    height: bottomNavHeight,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ddd",
    paddingBottom: 10, // For safe area on some devices
  },
  tabContainer: {
    width: tabWidth,
    alignItems: "center",
  },
  iconWrapper: {
    alignItems: "center",
  },
  tabText: {
    fontWeight: "bold",
    marginTop: 5,
  },
});

export default BottomNavTutorial;

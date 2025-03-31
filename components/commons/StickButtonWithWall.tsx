import React from "react";
import { View, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // Using Material Icons
import RippleDot from "./RippleDot";

const { width } = Dimensions.get("window"); // Get device width

const StickButtonWithWall = ({ onPress, notificationCount }: any) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={{}}>
        <MaterialIcons name="notifications" size={28} color="#fff" />
        {notificationCount > 0 && (
          <RippleDot />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 90, // Adjust to be above bottom navigation
    right: -25, // Half of the button hidden in the right wall
    backgroundColor: "#1E3A8A", // Deep Blue Color
    // width: 50,
    height: 50,
    paddingRight: 30,
    paddingLeft: 10,
    borderRadius: 25, // Makes it circular
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5, // Shadow for Android
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default StickButtonWithWall;

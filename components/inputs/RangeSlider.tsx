import React, { useState } from "react";
import {
  View,
  StyleSheet,
  PanResponder,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import CustomHeading from "../commons/CustomHeading";
import CustomText from "../commons/CustomText";

const RangeSlider = () => {
  const [distance, setDistance] = useState(1); // Initialize distance state
  const SLIDER_WIDTH = Dimensions.get("window").width - 80; // Adjust width to fit design
  const MAX_DISTANCE = 100; // Max distance in km
  const MIN_DISTANCE = 1; // Min distance in km

  // Calculate thumb position based on current distance
  const thumbPosition =
    ((distance - MIN_DISTANCE) / (MAX_DISTANCE - MIN_DISTANCE)) * SLIDER_WIDTH;

  // Calculate distance based on thumb's position on track
  const calculateDistance = (positionX) => {
    const positionRatio = positionX / SLIDER_WIDTH;
    let newDistance = Math.round(
      positionRatio * (MAX_DISTANCE - MIN_DISTANCE) + MIN_DISTANCE
    );
    return Math.max(MIN_DISTANCE, Math.min(MAX_DISTANCE, newDistance)); // Clamp within range
  };

  // PanResponder for thumb dragging
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      const newDistance = calculateDistance(gestureState.dx + thumbPosition);
      setDistance(newDistance);
    },
  });

  // Move the thumb to the tapped position on track
  const handleTrackPress = (event) => {
    const tappedPositionX = event.nativeEvent.locationX;
    const newDistance = calculateDistance(tappedPositionX);
    setDistance(newDistance);
  };

  return (
    <View style={styles.container}>
      <CustomHeading>Where do you want to search?</CustomHeading>
      <View style={styles.labelContainer}>
        <CustomHeading style={styles.labelText}>Distance</CustomHeading>
        <CustomText style={styles.labelText}>Max. {distance} Km</CustomText>
      </View>
      <TouchableOpacity
        style={styles.sliderContainer}
        onPress={handleTrackPress}
        activeOpacity={1}
      >
        <View style={styles.trackContainer}>
          {/* Filled track up to the thumb */}
          <View style={[styles.trackFilled, { width: thumbPosition }]} />
          {/* Empty track from thumb to end */}
          <View style={styles.track} />
          {/* Thumb position */}
          <View
            style={[styles.thumb, { left: thumbPosition - 10 }]}
            {...panResponder.panHandlers}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  headerText: {
    fontSize: 14,
    color: "#999",
    marginBottom: 10,
    textAlign: "left",
    width: "100%",
  },
  labelContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  labelText: {
    fontSize: 16,
    color: "#000",
  },
  sliderContainer: {
    width: "100%",
    paddingHorizontal: 20,
  },
  trackContainer: {
    position: "relative",
    width: "100%",
    height: 6,
    justifyContent: "center",
  },
  track: {
    position: "absolute",
    width: "100%",
    height: 4,
    backgroundColor: "#ddd",
    borderRadius: 2,
  },
  trackFilled: {
    position: "absolute",
    height: 4,
    backgroundColor: "#4A90E2", // Blue color for the filled portion
    borderRadius: 2,
  },
  thumb: {
    width: 20,
    height: 20,
    backgroundColor: "#4A90E2", // Blue color for the thumb
    borderRadius: 10,
    position: "absolute",
    top: -8,
  },
});

export default RangeSlider;

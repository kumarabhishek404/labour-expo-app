import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";

export default function RippleDot() {
  const scaleAnim = useRef(new Animated.Value(0)).current; // Scale animation
  const opacityAnim = useRef(new Animated.Value(1)).current; // Opacity animation

  useEffect(() => {
    const rippleAnimation = Animated.loop(
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 2, // Scale the dot to 2x its size
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0, // Fade out to 0 opacity
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
      {
        iterations: -1, // Infinite loop
      }
    );

    rippleAnimation.start();

    // Cleanup animation on unmount
    return () => rippleAnimation.stop();
  }, [scaleAnim, opacityAnim]);

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Animated.View
          style={[
            styles.rippleDot,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        />
        <Animated.View
          style={[styles.alertDot, { transform: [{ scale: scaleAnim }] }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: -5,
    left: -5,
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    position: "relative",
  },
  rippleDot: {
    position: "absolute",
    top: -5,
    left: -5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "red", // Customize the dot color
  },
  alertDot: {
    width: 10,
    height: 10,
    backgroundColor: "red",
    borderRadius: 30,
  },
});

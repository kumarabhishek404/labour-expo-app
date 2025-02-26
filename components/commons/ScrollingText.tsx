import React, { useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
} from "react-native-reanimated";
import CustomText from "./CustomText";
import Colors from "@/constants/Colors";

const { width } = Dimensions.get("window");

const ScrollingText = ({
  text = "Facilities of food and living available",
  icon,
  textColor = Colors.tertieryButton,
  baseFont = 16,
  duration = 10000, // Total duration for one full cycle
}: any) => {
  const translateX = useSharedValue(0);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(-width, {
        duration: duration,
        easing: Easing.linear,
      }),
      -1, // Infinite loop
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[animatedStyle, styles.textWrapper]}>
        {/* First instance of the text */}
        <View style={styles.textContainer}>
          {icon}
          <CustomText baseFont={baseFont} color={textColor}>
            {text}
          </CustomText>
        </View>

        {/* Second instance of the text for seamless looping */}
        <View style={styles.textContainer}>
          {icon}
          <CustomText baseFont={baseFont} color={textColor}>
            {text}
          </CustomText>
        </View>
      </Animated.View>
    </View>
  );
};

export default ScrollingText;

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    width: "100%",
  },
  textWrapper: {
    flexDirection: "row",
    width: width * 2,
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: width,
    paddingHorizontal: 10,
    gap: 5,
  },
});

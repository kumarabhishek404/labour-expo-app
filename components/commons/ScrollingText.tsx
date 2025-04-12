import React, { useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
  cancelAnimation,
} from "react-native-reanimated";
import CustomText from "./CustomText";
import Colors from "@/constants/Colors";

const { width } = Dimensions.get("window");

const ScrollingText = ({
  text,
  icon,
  textColor = Colors.tertieryButton,
  baseFont = 16,
  duration = 10000,
}: any) => {
  const translateX = useSharedValue(0);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(-width, {
        duration,
        easing: Easing.linear,
      }),
      -1,
      false
    );

    return () => {
      cancelAnimation(translateX);
      translateX.value = 0;
    };
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[animatedStyle, styles.textWrapper]}>
        <View style={styles.textContainer}>
          {icon}
          <CustomText baseFont={baseFont} color={textColor}>
            {text}
          </CustomText>
        </View>
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

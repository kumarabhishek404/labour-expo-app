import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Dimensions, Animated, Easing } from "react-native";
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
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(translateX, {
        toValue: -width, // scroll completely to the left
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    animation.start();

    return () => {
      animation.stop();
      translateX.setValue(0);
    };
  }, [duration, translateX]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.textWrapper,
          {
            transform: [{ translateX }],
          },
        ]}
      >
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

import React, { useEffect, useRef } from "react";
import { View, Animated, Easing, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { t } from "@/utils/translationHelper";

const ScrollHint = ({ style }: any) => {
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [animation]);

  const translateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [-10, 10],
  });

  return (
    <View style={[styles.container, style]}>
      <Animated.Text style={[styles.text, { transform: [{ translateX }] }]}>
        {t("scrollToRight")}
      </Animated.Text>
      <Animated.View style={{ transform: [{ translateX }] }}>
        <MaterialIcons name="arrow-forward" size={20} color="#1F3E72" />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    justifyContent: "center",
  },
  text: {
    fontSize: 14,
    color: "#1F3E72",
    fontWeight: "500",
    marginRight: 8,
  },
});

export default ScrollHint;

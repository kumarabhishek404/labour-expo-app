import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors"; // Adjust the path if needed

const { width } = Dimensions.get("window");

const NotificationBanner = ({ title, body, onClose }: any) => {
  const [visible, setVisible] = useState(true);
  const translateY = useSharedValue(-100);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  useEffect(() => {
    // Slide-in animation
    translateY.value = withTiming(0, {
      duration: 500,
      easing: Easing.out(Easing.ease),
    });

    // Auto-hide after 10 seconds
    const timer = setTimeout(() => {
      hideBanner();
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const hideBanner = () => {
    translateY.value = withTiming(-100, {
      duration: 500,
      easing: Easing.in(Easing.ease),
    });
    setTimeout(() => setVisible(false), 500);
  };

  if (!visible) return null;

  return (
    <Animated.View style={[styles.bannerContainer, animatedStyle]}>
      <View style={styles.contentContainer}>
        <Ionicons
          name="notifications-outline"
          size={24}
          color={Colors.primary}
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{body}</Text>
        </View>
        <TouchableOpacity onPress={hideBanner}>
          <Ionicons name="close" size={24} color={Colors.secondary} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default NotificationBanner;

const styles = StyleSheet.create({
  bannerContainer: {
    position: "absolute",
    top: 0,
    width: width - 20,
    marginHorizontal: 10,
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primary,
  },
  message: {
    fontSize: 14,
    color: Colors.text,
  },
});

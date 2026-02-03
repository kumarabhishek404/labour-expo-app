import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Easing,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";

const { width } = Dimensions.get("window");

const NotificationBanner = ({ title, body, onClose }: any) => {
  const [visible, setVisible] = useState(true);
  const translateY = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    // Slide down
    Animated.timing(translateY, {
      toValue: 0,
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();

    // Auto hide after 10s
    const timer = setTimeout(() => {
      hideBanner();
    }, 10000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const hideBanner = () => {
    Animated.timing(translateY, {
      toValue: -100,
      duration: 500,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
      onClose?.();
    });
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[styles.bannerContainer, { transform: [{ translateY }] }]}
    >
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

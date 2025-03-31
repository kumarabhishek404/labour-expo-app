import React, { useEffect, useRef } from "react";
import { View, Animated } from "react-native";
import Colors from "@/constants/Colors";

const SkeletonPlaceholder = ({ style }: any) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={[style, { backgroundColor: "#E1E9EE", opacity }]} />
  );
};

const NotificationPlaceholder = () => {
  return (
    <View style={{ padding: 20, backgroundColor: Colors.fourth }}>
      {Array.from({ length: 20 }).map((_, index) => (
        <View key={index} style={{ flexDirection: "row", marginBottom: 20 }}>
          <SkeletonPlaceholder
            style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }}
          />
          <View style={{ flex: 1 }}>
            <SkeletonPlaceholder
              style={{ width: "60%", height: 15, marginBottom: 5 }}
            />
            <SkeletonPlaceholder style={{ width: "80%", height: 15 }} />
          </View>
        </View>
      ))}
    </View>
  );
};

export default NotificationPlaceholder;

import React, { useEffect, useRef } from "react";
import { View, Animated, Dimensions } from "react-native";
import Colors from "@/constants/Colors";

const SkeletonPlaceholder = ({ style }: { style: any }) => {
  const opacity = useRef(new Animated.Value(0.3)).current;
  const animation = useRef(
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true, // Try setting this to false if the issue persists
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    )
  ).current;

  useEffect(() => {
    animation.start();

    return () => {
      animation.stop(); // Ensuring cleanup to prevent memory leaks
    };
  }, []);

  return (
    <Animated.View style={[style, { backgroundColor: "#E1E9EE", opacity }]} />
  );
};

const { width } = Dimensions.get("window");
const IMG_HEIGHT = 300;

const UserProfilePlaceholder = () => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.fourth,
      }}
    >
      <SkeletonPlaceholder style={{ width, height: IMG_HEIGHT }} />
      <View style={{ padding: 20, backgroundColor: Colors.fourth }}>
        <SkeletonPlaceholder
          style={{
            width: 150,
            height: 150,
            borderRadius: 75,
            alignSelf: "flex-end",
            marginBottom: 20,
            position: "absolute",
            top: -100,
            right: 20,
          }}
        />
        <SkeletonPlaceholder
          style={{ width: "40%", height: 20, marginBottom: 10 }}
        />
        <SkeletonPlaceholder
          style={{ width: "50%", height: 15, marginBottom: 10 }}
        />
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <SkeletonPlaceholder
            style={{ width: 30, height: 30, borderRadius: 8 }}
          />
          <SkeletonPlaceholder style={{ width: "40%", height: 15 }} />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 10,
          }}
        >
          <SkeletonPlaceholder
            style={{ width: 100, height: 30, borderRadius: 8 }}
          />
          <SkeletonPlaceholder
            style={{ width: 100, height: 30, borderRadius: 8 }}
          />
        </View>
        <SkeletonPlaceholder
          style={{ width: "100%", height: 100, marginTop: 20, borderRadius: 8 }}
        />
        <SkeletonPlaceholder
          style={{ width: "100%", height: 150, marginTop: 10, borderRadius: 8 }}
        />
      </View>
    </View>
  );
};

export default UserProfilePlaceholder;

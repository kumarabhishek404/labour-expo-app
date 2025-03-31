import Colors from "@/constants/Colors";
import React, { useEffect, useRef } from "react";
import { View, Animated } from "react-native";

const SkeletonPlaceholder = ({ style }: { style: any }) => {
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

const ListingsWorkersPlaceholder = () => {
  return (
    <View style={{ gap: 20, paddingHorizontal: 20, paddingVertical: 20 }}>
      {Array.from({ length: 7 }).map((_, index) => (
        <View
          key={index}
          style={{
            flexDirection: "row",
            gap: 10,
            backgroundColor: Colors.white,
            borderTopLeftRadius: 8,
            borderBottomLeftRadius: 8,
          }}
        >
          <SkeletonPlaceholder
            style={{
              width: 80,
              height: 100,
              borderTopLeftRadius: 8,
              borderBottomLeftRadius: 8,
            }}
          />
          <View style={{ flex: 1, paddingVertical: 10, paddingRight: 10 }}>
            <SkeletonPlaceholder
              style={{ width: "50%", height: 10, marginBottom: 5 }}
            />
            <SkeletonPlaceholder
              style={{ width: "70%", height: 15, marginBottom: 5 }}
            />
            <SkeletonPlaceholder
              style={{ width: "60%", height: 12, marginBottom: 5 }}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 8,
              }}
            >
              <SkeletonPlaceholder style={{ width: 50, height: 12 }} />
              <SkeletonPlaceholder style={{ width: 50, height: 12 }} />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

export default ListingsWorkersPlaceholder;

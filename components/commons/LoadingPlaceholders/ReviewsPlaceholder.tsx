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

const ReviewsPlaceholder = () => {
  return (
    <View
      style={{
        gap: 20,
        paddingHorizontal: 20,
        paddingVertical: 20,
        backgroundColor: Colors?.fourth,
      }}
    >
      {/* Stats Section Placeholder */}
      <View
        style={{
          flexDirection: "row",
          backgroundColor: Colors.white,
          borderRadius: 8,
          padding: 15,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 5,
          shadowOffset: { width: 0, height: 2 },
          elevation: 1,
        }}
      >
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <SkeletonPlaceholder
            style={{ width: 40, height: 20, borderRadius: 4 }}
          />
          <SkeletonPlaceholder
            style={{ width: 100, height: 20, marginTop: 5 }}
          />
        </View>
        <View
          style={{ width: 1, backgroundColor: "#E0E0E0", marginHorizontal: 15 }}
        />
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <SkeletonPlaceholder
            style={{ width: 40, height: 20, borderRadius: 4 }}
          />
          <SkeletonPlaceholder
            style={{ width: 80, height: 20, marginTop: 5 }}
          />
        </View>
      </View>

      {/* Reviews List Placeholder */}
      {Array.from({ length: 10 }).map((_, index) => (
        <View
          key={index}
          style={{
            backgroundColor: Colors.white,
            borderRadius: 8,
            padding: 15,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 5,
            shadowOffset: { width: 0, height: 2 },
            elevation: 1,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <SkeletonPlaceholder
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                marginRight: 10,
              }}
            />
            <View style={{ flex: 1 }}>
              <SkeletonPlaceholder
                style={{ width: 120, height: 15, marginBottom: 5 }}
              />
              <SkeletonPlaceholder style={{ width: 80, height: 15 }} />
            </View>
          </View>
          <SkeletonPlaceholder
            style={{ width: "90%", height: 15, marginBottom: 5 }}
          />
          <SkeletonPlaceholder style={{ width: "60%", height: 15 }} />
        </View>
      ))}
    </View>
  );
};

export default ReviewsPlaceholder;

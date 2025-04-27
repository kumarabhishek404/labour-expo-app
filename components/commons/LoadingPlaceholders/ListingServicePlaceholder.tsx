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

const ListingsServicesPlaceholder = () => {
  return (
    <View style={{ gap: 20, paddingHorizontal: 20, paddingVertical: 20 }}>
      {Array.from({ length: 4 }).map((_, index) => (
        <View
          key={index}
          style={{
            backgroundColor: Colors.white,
            borderRadius: 8,
          }}
        >
          <SkeletonPlaceholder
            style={{
              width: "100%",
              height: 150,
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              backgroundColor: Colors.white,
            }}
          />
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <SkeletonPlaceholder
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                marginLeft: 10,
                marginRight: 10,
                marginBottom: 10,
              }}
            />
            <View>
              <SkeletonPlaceholder
                style={{ width: 120, height: 15, marginBottom: 5 }}
              />
              <SkeletonPlaceholder style={{ width: 80, height: 15 }} />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

export default ListingsServicesPlaceholder;

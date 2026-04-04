import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/Colors";

interface AnimatedGradientWrapperProps {
  children: React.ReactNode;
  height?: number | string;
  style?: StyleProp<ViewStyle>;
}

/**
 * Soft looping gradient crossfade — “video-like” motion without a video asset.
 */
const AnimatedGradientWrapper: React.FC<AnimatedGradientWrapperProps> = ({
  children,
  height,
  style,
}) => {
  const defaultHeight = height ?? Dimensions.get("window").height;
  const blend = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(blend, {
          toValue: 1,
          duration: 7000,
          useNativeDriver: true,
        }),
        Animated.timing(blend, {
          toValue: 0,
          duration: 7000,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [blend]);

  return (
    <View
      style={[
        styles.container,
        { height: defaultHeight as number | undefined },
        style,
      ]}
    >
      <LinearGradient
        colors={[Colors.primary, "#2e4ba8", "#3d5ab8"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.85, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: blend }]}>
        <LinearGradient
          colors={["#152454", Colors.primary, "#5a73c4"]}
          start={{ x: 1, y: 0.1 }}
          end={{ x: 0.2, y: 1 }}
          style={{ flex: 1 }}
        />
      </Animated.View>
      <View style={styles.foreground}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
  },
  foreground: {
    flex: 1,
  },
});

export default AnimatedGradientWrapper;

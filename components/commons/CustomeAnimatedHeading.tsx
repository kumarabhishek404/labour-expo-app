import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  cancelAnimation,
} from "react-native-reanimated";
import CustomHeading from "./CustomHeading";
import Colors from "@/constants/Colors";
import { t } from "@/utils/translationHelper";

const CustomeAnimatedHeading = ({
  title = t("requirementsOfTheService"),
  baseFont = 20,
  fontWeight = "bold",
  textAlign = "center",
  color = Colors?.black,
  icon,
}: any) => {
  const bounce = useSharedValue(0);

  useEffect(() => {
    bounce.value = withRepeat(
      withTiming(-10, {
        duration: 800,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );

    return () => {
      cancelAnimation(bounce);
      bounce.value = 0;
    };
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bounce.value }],
  }));

  return (
    <View style={styles.container}>
      <CustomHeading
        textAlign={textAlign}
        baseFont={baseFont}
        color={color}
        fontWeight={fontWeight}
      >
        {title}
      </CustomHeading>
      <Animated.View style={[animatedStyle, styles.icon]}>
        {icon ? (
          icon
        ) : (
          <MaterialCommunityIcons
            name="hand-pointing-down"
            size={26}
            color={Colors.black}
          />
        )}
      </Animated.View>
    </View>
  );
};

export default CustomeAnimatedHeading;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  icon: {
    marginTop: 4,
  },
});

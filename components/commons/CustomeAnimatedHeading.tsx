import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Easing } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
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
  const bounce = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(bounce, {
          toValue: -10,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(bounce, {
          toValue: 0,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => {
      animation.stop();
      bounce.setValue(0);
    };
  }, [bounce]);

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
      <Animated.View
        style={[
          styles.icon,
          {
            transform: [{ translateY: bounce }],
          },
        ]}
      >
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

import { View, StyleSheet, Animated } from "react-native";
import React, { useEffect, useRef } from "react";
import Colors from "@/constants/Colors";

const SkeletonPlaceholder = ({ style }: { style: any }) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
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
    );

    animation.start();

    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View style={[style, { backgroundColor: "#E1E9EE", opacity }]} />
  );
};

const BookingDetailsPlaceholder = () => {
  return (
    <View style={styles.wrapper}>
      <SkeletonPlaceholder style={styles.imagePlaceholder} />
      <View style={styles.contentWrapper}>
        <SkeletonPlaceholder style={styles.titlePlaceholder} />
        <SkeletonPlaceholder style={styles.subTitlePlaceholder} />
        <SkeletonPlaceholder style={styles.addressPlaceholder} />
        <SkeletonPlaceholder style={styles.datePlaceholder} />
        <SkeletonPlaceholder style={styles.descriptionPlaceholder} />
      </View>
      <View style={styles.actionButtonWrapper}>
        <SkeletonPlaceholder style={styles.buttonPlaceholder} />
        <SkeletonPlaceholder style={styles.buttonPlaceholder} />
      </View>
    </View>
  );
};

export default BookingDetailsPlaceholder;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Colors.fourth,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  imagePlaceholder: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  contentWrapper: {
    marginBottom: 20,
  },
  titlePlaceholder: {
    width: "80%",
    height: 25,
    borderRadius: 4,
    marginBottom: 10,
  },
  subTitlePlaceholder: {
    width: "60%",
    height: 20,
    borderRadius: 4,
    marginBottom: 10,
  },
  addressPlaceholder: {
    width: "50%",
    height: 15,
    borderRadius: 4,
    marginBottom: 10,
  },
  datePlaceholder: {
    width: "40%",
    height: 15,
    borderRadius: 4,
    marginBottom: 10,
  },
  descriptionPlaceholder: {
    width: "100%",
    height: 50,
    borderRadius: 4,
    marginBottom: 20,
  },
  actionButtonWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  buttonPlaceholder: {
    flex: 1,
    height: 40,
    borderRadius: 8,
  },
});

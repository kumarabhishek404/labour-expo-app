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

    return () => animation.stop(); // Cleanup on unmount
  }, [opacity]);

  return (
    <Animated.View style={[style, { backgroundColor: "#E1E9EE", opacity }]} />
  );
};

const ListingsBookingsPlaceholder = () => {
  return (
    <View style={styles.wrapper}>
      {Array.from({ length: 6 }).map((_, index) => (
        <View key={index} style={styles.container}>
          <SkeletonPlaceholder style={styles.tag} />
          <View style={styles.card}>
            <SkeletonPlaceholder style={styles.timePlaceholder} />
            <View style={styles.infoContainer}>
              <SkeletonPlaceholder style={styles.titlePlaceholder} />
              <SkeletonPlaceholder style={styles.subTitlePlaceholder} />
              <SkeletonPlaceholder style={styles.addressPlaceholder} />
              <SkeletonPlaceholder style={styles.datePlaceholder} />
              <SkeletonPlaceholder style={styles.durationPlaceholder} />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

export default ListingsBookingsPlaceholder;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    gap: 20,
    // backgroundColor: Colors?.fourth,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  container: {
    position: "relative",
  },
  tag: {
    width: 60,
    height: 20,
    position: "absolute",
    top: 0,
    right: 0,
    borderRadius: 8,
  },
  card: {
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: 8,
  },
  timePlaceholder: {
    width: 100,
    height: 15,
    borderRadius: 4,
    marginBottom: 5,
  },
  infoContainer: {
    marginBottom: 10,
  },
  titlePlaceholder: {
    width: "80%",
    height: 25,
    borderRadius: 4,
    marginBottom: 6,
  },
  subTitlePlaceholder: {
    width: "60%",
    height: 20,
    borderRadius: 4,
    marginBottom: 6,
  },
  addressPlaceholder: {
    width: "50%",
    height: 15,
    borderRadius: 4,
    marginBottom: 6,
  },
  datePlaceholder: {
    width: "40%",
    height: 15,
    borderRadius: 4,
    marginBottom: 6,
  },
  durationPlaceholder: {
    width: "30%",
    height: 20,
    borderRadius: 4,
  },
});

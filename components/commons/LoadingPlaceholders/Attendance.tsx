import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";

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

  return <Animated.View style={[style, { backgroundColor: "#E1E9EE", opacity, borderRadius: 6 }]} />;
};

const SingleUserAttendanceSkeleton = ({ count = 20 }: { count?: number }) => {
  return (
    <View style={styles.container}>
      {/* Header Skeleton */}
      <View style={styles.header}>
        <SkeletonPlaceholder style={styles.avatar} />
        <View style={styles.headerText}>
          <SkeletonPlaceholder style={styles.nameLine} />
          <SkeletonPlaceholder style={styles.addressLine} />
        </View>
      </View>

      {/* Section Title */}
      <SkeletonPlaceholder style={styles.sectionTitle} />

      {/* Daily Record List */}
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={styles.card}>
          <View style={styles.row}>
            <SkeletonPlaceholder style={styles.icon} />
            <SkeletonPlaceholder style={styles.dateText} />
          </View>
          <SkeletonPlaceholder style={styles.statusPill} />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
  header: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "center",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 14,
  },
  headerText: {
    flex: 1,
  },
  nameLine: {
    width: "50%",
    height: 14,
    marginBottom: 6,
  },
  addressLine: {
    width: "80%",
    height: 12,
  },
  sectionTitle: {
    width: "40%",
    height: 16,
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 24,
    height: 24,
    borderRadius: 4,
    marginRight: 10,
  },
  dateText: {
    width: 150,
    height: 14,
  },
  statusPill: {
    width: 60,
    height: 22,
    borderRadius: 11,
  },
});

export default SingleUserAttendanceSkeleton;
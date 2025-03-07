import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import React, { useRef, useState } from "react";
import { t } from "@/utils/translationHelper";
import CustomText from "./CustomText";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";

const AppliedFilters = ({
  appliedFilters,
  setAppliedFilters,
  fetchUsers,
}: any) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [scrollX, setScrollX] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);

  const checkArrowsVisibility = (
    scrollX: number,
    contentWidth: number,
    containerWidth: number
  ) => {
    setShowLeftArrow(scrollX > 10);
    setShowRightArrow(scrollX + containerWidth < contentWidth - 10);
  };

  const handleScroll = (event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    setScrollX(contentOffset.x);
    checkArrowsVisibility(
      contentOffset.x,
      contentSize.width,
      layoutMeasurement.width
    );
  };

  const scrollByFilter = (direction: "left" | "right") => {
    if (scrollViewRef.current) {
      const scrollOffset =
        direction === "left"
          ? scrollX - containerWidth / 2
          : scrollX + containerWidth / 2;
      scrollViewRef.current.scrollTo({ x: scrollOffset, animated: true });
    }
  };

  const removeFilter = (filterKey: string) => {
    const updatedFilters = { ...appliedFilters };

    if (filterKey === "skills") {
      if (
        Array.isArray(updatedFilters.skills) &&
        updatedFilters.skills.length > 1
      ) {
        updatedFilters.skills.pop();
      } else {
        delete updatedFilters.skills;
      }
    } else {
      delete updatedFilters[filterKey];
    }

    setAppliedFilters(updatedFilters);
    fetchUsers(updatedFilters);
  };

  return (
    <View style={styles.wrapper}>
      {showLeftArrow && (
        <TouchableOpacity
          onPress={() => scrollByFilter("left")}
          style={styles.arrowButton}
        >
          <MaterialIcons
            name="arrow-back-ios"
            size={20}
            color={Colors?.primary}
          />
        </TouchableOpacity>
      )}

      <ScrollView
        horizontal
        ref={scrollViewRef}
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onLayout={(event) => setContainerWidth(event.nativeEvent.layout.width)}
        onContentSizeChange={(width) => {
          setContentWidth(width);
          checkArrowsVisibility(scrollX, width, containerWidth);
        }}
        scrollEventThrottle={16}
        style={styles.scrollContainer}
      >
        {Object.entries(appliedFilters as object).map(([key, value]) => {
          if (
            key === "skills" &&
            (!Array.isArray(value) || value.length === 0)
          ) {
            return null;
          }

          if (key === "rating" && value === 0) {
            return null;
          }

          return (
            value && (
              <View key={key} style={styles.filterTag}>
                <CustomText>{t(key)}: </CustomText>
                {key === "skills" ? (
                  <CustomText>
                    {value.map((item: string) => t(item)).join(", ")}
                  </CustomText>
                ) : key === "rating" ? (
                  <View style={styles.ratingContainer}>
                    <CustomText>{value}</CustomText>
                    <AntDesign name="star" size={18} color="gold" />
                  </View>
                ) : (
                  <CustomText>{t(value)}</CustomText>
                )}
                <TouchableOpacity
                  onPress={() => removeFilter(key)}
                  style={styles.closeIcon}
                >
                  <Ionicons name="close" size={18} color={Colors?.danger} />
                </TouchableOpacity>
              </View>
            )
          );
        })}
      </ScrollView>

      {showRightArrow && (
        <TouchableOpacity
          onPress={() => scrollByFilter("right")}
          style={styles.arrowButton}
        >
          <MaterialIcons
            name="arrow-forward-ios"
            size={20}
            color={Colors?.primary}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  scrollContainer: {
    flexDirection: "row",
  },
  filterTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ddd",
    borderRadius: 20,
    padding: 8,
    marginHorizontal: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  closeIcon: {
    marginLeft: 6,
  },
  arrowButton: {
    paddingHorizontal: 5,
  },
});

export default AppliedFilters;

import React, { useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // ✅ Import Icons
import CustomHeading from "./CustomHeading";
import Colors from "@/constants/Colors";
import PlaceholderImage from "../../assets/banner-placeholder.jpg";

const { width } = Dimensions.get("window");
const height = width * 0.7;

const ImageSlider = ({ images }: any) => {
  const [active, setActive] = useState(0);
  const scrollRef = React.useRef<ScrollView>(null);

  const onScrollChange = ({ nativeEvent }: any) => {
    const slide = Math.ceil(
      nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width
    );
    if (slide !== active) {
      setActive(slide);
    }
  };

  const handleNext = () => {
    if (active < images?.length - 1) {
      scrollRef.current?.scrollTo({ x: (active + 1) * width, animated: true });
      setActive(active + 1);
    }
  };

  const handlePrev = () => {
    if (active > 0) {
      scrollRef.current?.scrollTo({ x: (active - 1) * width, animated: true });
      setActive(active - 1);
    }
  };

  return (
    <View style={styles.container}>
      {/* Left Arrow */}
      {active > 0 && (
        <TouchableOpacity style={styles.leftArrow} onPress={handlePrev}>
          <Ionicons name="chevron-back" size={30} color={Colors.white} />
        </TouchableOpacity>
      )}

      {/* Scroll View */}
      <ScrollView
        ref={scrollRef}
        pagingEnabled
        horizontal
        onScroll={onScrollChange}
        showsHorizontalScrollIndicator={false}
        style={{ width, height }}
        scrollEventThrottle={16}
      >
        {images && images?.length > 0 ? (
          images?.map((image: any, index: number) => (
            <Image
              key={index}
              source={{ uri: image }}
              style={{ width, height, resizeMode: "cover" }}
            />
          ))
        ) : (
          <Image
            source={PlaceholderImage}
            style={{ width, height, resizeMode: "cover" }}
          />
        )}
      </ScrollView>

      {/* Right Arrow */}
      {active < images?.length - 1 && (
        <TouchableOpacity style={styles.rightArrow} onPress={handleNext}>
          <Ionicons name="chevron-forward" size={30} color={Colors.white} />
        </TouchableOpacity>
      )}

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {images?.map((_: any, index: any) => (
          <CustomHeading
            key={index}
            baseFont={50}
            color={index === active ? Colors.white : Colors.secondary}
          >
            •
          </CustomHeading>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  leftArrow: {
    position: "absolute",
    left: 10,
    top: "50%",
    transform: [{ translateY: -15 }],
    zIndex: 2,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 30,
  },
  rightArrow: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: [{ translateY: -15 }],
    zIndex: 2,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 30,
  },
  pagination: {
    flexDirection: "row",
    position: "absolute",
    bottom: -15,
    alignSelf: "center",
  },
});

export default ImageSlider;

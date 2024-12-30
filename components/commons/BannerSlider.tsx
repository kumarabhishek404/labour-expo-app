import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import CustomHeading from "./CustomHeading";
import Banner1 from "../../assets/banners/banner1.png";

const BannerSlider = () => {
  const images = [
    {
      url: Banner1,
      type: "service",
      id: "671eed51103cc59dfe906a8d",
    },
  ];

  const { width } = Dimensions.get("window");
  const containerPadding = 20;
  const scrollViewRef: any = useRef(null);
  const [active, setActive] = useState(0);

  let autoSlideInterval: any = useRef(null);

  const startAutoSlide = () => {
    autoSlideInterval.current = setInterval(() => {
      const nextIndex = (active + 1) % images.length;
      scrollViewRef.current?.scrollTo({
        x: nextIndex * (width - containerPadding),
        animated: true,
      });
      setActive(nextIndex);
    }, 3000);
  };

  const stopAutoSlide = () => {
    if (autoSlideInterval.current) {
      clearInterval(autoSlideInterval.current);
    }
  };

  useEffect(() => {
    startAutoSlide(); // Start auto-sliding on mount
    return () => stopAutoSlide(); // Clean up the interval on unmount
  }, [active, images.length, width]);

  const onScrollChange = ({ nativeEvent }: any) => {
    const slide = Math.ceil(
      nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width
    );
    if (slide !== active) {
      setActive(slide);
    }
  };

  const handleBannerClick = (banner: any) => {
    router.push({
      pathname: "/screens/service/[id]",
      params: { id: banner.id },
    });
  };

  return (
    <View style={styles.container}>
      {/* Outer container to maintain borderRadius and hide overflow */}
      <View style={styles.scrollViewContainer}>
        <ScrollView
          ref={scrollViewRef}
          pagingEnabled
          horizontal
          onScroll={onScrollChange}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollView}
          scrollEventThrottle={16}
        >
          {images.map((image, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.9}
              onPress={() => handleBannerClick(image)}
              onPressIn={stopAutoSlide} // Stop sliding on touch start
              onPressOut={startAutoSlide} // Resume sliding on touch end
              style={{ width: width - containerPadding, height: width * 0.3 }}
            >
              <Image source={image.url} style={styles.image} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View style={styles.pagination}>
        {images.map((_, index) => (
          <CustomHeading
            key={index}
            style={index === active ? styles.activeDot : styles.dot}
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
    marginBottom: 20,
  },
  scrollViewContainer: {
    borderRadius: 10,
    overflow: "hidden",
  },
  scrollView: {
    flexGrow: 0,
  },
  pagination: {
    flexDirection: "row",
    position: "absolute",
    bottom: -15,
    alignSelf: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 10, // Ensures images also have rounded corners
  },
  dot: {
    color: "#888",
    fontSize: 50,
  },
  activeDot: {
    color: "#FFF",
    fontSize: 50,
  },
});

export default BannerSlider;

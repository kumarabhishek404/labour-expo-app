import React, { useState } from "react";
import { View, Image, StyleSheet, ScrollView, Dimensions } from "react-native";
import CustomHeading from "./CustomHeading";
import Colors from "@/constants/Colors";
import PlaceholderImage from "../../assets/banner-placeholder.jpg";

const ImageSlider = ({ images }: any) => {
  const { width } = Dimensions.get("window");
  const height = width * 0.7;

  const [active, setActive] = useState(0);

  const onScrollChange = ({ nativeEvent }: any) => {
    const slide = Math.ceil(
      nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width
    );
    if (slide !== active) {
      setActive(slide);
    }
  };

  return (
    <View>
      <ScrollView
        pagingEnabled
        horizontal
        onScroll={onScrollChange}
        showsHorizontalScrollIndicator={false}
        style={{ width, height }}
      >
        {images && images?.length > 0 ? (
          <>
            {images?.map((image: any, index: number) => (
              <Image
                key={index}
                source={{ uri: image }}
                style={{ width, height, resizeMode: "cover" }}
              />
            ))}
          </>
        ) : (
          <Image
            source={PlaceholderImage}
            style={{ width, height, resizeMode: "cover" }}
          />
        )}
      </ScrollView>
      <View style={styles.pagination}>
        {images?.map((i: any, k: any) => (
          <CustomHeading
            key={k}
            baseFont={50}
            color={k === active ? Colors?.white : Colors?.secondary}
          >
            •
          </CustomHeading>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pagination: {
    flexDirection: "row",
    position: "absolute",
    bottom: -15,
    alignSelf: "center",
  },
});

export default ImageSlider;

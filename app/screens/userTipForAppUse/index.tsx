import { router, Stack } from "expo-router";
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Animated,
} from "react-native";
import CustomText from "@/components/commons/CustomText";
import Colors from "@/constants/Colors";
import { ONBOARDING_SLIDE } from "@/constants";
import { t } from "@/utils/translationHelper";

const { width, height } = Dimensions.get("window");

const OnboardingScreen = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef: any = useRef();

  const handleNext = () => {
    if (currentSlideIndex < ONBOARDING_SLIDE.length - 1) {
      flatListRef.current.scrollToIndex({ index: currentSlideIndex + 1 });
      setCurrentSlideIndex(currentSlideIndex + 1);
    } else {
      router.push("/");
    }
  };

  const Slide = ({ item }: any) => (
    <View style={styles.slide}>
      <Image
        source={item?.image ?? ""}
        style={styles.image}
        resizeMode="contain"
      />
      <CustomText
        baseFont={24}
        fontWeight="bold"
        textAlign="center"
        color={Colors?.primary}
        style={styles.title}
      >
        {t(item.title)}
      </CustomText>
      <CustomText
        baseFont={16}
        textAlign="center"
        color={Colors?.secondaryText}
        style={styles.description}
      >
        {item.description}
      </CustomText>
    </View>
  );

  const renderIndicators = () => {
    return (
      <View style={styles.indicatorContainer}>
        {ONBOARDING_SLIDE.map((_, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];
          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.8, 1.4, 0.8],
            extrapolate: "clamp",
          });
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.5, 1, 0.5],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={index}
              style={[styles.indicator, { transform: [{ scale }], opacity }]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <Animated.FlatList
          ref={flatListRef}
          data={ONBOARDING_SLIDE}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <Slide item={item} />}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / width);
            setCurrentSlideIndex(index);
          }}
        />

        {/* Footer */}
        <View style={styles.footer}>
          {renderIndicators()}
          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>
              {currentSlideIndex === ONBOARDING_SLIDE.length - 1
                ? "Get Started"
                : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingVertical: 30,
  },
  slide: {
    alignItems: "center",
    justifyContent: "center",
    width,
    padding: 20,
  },
  image: {
    width: width * 0.7,
    height: height * 0.4,
  },
  title: {
    marginTop: 20,
  },
  description: {
    marginTop: 10,
    lineHeight: 22,
  },
  footer: {
    height: height * 0.2,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  indicator: {
    height: 10,
    width: 10,
    backgroundColor: Colors.primary,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: Colors.white,
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default OnboardingScreen;

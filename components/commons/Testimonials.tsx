import React, { useRef, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons"; // For social media icons
import Colors from "@/constants/Colors";
import CustomHeading from "./CustomHeading";
import CustomText from "./CustomText";

const { width } = Dimensions.get("window");

const testimonials = [
  {
    firstName: "John",
    lastName: "Doe",
    role: "CEO of XYZ Corp",
    testimonial: "Lorem ipsum dolor sit amet, mea regione diamet principes at.",
    profileImage: "https://randomuser.me/api/portraits/men/1.jpg",
    socialLinks: {
      facebook: "https://facebook.com",
      twitter: "https://twitter.com",
      linkedin: "https://linkedin.com",
    },
  },
  {
    firstName: "Jane",
    lastName: "Smith",
    role: "CTO of ABC Ltd",
    testimonial: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    profileImage: "https://randomuser.me/api/portraits/women/1.jpg",
    socialLinks: {
      facebook: "https://facebook.com",
      twitter: "https://twitter.com",
      linkedin: "https://linkedin.com",
    },
  },
  {
    firstName: "John",
    lastName: "Doe",
    role: "CEO of XYZ Corp",
    testimonial: "Lorem ipsum dolor sit amet, mea regione diamet principes at.",
    profileImage: "https://randomuser.me/api/portraits/men/1.jpg",
    socialLinks: {
      facebook: "https://facebook.com",
      twitter: "https://twitter.com",
      linkedin: "https://linkedin.com",
    },
  },
  {
    firstName: "Jane",
    lastName: "Smith",
    role: "CTO of ABC Ltd",
    testimonial: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    profileImage: "https://randomuser.me/api/portraits/women/1.jpg",
    socialLinks: {
      facebook: "https://facebook.com",
      twitter: "https://twitter.com",
      linkedin: "https://linkedin.com",
    },
  },
  // Add more testimonials as needed
];

const TestimonialSlider = () => {
  const scrollViewRef: any = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const autoSlide = setInterval(() => {
      if (!isPaused) {
        let nextIndex = (currentIndex + 1) % testimonials.length;
        goToSlide(nextIndex);
      }
    }, 3000); // Slide every 3 seconds

    return () => clearInterval(autoSlide);
  }, [currentIndex, isPaused]);

  const handleScroll = (event: any) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(newIndex);
  };

  const goToSlide = (index: number) => {
    scrollViewRef.current.scrollTo({ x: width * index, animated: true });
    setCurrentIndex(index);
  };

  const handleTouchStart = () => {
    setIsPaused(true);
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
  };

  const openLink = (url: any) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <CustomHeading>TESTIMONIALS</CustomHeading>
      <View style={styles.divider}></View>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {testimonials.map((item, index) => (
          <View style={styles.slide} key={index}>
            <View style={styles.iconContainer}>
              <Image
                source={{ uri: item.profileImage }}
                style={styles.profileImage}
              />
            </View>
            <CustomHeading>
              {item.firstName} {item.lastName}
            </CustomHeading>
            <CustomText style={styles.role}>{item.role}</CustomText>

            {/* Social Media Icons */}
            <View style={styles.socialMedia}>
              <TouchableOpacity
                onPress={() => openLink(item.socialLinks.facebook)}
              >
                <FontAwesome
                  name="facebook"
                  size={20}
                  color="#4267B2"
                  style={styles.socialIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => openLink(item.socialLinks.twitter)}
              >
                <FontAwesome
                  name="twitter"
                  size={20}
                  color="#1DA1F2"
                  style={styles.socialIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => openLink(item.socialLinks.linkedin)}
              >
                <FontAwesome
                  name="linkedin"
                  size={20}
                  color="#2867B2"
                  style={styles.socialIcon}
                />
              </TouchableOpacity>
            </View>

            <CustomText>{item.testimonial}</CustomText>
          </View>
        ))}
      </ScrollView>

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {testimonials.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dot,
              currentIndex === index ? styles.activeDot : styles.inactiveDot,
            ]}
            onPress={() => goToSlide(index)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F4FA",
    paddingVertical: 20,
  },
  divider: {
    width: 50,
    height: 2,
    backgroundColor: "#ccc",
    marginVertical: 8,
    marginBottom: 20,
  },
  slide: {
    margin: 10,
    width: width * 0.85,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
    marginHorizontal: width * 0.075, // Center the slide
  },
  iconContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: Colors?.heading,
    padding: 5,
    marginBottom: 15,
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 45,
  },
  role: {
    fontStyle: "italic",
  },
  socialMedia: {
    flexDirection: "row",
    marginVertical: 10,
  },
  socialIcon: {
    marginHorizontal: 10,
  },
  pagination: {
    flexDirection: "row",
    marginTop: 15,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
    marginBottom: 40,
  },
  activeDot: {
    backgroundColor: "#007AFF",
  },
  inactiveDot: {
    backgroundColor: "#C0C0C0",
  },
});

export default TestimonialSlider;

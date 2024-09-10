import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { ListingType } from "@/types/listingType";
import workers from "@/data/workers.json";
import {
  Feather,
  FontAwesome,
  FontAwesome5,
  Ionicons,
} from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import Animated, {
  SlideInDown,
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from "react-native-reanimated";
import ViewMap from "@/components/ViewMap";
import { Avatar } from "react-native-paper";

const { width } = Dimensions.get("window");
const IMG_HEIGHT = 300;

const ListingDetails = () => {
  const { id } = useLocalSearchParams();
  const worker: any = (workers as ListingType[]).find((item) => item.id === id);
  const router = useRouter();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);

  // useEffect(() => {
  //     fetchAllServicesFunc();
  // }, [worker?.id]);

  // const fetchAllServicesFunc = async () => {
  //   console.log("fetching all services");
  //   setIsLoading(true);
  //   try {
  //     const response: any = await fetchAllServices();
  //     // console.log("response while fetching workers - ", response);
  //     setServices(response?.data);
  //     setIsLoading(false);
  //   } catch (err) {
  //     setIsLoading(false);
  //     console.log("error while fetching all services ", err);
  //   }
  // };

  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-IMG_HEIGHT, 0, IMG_HEIGHT],
            [-IMG_HEIGHT / 2, 0, IMG_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(
            scrollOffset.value,
            [-IMG_HEIGHT, 0, IMG_HEIGHT],
            [2, 1, 1]
          ),
        },
      ],
    };
  });

  return (
    <>
      <Stack.Screen
        options={{
          headerTransparent: true,
          headerTitle: "",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                borderRadius: 10,
                padding: 4,
              }}
            >
              <View
                style={{
                  backgroundColor: Colors.white,
                  padding: 6,
                  borderRadius: 10,
                }}
              >
                <Feather name="arrow-left" size={20} />
              </View>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {}}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                borderRadius: 10,
                padding: 4,
              }}
            >
              <View
                style={{
                  backgroundColor: Colors.white,
                  padding: 6,
                  borderRadius: 10,
                }}
              >
                <Ionicons name="bookmark-outline" size={20} />
              </View>
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.container}>
        <Animated.ScrollView
          ref={scrollRef}
          contentContainerStyle={{ paddingBottom: 150 }}
        >
          <Animated.Image
            // source={{ uri: worker.image }}
            style={[styles.image, imageAnimatedStyle]}
          />
          <View style={styles.contentWrapper}>
            <Image source={{ uri: worker.image }} style={styles.workerImage} />
            {/* <Avatar.Image
              style={styles.workerImage}
              source={{
                uri: "https://xsgames.co/randomusers/avatar.php?g=female",
              }}
              size={150}
            /> */}
            <Text style={styles.listingName}>{worker.name}</Text>
            <View style={styles.listingLocationWrapper}>
              <FontAwesome5
                name="map-marker-alt"
                size={18}
                color={Colors.primary}
              />
              <Text style={styles.listingLocationTxt}>{worker.location}</Text>
            </View>

            <View style={styles.highlightWrapper}>
              <View style={{ flexDirection: "row" }}>
                <View style={styles.highlightIcon}>
                  <Ionicons name="time" size={18} color={Colors.primary} />
                </View>
                <View>
                  <Text style={styles.highlightTxt}>Price</Text>
                  <Text style={styles.highlightTxtVal}>
                    {worker.duration} Rs / Day
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: "row" }}>
                <View style={styles.highlightIcon}>
                  <FontAwesome
                    name="users"
                    size={18}
                    color={Colors.primary}
                  />
                </View>
                <View>
                  <Text style={styles.highlightTxt}>Skill</Text>
                  <Text style={styles.highlightTxtVal}>{worker.skills}</Text>
                </View>
              </View>
              <View style={{ flexDirection: "row" }}>
                <View style={styles.highlightIcon}>
                  <Ionicons name="star" size={18} color={Colors.primary} />
                </View>
                <View>
                  <Text style={styles.highlightTxt}>Rating</Text>
                  <Text style={styles.highlightTxtVal}>{worker.rating}</Text>
                </View>
              </View>
            </View>

            <Text style={styles.listingDetails}>{worker.description}</Text>
          </View>
        </Animated.ScrollView>
      </View>

      <Animated.View style={styles.footer} entering={SlideInDown.delay(200)}>
        <TouchableOpacity
          onPress={() => {}}
          style={[styles.footerBtn, styles.footerBookBtn]}
        >
          <Text style={styles.footerBtnTxt}>Book Now</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}} style={styles.footerBtn}>
          <Text style={styles.footerBtnTxt}>${worker.price}</Text>
        </TouchableOpacity>
      </Animated.View>
    </>
  );
};

export default ListingDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  image: {
    width: width,
    height: IMG_HEIGHT,
    backgroundColor: Colors.primary,
  },
  contentWrapper: {
    padding: 20,
    backgroundColor: Colors.white,
  },
  //   workerImage: {
  //     position: 'absolute',
  //     right: 20,
  //     top: -100,
  //   },
  workerImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 20,
    position: "absolute",
    right: 22,
    top: -130,
  },
  listingName: {
    fontSize: 24,
    fontWeight: "500",
    color: Colors.black,
    letterSpacing: 0.5,
  },
  listingLocationWrapper: {
    flexDirection: "row",
    marginTop: 5,
    marginBottom: 10,
    alignItems: "center",
  },
  listingLocationTxt: {
    fontSize: 14,
    marginLeft: 5,
    color: Colors.black,
  },
  highlightWrapper: {
    flexDirection: "row",
    marginVertical: 20,
    justifyContent: "space-between",
  },
  highlightIcon: {
    backgroundColor: "#F4F4F4",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    marginRight: 5,
    alignItems: "center",
  },
  highlightTxt: {
    fontSize: 12,
    color: "#999",
  },
  highlightTxtVal: {
    fontSize: 14,
    fontWeight: "600",
  },
  listingDetails: {
    fontSize: 16,
    color: Colors.black,
    lineHeight: 25,
    letterSpacing: 0.5,
  },
  footer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    padding: 20,
    paddingBottom: 30,
    width: width,
  },
  footerBtn: {
    flex: 1,
    backgroundColor: Colors.black,
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  footerBookBtn: {
    flex: 2,
    backgroundColor: Colors.primary,
    marginRight: 20,
  },
  footerBtnTxt: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
    textTransform: "uppercase",
  },
});

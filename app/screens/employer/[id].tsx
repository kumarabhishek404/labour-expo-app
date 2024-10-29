import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
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
import ViewMap from "@/components/commons/ViewMap";
import { getWorkerById, likeWorker } from "../../api/workers";
import { useMutation, useQuery } from "@tanstack/react-query";
import Loader from "@/components/commons/Loader";
import profileImage from "../../../assets/images/placeholder-person.jpg";
import { useAtomValue } from "jotai";
import { UserAtom } from "@/app/AtomStore/user";
import { sendJoiningRequest } from "@/app/api/requests";
import {
  getEmployerById,
  likeEmployer,
  unlikeEmployer,
} from "@/app/api/employer";
import CoverImage from "../../../assets/banner-placeholder.jpg";
import { toast } from "@/app/hooks/toast";

const { width } = Dimensions.get("window");
const IMG_HEIGHT = 300;

const Worker = () => {
  const userDetails = useAtomValue(UserAtom);
  const { id } = useLocalSearchParams();
  const [employer, setEmployer]: any = useState({});
  // const employer: any = (workers as ListingType[]).find((item) => item._id === id);
  const router = useRouter();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const [isEmployerLiked, setIsEmployerLiked] = useState(
    employer?.likedBy || false
  );

  console.log("id  in parama --", id);

  const {
    isLoading,
    isError,
    data: response,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["employerDetails", { id }],
    queryFn: () => getEmployerById(id),
    retry: false,
    enabled: !!id,
  });

  const mutationLikeEmployer = useMutation({
    mutationKey: ["likeEmployer", { id }],
    mutationFn: () => likeEmployer({ employerID: id }),
    onSuccess: (response) => {
      refetch();
      toast.success("Employer added in favourites");
      console.log("Response while liking a employer - ", response);
    },
    onError: (err) => {
      console.error("error while liking the employer ", err);
    },
  });

  const mutationUnLikeEmployer = useMutation({
    mutationKey: ["unlikeEmployer", { id }],
    mutationFn: () => unlikeEmployer({ employerID: id }),
    onSuccess: (response) => {
      refetch();
      toast.success("Employer removed from favourites");
      console.log("Response while unliking a employer - ", response);
    },
    onError: (err) => {
      console.error("error while unliking the employer ", err);
    },
  });

  useEffect(() => {
    setIsEmployerLiked(employer?.likedBy?.includes(userDetails?._id) || false);
  }, [employer]);

  useFocusEffect(
    React.useCallback(() => {
      const unsubscribe = setEmployer(response?.data);
      return () => unsubscribe;
    }, [response])
  );

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
                borderRadius: 8,
                padding: 4,
              }}
            >
              <View
                style={{
                  backgroundColor: Colors.white,
                  padding: 6,
                  borderRadius: 8,
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
                borderRadius: 8,
                padding: 4,
              }}
            >
              <View
                style={{
                  backgroundColor: Colors.white,
                  padding: 6,
                  borderRadius: 8,
                }}
              >
                <Ionicons name="bookmark-outline" size={20} />
              </View>
            </TouchableOpacity>
          ),
        }}
      />
      <Loader
        loading={
          isLoading ||
          isRefetching ||
          mutationLikeEmployer?.isPending ||
          mutationUnLikeEmployer?.isPending
        }
      />

      <View style={styles.container}>
        <Animated.ScrollView
          ref={scrollRef}
          contentContainerStyle={{ paddingBottom: 150 }}
        >
          <Animated.Image
            source={
              employer?.coverImage ? { uri: employer.coverImage } : CoverImage
            }
            style={[styles.image, imageAnimatedStyle]}
          />
          <View style={styles.contentWrapper}>
            <Image
              source={{ uri: employer?.image }}
              style={styles.workerImage}
            />
            <Image
              style={styles.workerImage}
              source={
                employer?.profilePicture
                  ? { uri: employer?.profilePicture }
                  : profileImage
              }
              // size={150}
            />
            <Text style={styles.listingName}>
              {employer?.firstName} {employer?.middleName} {employer?.lastName}
            </Text>

            <Text style={styles.caption}>EMPLOYER</Text>

            {/* <View style={styles.listingLocationWrapper}>
              <FontAwesome5
                name="map-marker-alt"
                size={18}
                color={Colors.primary}
              />
              <Text style={styles.listingLocationTxt}>
                {employer?.address || "Address not found"}
              </Text>
            </View> */}

            <View style={styles.highlightWrapper}>
              <View
                style={{
                  flexDirection: "row",
                  width: "32%",
                }}
              >
                <View style={styles.highlightIcon}>
                  <Ionicons name="star" size={18} color={Colors.primary} />
                </View>
                <View style={{ width: 90 }}>
                  <Text style={styles.highlightTxt}>Rating</Text>
                  <Text style={styles.highlightTxtVal}>
                    {employer?.rating || 0}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  width: "32%",
                }}
              >
                <View style={styles.highlightIcon}>
                  <FontAwesome name="users" size={18} color={Colors.primary} />
                </View>
                <View style={{ width: 100 }}>
                  <Text style={styles.highlightTxt}>Rank</Text>
                  <Text style={styles.highlightTxtVal}>Beginer</Text>
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  width: "32%",
                }}
              >
                <View style={styles.highlightIcon}>
                  <Ionicons name="time" size={18} color={Colors.primary} />
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: 90,
                  }}
                >
                  <Text style={styles.highlightTxt}>Badge</Text>
                  <Text style={styles.highlightTxtVal}>Jameendar</Text>
                </View>
              </View>
            </View>

            <Text style={styles.listingDetails}>{employer?.description}</Text>

            <View style={styles.userInfoTextWrapper}>
              <View style={styles.userInfoBox}>
                <View style={[styles.row, styles.firstBox]}>
                  <Text style={styles.userInfoText}>
                    <Text style={styles?.infoLabel}>Address</Text>
                    {"  "}
                    {employer?.address || "Address not found"}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.userInfoText}>
                    <Text style={styles?.infoLabel}>Mobile Number</Text>
                    {"  "}
                    {employer?.mobileNumber ||
                      employer?.alternateMobileNumber ||
                      "Mobile not found"}
                  </Text>
                </View>
                <View style={[styles.row, styles.lastBox]}>
                  <Text style={styles.userInfoText}>
                    <Text style={styles?.infoLabel}>Email Address</Text>
                    {"  "}
                    {employer?.email}, {employer?.alternateEmail}
                  </Text>
                </View>
              </View>
            </View>

            <Text style={styles.workInfoHeading}>Wallet</Text>
            <View style={styles.infoBoxWrapper}>
              <View
                style={[
                  styles.infoBox,
                  {
                    borderRightColor: "#dddddd",
                    borderRightWidth: 1,
                  },
                ]}
              >
                <Text>₹ {employer?.earnings?.work}</Text>
                <Text>Spents</Text>
              </View>
              <View style={styles.infoBox}>
                <Text>₹ {employer?.earnings?.rewards}</Text>
                <Text>Rewards</Text>
              </View>
            </View>

            <Text style={styles.workInfoHeading}>Service Information</Text>
            <View style={styles.workInfoWrapper}>
              <View
                style={[
                  styles.workInfoBox,
                  {
                    borderRightColor: "#dddddd",
                    borderRightWidth: 1,
                  },
                ]}
              >
                <Text>{employer?.workDetails?.total}</Text>
                <Text>Total Services</Text>
              </View>
              <View
                style={[
                  styles.workInfoBox,
                  {
                    borderRightColor: "#dddddd",
                    borderRightWidth: 1,
                  },
                ]}
              >
                <Text>{employer?.workDetails?.completed}</Text>
                <Text>Completed</Text>
              </View>
              <View style={styles.workInfoBox}>
                <Text>{employer?.workDetails?.upcoming}</Text>
                <Text>Upcoming</Text>
              </View>
            </View>
          </View>
        </Animated.ScrollView>
      </View>

      <Animated.View style={styles.footer} entering={SlideInDown.delay(200)}>
        <TouchableOpacity
          onPress={() =>
            isEmployerLiked
              ? mutationUnLikeEmployer?.mutate()
              : mutationLikeEmployer?.mutate()
          }
          style={styles.footerBtn}
        >
          <Text style={styles.footerBtnTxt}>
            {isEmployerLiked ? "Unlike" : "Like"}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </>
  );
};

export default Worker;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  image: {
    width: width,
    height: IMG_HEIGHT,
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
    borderRadius: 100,
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
  caption: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
    borderWidth: 1,
    borderColor: "#ddd",
    width: 130,
    padding: 6,
    marginVertical: 8,
    borderRadius: 30,
    textAlign: "center",
    textTransform: "uppercase",
    backgroundColor: "#d6ecdd",
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
    height: 30,
  },
  highlightTxt: {
    fontSize: 12,
    color: "#999",
  },
  highlightTxtVal: {
    fontSize: 14,
    fontWeight: "600",
    marginRight: 10,
  },
  listingDetails: {
    fontSize: 16,
    color: Colors.black,
    lineHeight: 25,
    letterSpacing: 0.5,
  },
  row: {
    paddingTop: 0,
    // backgroundColor: Colors.white,
    flexDirection: "row",
    marginBottom: 5,
    backgroundColor: "#d4d4d4",
  },
  userInfoTextWrapper: {
    // width: '100%',
    // paddingHorizontal: 10,
    marginBottom: 25,
  },
  userInfoBox: {
    // padding: 10,
  },
  userInfoText: {
    fontSize: 13,
    fontWeight: "500",
    padding: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: "#615d5d",
    fontWeight: "600",
  },
  firstBox: {
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
  },
  lastBox: {
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 8,
  },
  infoBoxWrapper: {
    marginTop: 10,
    marginBottom: 20,
    borderBottomColor: "#dddddd",
    borderBottomWidth: 1,
    borderTopColor: "#dddddd",
    borderTopWidth: 1,
    backgroundColor: "#ffffff",
    flexDirection: "row",
    height: 100,
  },
  infoBox: {
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  workInfoHeading: {
    color: Colors.primary,
    // marginLeft: 30,
    fontWeight: "700",
    fontSize: 16,
    lineHeight: 26,
  },
  workInfoWrapper: {
    marginTop: 10,
    borderBottomColor: "#dddddd",
    borderBottomWidth: 1,
    borderTopColor: "#dddddd",
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    height: 100,
    display: "flex",
    flexDirection: "row",
  },
  workInfoBox: {
    width: "33%",
    alignItems: "center",
    justifyContent: "center",
  },
  menuWrapper: {
    marginTop: 10,
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
    borderRadius: 8,
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

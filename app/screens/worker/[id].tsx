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
  useGlobalSearchParams,
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
import {
  bookWorker,
  getWorkerById,
  likeWorker,
  removeBookedWorker,
  unlikeWorker,
} from "../../api/workers";
import { useMutation, useQuery } from "@tanstack/react-query";
import Loader from "@/components/commons/Loader";
import profileImage from "../../../assets/images/placeholder-person.jpg";
import coverImage from "../../../assets/images/placeholder-cover.jpg";
import { useAtomValue } from "jotai";
import { UserAtom } from "@/app/AtomStore/user";
import { sendJoiningRequest } from "@/app/api/requests";
import UserInfoComponent from "@/components/commons/UserInfoBox";
import CoverImage from "../../../assets/banner-placeholder.jpg";
import { toast } from "@/app/hooks/toast";
import SkillSelector from "@/components/commons/skills";
import { WORKERTYPES } from "@/constants";

const { width } = Dimensions.get("window");
const IMG_HEIGHT = 300;

const Worker = () => {
  const userDetails = useAtomValue(UserAtom);
  const { id } = useLocalSearchParams();
  const [worker, setWorker]: any = useState({});
  // const worker: any = (workers as ListingType[]).find((item) => item._id === id);
  const router = useRouter();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const [isWorkerBooked, setIsWorkerBooked] = useState(
    worker?.bookedBy || false
  );
  const [isWorkerLiked, setIsWorkerLiked] = useState(
    worker?.likedBy?.includes(userDetails?._id) || false
  );
  const { type } = useGlobalSearchParams();

  const {
    isLoading,
    isError,
    data: response,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["workerDetails"],
    queryFn: () => getWorkerDetailsById(id),
    retry: 0,
    enabled: !!id,
    // refetchOnWindowFocus: true
  });

  const getWorkerDetailsById = async (id: any) => {
    try {
      const response = await getWorkerById(id);
      return response;
    } catch (err) {
      router.back();
      console.log("error while getting details of worker");
    }
  };

  const mutation = useMutation({
    mutationKey: ["likeWorker", { id }],
    mutationFn: () => likeWorker({ workerID: id }),
    onSuccess: (response) => {
      console.log("Response while liking a worker - ", response);
    },
    onError: (err) => {
      console.error("error while liking the worker ", err);
    },
  });

  const mutationLikeWorker = useMutation({
    mutationKey: ["likeWorker", { id }],
    mutationFn: () => likeWorker({ workerID: id }),
    onSuccess: (response) => {
      refetch();
      toast.success("Worker added in favourites");
      console.log("Response while liking a worker - ", response);
    },
    onError: (err) => {
      console.error("error while liking the worker ", err);
    },
  });

  const mutationUnLikeWorker = useMutation({
    mutationKey: ["unlikeService", { id }],
    mutationFn: () => unlikeWorker({ workerID: id }),
    onSuccess: (response) => {
      refetch();
      toast.success("Worker removed from favourites");
      console.log("Response while unliking a worker - ", response);
    },
    onError: (err) => {
      console.error("error while unliking the worker ", err);
    },
  });

  const mutationBookWorker = useMutation({
    mutationKey: ["bookWorker", { id }],
    mutationFn: () => bookWorker({ workerID: id }),
    onSuccess: (response) => {
      refetch();
      toast.success("Worker booked in successfully");
      console.log("Response while liking a worker - ", response);
    },
    onError: (err) => {
      console.error("error while booking the worker ", err);
    },
  });

  const mutationRemoveBookedWorker = useMutation({
    mutationKey: ["removeBookedService", { id }],
    mutationFn: () => removeBookedWorker({ workerID: id }),
    onSuccess: (response) => {
      refetch();
      toast.success("Successfully cancel booking of the worker");
      console.log(
        "Response while canceling booking of this worker - ",
        response
      );
    },
    onError: (err) => {
      console.error("error while canceling the booking of the worker ", err);
    },
  });

  const mutationSendRequest = useMutation({
    mutationKey: ["sendRequest", { id }],
    mutationFn: () => sendJoiningRequest({ userId: id }),
    onSuccess: (response) => {
      console.log("Response while sending a request to worker - ", response);
    },
    onError: (err) => {
      console.error("error while sending request to worker ", err);
    },
  });

  useEffect(() => {
    setIsWorkerLiked(worker?.likedBy?.includes(userDetails?._id) || false);
    setIsWorkerBooked(worker?.bookedBy?.includes(userDetails?._id) || false);
  }, [worker]);

  useFocusEffect(
    React.useCallback(() => {
      const unsubscribe = setWorker(response?.data);
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
          mutationLikeWorker?.isPending ||
          mutationUnLikeWorker?.isPending ||
          mutationSendRequest?.isPending ||
          mutationBookWorker?.isPending ||
          mutationRemoveBookedWorker?.isPending
        }
      />

      <View style={styles.container}>
        <Animated.ScrollView
          ref={scrollRef}
          contentContainerStyle={{ paddingBottom: 150 }}
        >
          <Animated.Image
            source={
              worker?.coverImage ? { uri: worker?.coverImage } : CoverImage
            }
            style={[styles.image, imageAnimatedStyle]}
          />
          <View style={styles.contentWrapper}>
            <Image
              source={
                worker?.profilePicture
                  ? { uri: worker?.profilePicture }
                  : profileImage
              }
              style={styles.workerImage}
            />
            <Text style={styles.listingName}>
              {worker?.firstName} {worker?.lastName}
            </Text>

            <View style={styles.listingLocationWrapper}>
              <FontAwesome5
                name="map-marker-alt"
                size={18}
                color={Colors.primary}
              />
              <Text style={styles.listingLocationTxt}>
                {worker?.address || "Address not found"}
              </Text>
            </View>

            <View style={styles.highlightWrapper}>
              <View style={styles?.highlightBox}>
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
                  <Text style={styles.highlightTxt}>Price</Text>
                  <Text style={styles.highlightTxtVal}>
                    {worker?.duration || 0} Rs / Day
                  </Text>
                </View>
              </View>
              <View style={styles?.highlightBox}>
                <View style={styles.highlightIcon}>
                  <Ionicons name="star" size={18} color={Colors.primary} />
                </View>
                <View style={{ width: 90 }}>
                  <Text style={styles.highlightTxt}>Rating</Text>
                  <Text style={styles.highlightTxtVal}>
                    {worker?.rating || 0}
                  </Text>
                </View>
              </View>
            </View>

            <SkillSelector
              canAddSkills={false}
              userSkills={worker?.skills}
              availableSkills={WORKERTYPES}
            />

            <View style={styles.highlightWrapper}>
              <View style={[styles?.highlightBox, { width: "100%" }]}>
                <View style={styles.highlightIcon}>
                  <FontAwesome name="users" size={18} color={Colors.primary} />
                </View>
                <View>
                  <Text style={styles.highlightTxt}>Skill</Text>
                  <Text style={styles.highlightTxtVal}>
                    {[
                      "Labour",
                      "Mistri",
                      "Beldaar",
                      "Plumber",
                      "Labour",
                      "Mistri",
                      "Beldaar",
                      "Plumber",
                    ]?.join(", ")}
                  </Text>
                </View>
              </View>
            </View>

            <Text style={styles.listingDetails}>{worker?.description}</Text>

            <UserInfoComponent user={worker} style={{ marginHorizontal: 0 }} />

            {/* <View style={styles.userInfoTextWrapper}>
              <View style={styles.userInfoBox}>
                <View style={[styles.row, styles.firstBox]}>
                  <Text style={styles.userInfoText}>
                    {worker?.address || "Address not found"}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.userInfoText}>
                    {worker?.mobileNumber || "Mobile not found"}
                  </Text>
                </View>
                <View style={[styles.row, styles.lastBox]}>
                  <Text style={styles.userInfoText}>{worker?.email}</Text>
                </View>
              </View>
            </View> */}

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
                <Text>₹ {worker?.earnings?.work}</Text>
                <Text>Earnings</Text>
              </View>
              <View style={styles.infoBox}>
                <Text>₹ {worker?.earnings?.rewards}</Text>
                <Text>Rewards</Text>
              </View>
            </View>

            <Text style={styles.workInfoHeading}>Work Information</Text>
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
                <Text>{worker?.workDetails?.total}</Text>
                <Text>Total Tasks</Text>
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
                <Text>{worker?.workDetails?.completed}</Text>
                <Text>Completed</Text>
              </View>
              <View style={styles.workInfoBox}>
                <Text>{worker?.workDetails?.upcoming}</Text>
                <Text>Pending</Text>
              </View>
            </View>
          </View>
        </Animated.ScrollView>
      </View>

      <Animated.View style={styles.footer} entering={SlideInDown.delay(200)}>
        {type === "applicant" && (
          <TouchableOpacity
            onPress={() => {}}
            style={[styles.footerBtn, styles.footerBookBtn]}
          >
            <Text style={styles.footerBtnTxt}>
              {isWorkerBooked ? "Selected" : "Select"}
            </Text>
          </TouchableOpacity>
        )}

        {userDetails?.role === "EMPLOYER" &&
          (!type || type !== "applicant") && (
            <TouchableOpacity
              onPress={() =>
                isWorkerBooked
                  ? mutationRemoveBookedWorker?.mutate()
                  : mutationBookWorker?.mutate()
              }
              style={[styles.footerBtn, styles.footerBookBtn]}
            >
              <Text style={styles.footerBtnTxt}>
                {isWorkerBooked ? "Already Booked" : "Book Now"}
              </Text>
            </TouchableOpacity>
          )}

        {userDetails?.role === "MEDIATOR" && (
          <TouchableOpacity
            onPress={() => mutationSendRequest?.mutate()}
            style={[styles.footerBtn, styles.footerBookBtn]}
          >
            <Text style={styles.footerBtnTxt}>
              {isWorkerBooked ? "Already Added" : "Add In Your Team"}
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() =>
            isWorkerLiked
              ? mutationUnLikeWorker?.mutate()
              : mutationLikeWorker?.mutate()
          }
          style={styles.footerBtn}
        >
          <Text style={styles.footerBtnTxt}>
            {isWorkerLiked ? "Unlike" : "Like"}
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
    width: "100%",
    flexDirection: "row",
    marginVertical: 10,
    justifyContent: "space-between",
    columnGap: 2,
    // borderColor: "green",
    // borderWidth: 2,
  },
  highlightBox: {
    width: "48%",
    display: "flex",
    flexDirection: "row",
    gap: 4,
    // borderColor: "red",
    // borderWidth: 2,
    // margin: 4,
  },
  highlightIcon: {
    width: 30,
    height: 30,
    display: "flex",
    justifyContent: "center",
    backgroundColor: "#F4F4F4",
    borderRadius: 8,
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
    color: "#777777",
    padding: 12,
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

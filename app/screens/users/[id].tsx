import { Dimensions, Image, StyleSheet, View } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import {
  Stack,
  useFocusEffect,
  useGlobalSearchParams,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from "react-native-reanimated";
import ViewMap from "@/components/commons/ViewMap";
import { getWorkerById } from "../../api/workers";
import { getMediatorById } from "@/app/api/mediator";
import { getEmployerById } from "@/app/api/employer";
import { useQuery } from "@tanstack/react-query";
import profileImage from "../../../assets/images/placeholder-person.jpg";
import { useAtomValue } from "jotai";
import { UserAtom } from "@/app/AtomStore/user";
import UserInfoComponent from "@/components/commons/UserInfoBox";
import CoverImage from "../../../assets/banner-placeholder.jpg";
import SkillSelector from "@/components/commons/SkillSelector";
import { MEDIATORTYPES, WORKERTYPES } from "@/constants";
import WorkInformation from "@/components/commons/WorkInformation";
import WallletInformation from "@/components/commons/WalletInformation";
import CustomHeading from "@/components/commons/CustomHeading";
import CustomText from "@/components/commons/CustomText";
import CustomHeader from "@/components/commons/Header";
import ButtonContainer from "./buttons";
import { t } from "@/utils/translationHelper";
import Button from "@/components/inputs/Button";
import UserReviews from "@/components/commons/UserReviews";
import { Review } from "@/app/types/review";
import { getUserById } from "@/app/api/user";

const { width } = Dimensions.get("window");
const IMG_HEIGHT = 300;

const reviews = [
  {
    id: "1",
    userId: "674d585e47dc62b22234be2d",
    name: "Allison Dorwart",
    date: "19 May 2024",
    rating: 4.5,
    comment:
      "Dr. Stanton was thorough, attentive, and took the time to answer all my questions in detail.",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    type: "Positive",
  },
  {
    id: "2",
    name: "Nuraiz Donin",
    date: "19 May 2024",
    rating: 4.5,
    comment:
      "Dr. Stanton was attentive, listened carefully to my concerns, and offered helpful advice.",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    type: "Positive",
  },
  {
    id: "3",
    name: "John Doe 1",
    date: "19 May 2024",
    rating: 2.0,
    comment:
      "Not a great experience, the doctor was not attentive to my concerns.",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    type: "Positive",
  },
  {
    id: "6754817d80957e069ee47764",
    userId: "67164f9029db9563ef967d7d",
    name: "Abhishek Kumar",
    date: "19 May 2024",
    rating: 2,
    comment: "positive",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    type: "Positive",
  },
  {
    id: "5",
    name: "John Doe 3",
    date: "19 May 2024",
    rating: 2.0,
    comment:
      "Not a great experience, the doctor was not attentive to my concerns.",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    type: "Positive",
  },
  {
    id: "6",
    name: "John Doe 4",
    date: "19 May 2024",
    rating: 2.0,
    comment:
      "Not a great experience, the doctor was not attentive to my concerns.",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    type: "Positive",
  },
  {
    id: "7",
    name: "John Doe 5",
    date: "19 May 2024",
    rating: 2.0,
    comment:
      "Not a great experience, the doctor was not attentive to my concerns.",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    type: "Positive",
  },
  {
    id: "8",
    name: "John Doe 6",
    date: "19 May 2024",
    rating: 2.0,
    comment:
      "Not a great experience, the doctor was not attentive to my concerns.",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    type: "Positive",
  },
  {
    id: "9",
    name: "John Doe 7",
    date: "19 May 2024",
    rating: 2.0,
    comment:
      "Not a great experience, the doctor was not attentive to my concerns.",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    type: "Negative",
  },
];

const Worker = () => {
  const userDetails = useAtomValue(UserAtom);
  const { id } = useLocalSearchParams();
  const [worker, setWorker]: any = useState({});
  const router = useRouter();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const [isWorkerBooked, setIsWorkerBooked] = useState(
    worker?.bookedBy || false
  );
  const [isWorkerLiked, setIsWorkerLiked] = useState(
    worker?.likedBy?.includes(userDetails?._id) || false
  );
  const [isWorkerRequested, setIsWorkerRequested] = useState(
    worker?.requestedBy?.includes(userDetails?._id) || false
  );

  console.log("worker--", worker, userDetails?._id);

  const { role, title } = useGlobalSearchParams();

  const {
    isLoading,
    data: response,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["userDetails"],
    queryFn: () => getUserById(id),
    retry: 0,
    enabled: !!id,
  });

  useEffect(() => {
    setIsWorkerLiked(worker?.likedBy?.includes(userDetails?._id) || false);
    setIsWorkerBooked(worker?.bookedBy?.includes(userDetails?._id) || false);
    setIsWorkerRequested(worker?.requestedBy?.includes(userDetails?._id) || false);
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

  const reviewsSectionRef = useRef<View>(null);
  const [hasUserReviewed, setHasUserReviewed] = useState(false);
  const [reviewsPosition, setReviewsPosition] = useState(0);

  useEffect(() => {
    if (worker?.ratings && userDetails?._id) {
      const userReview = reviews.find(
        (review) => (review as Review).userId === userDetails._id
      );
      setHasUserReviewed(!!userReview);
    }
  }, [worker?.ratings, userDetails?._id]);

  const scrollToReviews = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ y: reviewsPosition, animated: true });
    }
  };

  const handleReviewAction = () => {
    if (hasUserReviewed) {
      scrollToReviews();
    } else {
      router?.push({
        pathname: "/screens/reviews/addReview/[id]",
        params: {
          id: worker?._id,
          role: "workers",
          type: "add",
          data: undefined,
        },
      });
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          header: () => (
            <CustomHeader
              title={Array.isArray(title) ? title[0] : title}
              left="back"
              right="like"
            />
          ),
        }}
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
            <CustomHeading textAlign="left" fontSize={20}>
              {worker?.firstName} {worker?.lastName}
            </CustomHeading>

            <View style={styles.listingLocationWrapper}>
              <FontAwesome5
                name="map-marker-alt"
                size={14}
                color={Colors.primary}
              />
              <CustomText>{worker?.address || "Address not found"}</CustomText>
            </View>

            <View style={styles.highlightWrapper}>
              <View style={styles?.highlightBox}>
                <View style={styles.highlightIcon}>
                  <Ionicons name="time" size={18} color={Colors.primary} />
                </View>
                <View>
                  <CustomText textAlign="left">{t("price")}</CustomText>
                  <CustomHeading fontSize={14} textAlign="left">
                    {worker?.duration || 0} Rs / {t("perDay")}
                  </CustomHeading>
                </View>
              </View>
              <View style={styles?.highlightBox}>
                <View style={styles.highlightIcon}>
                  <Ionicons name="star" size={18} color={Colors.primary} />
                </View>
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <View style={{ flexDirection: "column" }}>
                    <CustomText textAlign="left">{t("rating")}</CustomText>
                    <CustomHeading fontSize={14} textAlign="left">
                      {worker?.rating || 0}
                    </CustomHeading>
                  </View>
                  <Button
                    isPrimary={true}
                    title={hasUserReviewed ? t("viewReview") : t("addReview")}
                    onPress={handleReviewAction}
                    style={{
                      width: 90,
                      paddingVertical: 4,
                      paddingHorizontal: 6,
                      backgroundColor: "#fa6400",
                      borderColor: "#fa6400",
                    }}
                    textStyle={{ fontSize: 13 }}
                  />
                </View>
              </View>
            </View>

            <CustomText>{worker?.description}</CustomText>

            {role !== "employers" && (
              <SkillSelector
                canAddSkills={false}
                isShowLabel={true}
                style={styles?.skillsContainer}
                userSkills={worker?.skills}
                availableSkills={
                  worker?.role === "WORKER" ? WORKERTYPES : MEDIATORTYPES
                }
              />
            )}

            <UserInfoComponent user={worker} style={{ marginHorizontal: 0 }} />

            <WallletInformation type="earnings" wallet={worker} />

            <WorkInformation information={worker} />

            <UserReviews
              ref={reviewsSectionRef}
              onLayout={(event) => {
                const { y } = event.nativeEvent.layout;
                setReviewsPosition(y);
              }}
              workerId={"674d585e47dc62b22234be2d"}
              reviews={reviews.map((review) => ({
                ...review,
                userId: review.userId || "",
                type: review.type as "Positive" | "Negative",
              }))}
            />
          </View>
        </Animated.ScrollView>
      </View>

      <ButtonContainer
        isLoading={isLoading || isRefetching}
        worker={worker}
        refetch={refetch}
        isWorkerBooked={isWorkerBooked}
        isWorkerLiked={isWorkerLiked}
        isWorkerRequested={isWorkerRequested}
      />
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
  workerImage: {
    width: 150,
    height: 150,
    borderRadius: 100,
    marginBottom: 20,
    position: "absolute",
    right: 22,
    top: -130,
  },
  listingLocationWrapper: {
    flexDirection: "row",
    marginTop: 5,
    marginBottom: 10,
    alignItems: "center",
    gap: 6,
  },
  highlightWrapper: {
    width: "100%",
    flexDirection: "row",
    marginVertical: 10,
    justifyContent: "space-between",
    columnGap: 2,
  },
  highlightBox: {
    width: "48%",
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 4,
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
  row: {
    paddingTop: 0,
    flexDirection: "row",
    marginBottom: 5,
    backgroundColor: "#d4d4d4",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    position: "absolute",
    bottom: 0,
    padding: 20,
    paddingBottom: 30,
    width: width,
  },
  skillsContainer: {
    padding: 12,
    flexDirection: "column",
    marginBottom: 5,
    backgroundColor: "#ddd",
    borderTopEndRadius: 8,
    borderTopStartRadius: 8,
  },
});
